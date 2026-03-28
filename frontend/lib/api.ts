const API = process.env.NEXT_PUBLIC_API_URL || 'http://localhost:8080'

async function fetcher<T>(path: string): Promise<T> {
  const res = await fetch(`${API}${path}`, { next: { revalidate: 10 } })
  if (!res.ok) throw new Error(`API ${res.status}`)
  return res.json()
}

export async function getCommunityPosts(board: string, page = 1, limit = 8) {
  return fetcher<{ posts: any[]; total: number }>(
    `/api/community/posts?board=${board}&page=${page}&limit=${limit}`
  )
}

export async function getPost(id: string) {
  return fetcher<{ post: any; comments: any[] }>(`/api/community/posts/${id}`)
}

export async function getBoards() {
  return fetcher<{ boards: { type: string; name: string }[] }>('/api/community/boards')
}
