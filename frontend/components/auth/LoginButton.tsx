'use client'

import { useState } from 'react'

interface LoginButtonProps {
  provider: 'google' | 'kakao' | 'naver'
  onClick: () => void
  disabled?: boolean
}

const providerConfig = {
  google: {
    name: '구글',
    icon: '🔍',
    bgColor: 'bg-white hover:bg-gray-50',
    textColor: 'text-gray-700',
    borderColor: 'border-gray-300'
  },
  kakao: {
    name: '카카오',
    icon: '💬',
    bgColor: 'bg-[#FEE500] hover:bg-[#FDD800]',
    textColor: 'text-[#000000]',
    borderColor: 'border-transparent'
  },
  naver: {
    name: '네이버',
    icon: 'N',
    bgColor: 'bg-[#03C75A] hover:bg-[#02B350]',
    textColor: 'text-white',
    borderColor: 'border-transparent'
  }
}

export default function LoginButton({ provider, onClick, disabled }: LoginButtonProps) {
  const [isLoading, setIsLoading] = useState(false)
  const config = providerConfig[provider]

  const handleClick = async () => {
    setIsLoading(true)
    try {
      await onClick()
    } catch (error) {
      console.error('로그인 오류:', error)
    } finally {
      setIsLoading(false)
    }
  }

  return (
    <button
      onClick={handleClick}
      disabled={disabled || isLoading}
      className={`
        w-full px-6 py-3 rounded-lg font-medium
        border-2 ${config.borderColor}
        ${config.bgColor} ${config.textColor}
        transition-all duration-200
        flex items-center justify-center gap-3
        disabled:opacity-50 disabled:cursor-not-allowed
        shadow-md hover:shadow-lg
      `}
    >
      <span className="text-xl">{config.icon}</span>
      <span>
        {isLoading ? '로그인 중...' : `${config.name}로 시작하기`}
      </span>
    </button>
  )
}
