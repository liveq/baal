import type { Database } from './database'

// 데이터베이스 Row 타입
export type Post = Database['public']['Tables']['posts']['Row']
export type Comment = Database['public']['Tables']['comments']['Row']
export type Vote = Database['public']['Tables']['votes']['Row']
export type User = Database['public']['Tables']['users']['Row']

// 게시글 상세 (작성자 정보 포함)
export interface PostDetail extends Post {
  author?: User | null
}

// 댓글 상세 (작성자 + 대댓글)
export interface CommentDetail extends Comment {
  author?: User | null
  replies?: CommentDetail[]
  vote?: Vote | null // 현재 사용자의 투표 상태
}

// 게시글 목록 아이템 (UI용)
export interface PostListItem {
  id: string
  title: string
  author: string
  time: string
  comments: number
  views?: number
  upvotes?: number
  badge?: 'HOT' | 'NEW'
  badgeType?: 'hot' | 'new'
}

// 게시판 타입
export type BoardType = 'ai' | 'humor' | 'philosophy' | 'occult' | 'it' | 'hardware' | 'economy' | 'qna' | 'free'

// 게시판 정보
export interface BoardInfo {
  type: BoardType
  title: string
  emoji: string
  description?: string
}

// 투표 타입
export type VoteType = 'upvote' | 'downvote'

// 투표 상태
export interface VoteStatus {
  upvotes: number
  downvotes: number
  userVote: VoteType | null
}
