import { NextRequest, NextResponse } from 'next/server'
import { S3Client, PutObjectCommand, ListObjectsV2Command, DeleteObjectCommand } from '@aws-sdk/client-s3'

// R2 설정 (S3 호환)
const R2 = new S3Client({
  region: 'auto',
  endpoint: `https://${process.env.CLOUDFLARE_ACCOUNT_ID}.r2.cloudflarestorage.com`,
  credentials: {
    accessKeyId: process.env.R2_ACCESS_KEY_ID || '',
    secretAccessKey: process.env.R2_SECRET_ACCESS_KEY || '',
  },
})

const BUCKET = 'baal-images'
const MAX_FILE_SIZE = 200 * 1024          // 200KB
const MAX_BUCKET_SIZE = 8 * 1024 * 1024 * 1024  // 8GB (10GB 한도에서 2GB 여유)
const MAX_UPLOADS_PER_DAY = 30            // 유저당 하루 30장
const CLEANUP_TARGET = 7 * 1024 * 1024 * 1024   // 7GB 넘으면 오래된 것부터 삭제

// 간단한 업로드 카운터 (메모리 기반, 서버리스라 인스턴스별)
const uploadCounts = new Map<string, { count: number; date: string }>()

function checkDailyLimit(ip: string): boolean {
  const today = new Date().toISOString().slice(0, 10)
  const entry = uploadCounts.get(ip)
  if (!entry || entry.date !== today) {
    uploadCounts.set(ip, { count: 1, date: today })
    return true
  }
  if (entry.count >= MAX_UPLOADS_PER_DAY) return false
  entry.count++
  return true
}

async function getBucketSize(): Promise<number> {
  let totalSize = 0
  let continuationToken: string | undefined

  do {
    const res = await R2.send(new ListObjectsV2Command({
      Bucket: BUCKET,
      ContinuationToken: continuationToken,
    }))
    for (const obj of res.Contents || []) {
      totalSize += obj.Size || 0
    }
    continuationToken = res.NextContinuationToken
  } while (continuationToken)

  return totalSize
}

async function cleanupOldFiles(targetSize: number): Promise<number> {
  // 오래된 파일부터 삭제하여 targetSize 이하로 만듦
  const res = await R2.send(new ListObjectsV2Command({ Bucket: BUCKET }))
  const objects = (res.Contents || [])
    .sort((a, b) => (a.LastModified?.getTime() || 0) - (b.LastModified?.getTime() || 0))

  let currentSize = objects.reduce((sum, obj) => sum + (obj.Size || 0), 0)
  let deleted = 0

  for (const obj of objects) {
    if (currentSize <= targetSize) break
    if (!obj.Key) continue

    await R2.send(new DeleteObjectCommand({ Bucket: BUCKET, Key: obj.Key }))
    currentSize -= obj.Size || 0
    deleted++
  }

  return deleted
}

export async function POST(request: NextRequest) {
  try {
    // IP Rate Limit
    const ip = request.headers.get('x-forwarded-for')?.split(',')[0]?.trim() || 'unknown'
    if (!checkDailyLimit(ip)) {
      return NextResponse.json({ error: '일일 업로드 한도(10장) 초과' }, { status: 429 })
    }

    const formData = await request.formData()
    const file = formData.get('file') as File
    if (!file) {
      return NextResponse.json({ error: '파일 없음' }, { status: 400 })
    }

    // 파일 크기 체크
    if (file.size > MAX_FILE_SIZE) {
      return NextResponse.json({ error: `파일 크기 초과 (최대 ${MAX_FILE_SIZE / 1024}KB)` }, { status: 400 })
    }

    // 파일 타입 체크
    const allowedTypes = ['image/jpeg', 'image/png', 'image/gif', 'image/webp']
    if (!allowedTypes.includes(file.type)) {
      return NextResponse.json({ error: '허용되지 않는 파일 형식' }, { status: 400 })
    }

    // 버킷 용량 체크 (과금 방어 핵심)
    const bucketSize = await getBucketSize()
    if (bucketSize > MAX_BUCKET_SIZE) {
      // 8GB 초과 → 업로드 차단
      return NextResponse.json({ error: '저장 공간 부족. 관리자에게 문의하세요.' }, { status: 507 })
    }

    // 7GB 넘으면 오래된 것부터 자동 정리
    if (bucketSize > CLEANUP_TARGET) {
      const deleted = await cleanupOldFiles(CLEANUP_TARGET)
      console.log(`[R2] 자동 정리: ${deleted}개 파일 삭제`)
    }

    // 파일명 랜덤화 (보안)
    const ext = file.name.split('.').pop() || 'webp'
    const key = `${Date.now()}_${Math.random().toString(36).slice(2, 8)}.${ext}`

    // R2 업로드
    const buffer = Buffer.from(await file.arrayBuffer())
    await R2.send(new PutObjectCommand({
      Bucket: BUCKET,
      Key: key,
      Body: buffer,
      ContentType: file.type,
    }))

    // 공개 URL 반환 (r2.dev 퍼블릭, 커스텀 도메인 정상화 후 r2.baal.co.kr로 전환)
    const url = `https://pub-f9e8ddf537b04dcaa5f5d326c5545a34.r2.dev/${key}`

    return NextResponse.json({ url, key, size: file.size })

  } catch (error: any) {
    console.error('[R2 Upload Error]', error)
    const msg = error?.message || '업로드 실패'
    return NextResponse.json({ error: msg }, { status: 500 })
  }
}
