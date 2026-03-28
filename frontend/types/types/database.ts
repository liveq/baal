// Supabase Database 타입 정의
// 실제 DB 스키마에 맞춰 자동 생성하는 것이 좋지만, 수동으로 정의

export type Json =
  | string
  | number
  | boolean
  | null
  | { [key: string]: Json | undefined }
  | Json[]

export interface Database {
  public: {
    Tables: {
      users: {
        Row: {
          id: string
          email: string
          nickname: string
          avatar_url: string | null
          reputation: number
          points: number
          role: 'user' | 'admin' | 'moderator'
          bio: string | null
          is_banned: boolean
          banned_until: string | null
          last_login_at: string | null
          created_at: string
          updated_at: string
        }
        Insert: {
          id?: string
          email: string
          nickname: string
          avatar_url?: string | null
          reputation?: number
          points?: number
          role?: 'user' | 'admin' | 'moderator'
          bio?: string | null
          is_banned?: boolean
          banned_until?: string | null
          last_login_at?: string | null
          created_at?: string
          updated_at?: string
        }
        Update: {
          id?: string
          email?: string
          nickname?: string
          avatar_url?: string | null
          reputation?: number
          points?: number
          role?: 'user' | 'admin' | 'moderator'
          bio?: string | null
          is_banned?: boolean
          banned_until?: string | null
          last_login_at?: string | null
          created_at?: string
          updated_at?: string
        }
      }
      posts: {
        Row: {
          id: string
          board_type: 'ai' | 'humor' | 'philosophy' | 'occult' | 'it' | 'hardware' | 'economy' | 'qna' | 'free'
          title: string
          content: string
          author_id: string | null
          author_nickname: string | null
          anonymous_password: string | null
          view_count: number
          upvotes: number
          downvotes: number
          comment_count: number
          is_pinned: boolean
          is_deleted: boolean
          is_court_locked: boolean
          created_at: string
          updated_at: string
        }
        Insert: {
          id?: string
          board_type: 'ai' | 'humor' | 'philosophy' | 'occult' | 'it' | 'hardware' | 'economy' | 'qna' | 'free'
          title: string
          content: string
          author_id?: string | null
          author_nickname?: string | null
          anonymous_password?: string | null
          view_count?: number
          upvotes?: number
          downvotes?: number
          comment_count?: number
          is_pinned?: boolean
          is_deleted?: boolean
          is_court_locked?: boolean
          created_at?: string
          updated_at?: string
        }
        Update: {
          id?: string
          board_type?: 'ai' | 'humor' | 'philosophy' | 'occult' | 'it' | 'hardware' | 'economy' | 'qna' | 'free'
          title?: string
          content?: string
          author_id?: string | null
          author_nickname?: string | null
          anonymous_password?: string | null
          view_count?: number
          upvotes?: number
          downvotes?: number
          comment_count?: number
          is_pinned?: boolean
          is_deleted?: boolean
          is_court_locked?: boolean
          created_at?: string
          updated_at?: string
        }
      }
      comments: {
        Row: {
          id: string
          post_id: string
          parent_id: string | null
          author_id: string | null
          author_nickname: string | null
          content: string
          upvotes: number
          downvotes: number
          is_deleted: boolean
          is_court_locked: boolean
          created_at: string
          updated_at: string
        }
        Insert: {
          id?: string
          post_id: string
          parent_id?: string | null
          author_id?: string | null
          author_nickname?: string | null
          content: string
          upvotes?: number
          downvotes?: number
          is_deleted?: boolean
          is_court_locked?: boolean
          created_at?: string
          updated_at?: string
        }
        Update: {
          id?: string
          post_id?: string
          parent_id?: string | null
          author_id?: string | null
          author_nickname?: string | null
          content?: string
          upvotes?: number
          downvotes?: number
          is_deleted?: boolean
          is_court_locked?: boolean
          created_at?: string
          updated_at?: string
        }
      }
      votes: {
        Row: {
          id: string
          user_id: string
          target_type: 'post' | 'comment'
          target_id: string
          vote_type: 'upvote' | 'downvote'
          created_at: string
        }
        Insert: {
          id?: string
          user_id: string
          target_type: 'post' | 'comment'
          target_id: string
          vote_type: 'upvote' | 'downvote'
          created_at?: string
        }
        Update: {
          id?: string
          user_id?: string
          target_type?: 'post' | 'comment'
          target_id?: string
          vote_type?: 'upvote' | 'downvote'
          created_at?: string
        }
      }
      user_tags: {
        Row: {
          id: string
          user_id: string
          tagged_user_id: string
          tag: string
          color: string
          created_at: string
          updated_at: string
        }
        Insert: {
          id?: string
          user_id: string
          tagged_user_id: string
          tag: string
          color?: string
          created_at?: string
          updated_at?: string
        }
        Update: {
          id?: string
          user_id?: string
          tagged_user_id?: string
          tag?: string
          color?: string
          created_at?: string
          updated_at?: string
        }
      }
      court_cases: {
        Row: {
          id: string
          plaintiff_id: string
          defendant_id: string
          post_id: string | null
          comment_id: string | null
          title: string
          description: string
          status: 'pending' | 'in_progress' | 'judging' | 'completed'
          judge_type: 'ai' | 'jury'
          verdict: 'plaintiff_win' | 'defendant_win' | 'draw' | null
          penalty_reputation: number
          ai_reasoning: string | null
          created_at: string
          updated_at: string
          completed_at: string | null
        }
        Insert: {
          id?: string
          plaintiff_id: string
          defendant_id: string
          post_id?: string | null
          comment_id?: string | null
          title: string
          description: string
          status?: 'pending' | 'in_progress' | 'judging' | 'completed'
          judge_type?: 'ai' | 'jury'
          verdict?: 'plaintiff_win' | 'defendant_win' | 'draw' | null
          penalty_reputation?: number
          ai_reasoning?: string | null
          created_at?: string
          updated_at?: string
          completed_at?: string | null
        }
        Update: {
          id?: string
          plaintiff_id?: string
          defendant_id?: string
          post_id?: string | null
          comment_id?: string | null
          title?: string
          description?: string
          status?: 'pending' | 'in_progress' | 'judging' | 'completed'
          judge_type?: 'ai' | 'jury'
          verdict?: 'plaintiff_win' | 'defendant_win' | 'draw' | null
          penalty_reputation?: number
          ai_reasoning?: string | null
          created_at?: string
          updated_at?: string
          completed_at?: string | null
        }
      }
      court_messages: {
        Row: {
          id: string
          case_id: string
          user_id: string
          message: string
          message_type: 'chat' | 'evidence' | 'argument'
          created_at: string
        }
        Insert: {
          id?: string
          case_id: string
          user_id: string
          message: string
          message_type?: 'chat' | 'evidence' | 'argument'
          created_at?: string
        }
        Update: {
          id?: string
          case_id?: string
          user_id?: string
          message?: string
          message_type?: 'chat' | 'evidence' | 'argument'
          created_at?: string
        }
      }
      jury_votes: {
        Row: {
          id: string
          case_id: string
          juror_id: string
          verdict: 'plaintiff_win' | 'defendant_win'
          created_at: string
        }
        Insert: {
          id?: string
          case_id: string
          juror_id: string
          verdict: 'plaintiff_win' | 'defendant_win'
          created_at?: string
        }
        Update: {
          id?: string
          case_id?: string
          juror_id?: string
          verdict?: 'plaintiff_win' | 'defendant_win'
          created_at?: string
        }
      }
      lawyers: {
        Row: {
          id: string
          user_id: string
          total_cases: number
          won_cases: number
          lost_cases: number
          win_rate: number
          specialization: string | null
          is_active: boolean
          created_at: string
          updated_at: string
        }
        Insert: {
          id?: string
          user_id: string
          total_cases?: number
          won_cases?: number
          lost_cases?: number
          win_rate?: number
          specialization?: string | null
          is_active?: boolean
          created_at?: string
          updated_at?: string
        }
        Update: {
          id?: string
          user_id?: string
          total_cases?: number
          won_cases?: number
          lost_cases?: number
          win_rate?: number
          specialization?: string | null
          is_active?: boolean
          created_at?: string
          updated_at?: string
        }
      }
      honey_ads: {
        Row: {
          id: string
          ad_type: 'click' | 'video' | 'survey' | 'gps'
          title: string
          description: string | null
          reward_points: number
          duration: number | null
          url: string | null
          image_url: string | null
          is_active: boolean
          daily_limit: number | null
          created_at: string
          updated_at: string
        }
        Insert: {
          id?: string
          ad_type: 'click' | 'video' | 'survey' | 'gps'
          title: string
          description?: string | null
          reward_points: number
          duration?: number | null
          url?: string | null
          image_url?: string | null
          is_active?: boolean
          daily_limit?: number | null
          created_at?: string
          updated_at?: string
        }
        Update: {
          id?: string
          ad_type?: 'click' | 'video' | 'survey' | 'gps'
          title?: string
          description?: string | null
          reward_points?: number
          duration?: number | null
          url?: string | null
          image_url?: string | null
          is_active?: boolean
          daily_limit?: number | null
          created_at?: string
          updated_at?: string
        }
      }
      honey_history: {
        Row: {
          id: string
          user_id: string
          ad_id: string
          points_earned: number
          ip_address: string | null
          user_agent: string | null
          completed_at: string
        }
        Insert: {
          id?: string
          user_id: string
          ad_id: string
          points_earned: number
          ip_address?: string | null
          user_agent?: string | null
          completed_at?: string
        }
        Update: {
          id?: string
          user_id?: string
          ad_id?: string
          points_earned?: number
          ip_address?: string | null
          user_agent?: string | null
          completed_at?: string
        }
      }
      withdrawal_requests: {
        Row: {
          id: string
          user_id: string
          amount: number
          fee: number
          bank_name: string
          account_number: string
          account_holder: string
          status: 'pending' | 'approved' | 'rejected' | 'completed'
          admin_note: string | null
          created_at: string
          updated_at: string
          completed_at: string | null
        }
        Insert: {
          id?: string
          user_id: string
          amount: number
          fee?: number
          bank_name: string
          account_number: string
          account_holder: string
          status?: 'pending' | 'approved' | 'rejected' | 'completed'
          admin_note?: string | null
          created_at?: string
          updated_at?: string
          completed_at?: string | null
        }
        Update: {
          id?: string
          user_id?: string
          amount?: number
          fee?: number
          bank_name?: string
          account_number?: string
          account_holder?: string
          status?: 'pending' | 'approved' | 'rejected' | 'completed'
          admin_note?: string | null
          created_at?: string
          updated_at?: string
          completed_at?: string | null
        }
      }
      notifications: {
        Row: {
          id: string
          user_id: string
          type: 'comment' | 'reply' | 'vote' | 'court' | 'point' | 'system'
          title: string
          message: string
          link: string | null
          is_read: boolean
          created_at: string
        }
        Insert: {
          id?: string
          user_id: string
          type: 'comment' | 'reply' | 'vote' | 'court' | 'point' | 'system'
          title: string
          message: string
          link?: string | null
          is_read?: boolean
          created_at?: string
        }
        Update: {
          id?: string
          user_id?: string
          type?: 'comment' | 'reply' | 'vote' | 'court' | 'point' | 'system'
          title?: string
          message?: string
          link?: string | null
          is_read?: boolean
          created_at?: string
        }
      }
    }
    Views: {
      [_ in never]: never
    }
    Functions: {
      [_ in never]: never
    }
    Enums: {
      [_ in never]: never
    }
  }
}
