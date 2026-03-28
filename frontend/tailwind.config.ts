import type { Config } from 'tailwindcss'

const config: Config = {
  content: [
    './pages/**/*.{js,ts,jsx,tsx,mdx}',
    './components/**/*.{js,ts,jsx,tsx,mdx}',
    './app/**/*.{js,ts,jsx,tsx,mdx}',
  ],
  theme: {
    extend: {
      colors: {
        // v5-4.html 정확한 색상 시스템
        baal: {
          // Gold Primary Colors
          gold: '#d4af37',        // 메인 골드
          'gold-hover': '#c19b2a', // 골드 호버
          'gold-light': '#f2d478', // 골드 그라데이션 라이트

          // Background Colors
          bg: '#f5f6f7',          // 메인 배경
          'bg-white': '#fff',     // 화이트 배경
          'bg-light': '#fafafa',  // 라이트 회색
          'bg-gray': '#f8f9fa',   // 그레이 배경
          'bg-hover': '#f9f9f9',  // 호버 배경
          'bg-section': '#f0f0f0', // 섹션 배경
          'bg-highlight': '#fffbf0', // 하이라이트 배경

          // Border Colors
          border: '#e5e5e5',      // 메인 보더
          'border-light': '#f5f5f5', // 라이트 보더
          'border-gray': '#f0f0f0',  // 그레이 보더

          // Text Colors
          text: '#1e1e1e',        // 메인 텍스트
          'text-dark': '#333',    // 다크 텍스트
          'text-gray': '#666',    // 그레이 텍스트
          'text-light': '#999',   // 라이트 그레이
          'text-placeholder': '#999', // 플레이스홀더

          // Badge Colors
          'badge-hot': '#ff4444',  // HOT 뱃지
          'badge-new': '#00c73c',  // NEW 뱃지

          // Star/Favorite
          star: '#f4d03f',         // 별표 색상

          // Toast
          toast: '#333',           // 토스트 배경

          // Input/Form
          'input-border': '#ddd',  // 인풋 보더
          'input-focus': 'rgba(212, 175, 55, 0.1)', // 포커스 섀도우
        },

        // 법정 시스템 전용 컬러 (유지)
        court: {
          judge: '#d4af37',    // 판사 (골드로 변경)
          plaintiff: '#c19b2a', // 원고
          defendant: '#52483a', // 피고
        },

        // 평판 등급 컬러 (유지, gold 색상만 조정)
        reputation: {
          trash: '#6b7280',    // 💩 쓰레기통
          bronze: '#cd7f32',   // 🥉 브론즈
          silver: '#c0c0c0',   // 🥈 실버
          gold: '#d4af37',     // 🥇 골드 (v5-4.html 골드로 통일)
          diamond: '#b9f2ff',  // 💎 다이아
        },
      },
      fontFamily: {
        sans: ['-apple-system', 'BlinkMacSystemFont', 'Segoe UI', 'Malgun Gothic', 'sans-serif'],
      },
      boxShadow: {
        'baal': '0 1px 3px rgba(0,0,0,0.1)',
        'baal-md': '0 2px 8px rgba(0,0,0,0.2)',
        'baal-lg': '0 4px 12px rgba(0,0,0,0.15)',
        'baal-xl': '0 4px 12px rgba(0,0,0,0.3)',
      },
      animation: {
        'fade-in': 'fadeIn 0.3s ease-in-out',
        'slide-down': 'slideDown 0.3s ease-out',
        'slide-right': 'slideRight 0.3s ease',
        'toast-in': 'toastIn 0.3s ease',
        'toast-out': 'toastOut 0.3s ease',
      },
      keyframes: {
        fadeIn: {
          '0%': { opacity: '0' },
          '100%': { opacity: '1' },
        },
        slideDown: {
          '0%': { transform: 'translateY(-10px)', opacity: '0' },
          '100%': { transform: 'translateY(0)', opacity: '1' },
        },
        slideRight: {
          '0%': { transform: 'translateX(-100%)' },
          '100%': { transform: 'translateX(0)' },
        },
        toastIn: {
          '0%': { opacity: '0', transform: 'translateX(100%)' },
          '100%': { opacity: '1', transform: 'translateX(0)' },
        },
        toastOut: {
          '0%': { opacity: '1', transform: 'translateX(0)' },
          '100%': { opacity: '0', transform: 'translateX(100%)' },
        },
      },
      maxHeight: {
        '0': '0',
        '300': '300px',
        '1000': '1000px',
      },
    },
  },
  plugins: [],
}

export default config
