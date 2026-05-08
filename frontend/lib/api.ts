const SUPABASE_URL = process.env.NEXT_PUBLIC_SUPABASE_URL || ''
const SUPABASE_KEY = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY || ''

const supabaseHeaders = {
  apikey: SUPABASE_KEY,
  Authorization: `Bearer ${SUPABASE_KEY}`,
}

async function fetcher<T>(url: string): Promise<T> {
  const res = await fetch(url, {
    headers: supabaseHeaders,
    next: { revalidate: 1800 },
  })
  if (!res.ok) throw new Error(`API ${res.status}`)
  return res.json()
}

export async function getCommunityPosts(board: string, page = 1, limit = 8) {
  const offset = (page - 1) * limit
  const posts = await fetcher<any[]>(
    `${SUPABASE_URL}/rest/v1/posts?board_type=eq.${board}&is_deleted=eq.false&order=created_at.desc&offset=${offset}&limit=${limit}&select=id,title,board_type,author_nickname,created_at,comment_count,upvotes,downvotes,view_count`
  )
  return { posts, total: posts.length }
}

export async function getPost(id: string) {
  const posts = await fetcher<any[]>(
    `${SUPABASE_URL}/rest/v1/posts?id=eq.${id}&is_deleted=eq.false&select=id,title,content,board_type,author_nickname,author_id,created_at,updated_at,comment_count,upvotes,downvotes,view_count,news_category&limit=1`
  )
  const post = posts.length > 0 ? posts[0] : null

  const comments = await fetcher<any[]>(
    `${SUPABASE_URL}/rest/v1/comments?post_id=eq.${id}&is_deleted=eq.false&order=created_at.desc&select=id,post_id,content,author_nickname,author_id,created_at,upvotes`
  )

  return { post, comments }
}

export async function getBoards() {
  return {
    boards: [
      { type: 'ai', name: 'AI' },
      { type: 'humor', name: '유머' },
      { type: 'philosophy', name: '철학' },
      { type: 'occult', name: '신비' },
      { type: 'it', name: 'IT' },
      { type: 'hardware', name: '뉴스' },
      { type: 'economy', name: '경제' },
      { type: 'qna', name: 'Q&A' },
      { type: 'free', name: '자유' },
    ]
  }
}
