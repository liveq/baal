const fs = require('fs')
const path = require('path')

async function runMigration() {
  const projectRef = 'yqddaiisbgcdmsvtpkqj'
  const accessToken = 'sbp_a9d1f5d99313b2b1d8a4f90f4b698c471f61fe49'

  // SQL 파일 읽기
  const sqlPath = path.join(__dirname, '../supabase/migrations/002_add_anonymous_password.sql')
  const sql = fs.readFileSync(sqlPath, 'utf8')

  console.log('Running migration...')
  console.log('SQL:', sql)

  // Supabase Management API를 사용하여 SQL 실행
  const response = await fetch(
    `https://api.supabase.com/v1/projects/${projectRef}/database/query`,
    {
      method: 'POST',
      headers: {
        'Authorization': `Bearer ${accessToken}`,
        'Content-Type': 'application/json'
      },
      body: JSON.stringify({
        query: sql
      })
    }
  )

  const result = await response.json()

  if (!response.ok) {
    console.error('Error:', result)
    throw new Error(`Migration failed: ${JSON.stringify(result)}`)
  }

  console.log('✅ Migration completed successfully!')
  console.log('Result:', result)
}

runMigration().catch(err => {
  console.error('Failed to run migration:', err)
  process.exit(1)
})
