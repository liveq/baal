const { Client } = require('pg')

async function main() {
  const client = new Client({
    host: 'db.yqddaiisbgcdmsvtpkqj.supabase.co',
    port: 5432,
    database: 'postgres',
    user: 'postgres',
    password: '1q2w3e4r1!',
    ssl: {
      rejectUnauthorized: false
    }
  })

  try {
    console.log('Connecting to database...')
    await client.connect()
    console.log('Connected!')

    console.log('Adding anonymous_password column to posts table...')
    await client.query('ALTER TABLE posts ADD COLUMN IF NOT EXISTS anonymous_password TEXT')
    console.log('✓ Added to posts table')

    console.log('Adding anonymous_password column to comments table...')
    await client.query('ALTER TABLE comments ADD COLUMN IF NOT EXISTS anonymous_password TEXT')
    console.log('✓ Added to comments table')

    console.log('\n✅ All columns added successfully!')
  } catch (err) {
    console.error('Error:', err.message)
    process.exit(1)
  } finally {
    await client.end()
  }
}

main()
