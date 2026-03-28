import { createClient } from '@/lib/supabase/server'
import { NextResponse } from 'next/server'

// 사용자의 투표 상태 확인
export async function GET(request: Request) {
  try {
    const { searchParams } = new URL(request.url)
    const target_type = searchParams.get('target_type')
    const target_id = searchParams.get('target_id')

    if (!target_type || !target_id) {
      return NextResponse.json({ error: 'Missing parameters' }, { status: 400 })
    }

    const supabase = await createClient()
    const { data: { user } } = await supabase.auth.getUser()

    if (!user) {
      return NextResponse.json({ vote_type: null })
    }

    // 사용자의 투표 조회
    const { data: vote } = await supabase
      .from('votes')
      .select('vote_type')
      .eq('user_id', user.id)
      .eq('target_type', target_type)
      .eq('target_id', target_id)
      .single()

    return NextResponse.json({ vote_type: vote?.vote_type || null })
  } catch (error) {
    console.error('Unexpected error:', error)
    return NextResponse.json({ vote_type: null })
  }
}
