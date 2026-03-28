// 사용자 타입
export interface User {
  id: string
  email: string
  nickname: string
  avatar_url?: string
  reputation: number  // 평판 (명예)
  points: number      // 포인트 (현금)
  role: 'user' | 'admin' | 'moderator'
  created_at: string
  updated_at: string
}

// 게시판 타입
export type BoardType =
  | 'ai'
  | 'humor'
  | 'philosophy'
  | 'occult'
  | 'it'
  | 'hardware'
  | 'economy'
  | 'qna'
  | 'free'

// 게시글 타입
export interface Post {
  id: string
  board_type: BoardType
  title: string
  content: string
  author_id: string
  author?: User
  view_count: number
  upvotes: number
  downvotes: number
  comment_count: number
  is_pinned: boolean
  is_deleted: boolean
  created_at: string
  updated_at: string
}

// 댓글 타입
export interface Comment {
  id: string
  post_id: string
  parent_id?: string  // 대댓글인 경우
  author_id: string
  author?: User
  content: string
  upvotes: number
  downvotes: number
  is_deleted: boolean
  created_at: string
  updated_at: string
  replies?: Comment[]  // 대댓글 목록
}

// 투표 타입
export interface Vote {
  id: string
  user_id: string
  target_type: 'post' | 'comment'
  target_id: string
  vote_type: 'upvote' | 'downvote'
  created_at: string
}

// 사용자 태그 (꼬리표) 타입
export interface UserTag {
  id: string
  user_id: string
  tagged_user_id: string
  tag: string
  color: string
  created_at: string
  updated_at: string
}

// 법정 사건 타입
export interface CourtCase {
  id: string
  plaintiff_id: string  // 원고
  defendant_id: string  // 피고
  plaintiff?: User
  defendant?: User
  post_id?: string      // 원인 게시글
  comment_id?: string   // 원인 댓글
  title: string
  description: string
  status: 'pending' | 'in_progress' | 'judging' | 'completed'
  judge_type: 'ai' | 'jury'
  verdict?: 'plaintiff_win' | 'defendant_win' | 'draw'
  penalty_reputation?: number
  created_at: string
  updated_at: string
  completed_at?: string
}

// 법정 채팅 메시지 타입
export interface CourtMessage {
  id: string
  case_id: string
  user_id: string
  user?: User
  message: string
  message_type: 'chat' | 'evidence' | 'argument'
  created_at: string
}

// 배심원 투표 타입
export interface JuryVote {
  id: string
  case_id: string
  juror_id: string
  juror?: User
  verdict: 'plaintiff_win' | 'defendant_win'
  created_at: string
}

// 변호인 타입
export interface Lawyer {
  id: string
  user_id: string
  user?: User
  total_cases: number
  won_cases: number
  lost_cases: number
  win_rate: number
  specialization?: string
  created_at: string
  updated_at: string
}

// 꿀단지 광고 타입
export interface HoneyAd {
  id: string
  ad_type: 'click' | 'video' | 'survey' | 'gps'
  title: string
  description: string
  reward_points: number
  duration?: number  // 초 단위 (비디오의 경우)
  url?: string
  is_active: boolean
  created_at: string
  updated_at: string
}

// 꿀단지 이력 타입
export interface HoneyHistory {
  id: string
  user_id: string
  ad_id: string
  ad?: HoneyAd
  points_earned: number
  completed_at: string
}

// 포인트 인출 요청 타입
export interface WithdrawalRequest {
  id: string
  user_id: string
  user?: User
  amount: number
  fee: number
  bank_name: string
  account_number: string
  account_holder: string
  status: 'pending' | 'approved' | 'rejected' | 'completed'
  created_at: string
  updated_at: string
  completed_at?: string
}

// 평판 등급 타입
export type ReputationTier =
  | 'trash'    // 💩 쓰레기통 (-100~0)
  | 'bronze'   // 🥉 브론즈 (0~500)
  | 'silver'   // 🥈 실버 (500~2000)
  | 'gold'     // 🥇 골드 (2000~5000)
  | 'diamond'  // 💎 다이아 (5000+)

// 알림 타입
export interface Notification {
  id: string
  user_id: string
  type: 'comment' | 'reply' | 'vote' | 'court' | 'point'
  title: string
  message: string
  link?: string
  is_read: boolean
  created_at: string
}
