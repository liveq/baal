'use client'

interface HamburgerButtonProps {
  isOpen: boolean
  onClick: () => void
}

export default function HamburgerButton({ isOpen, onClick }: HamburgerButtonProps) {
  return (
    <button
      onClick={onClick}
      className={`fixed top-5 left-5 z-[1000] w-10 h-10 bg-baal-gold rounded-lg flex flex-col justify-center items-center gap-[5px] transition-all duration-300 shadow-baal-md hover:bg-baal-gold-hover ${
        isOpen ? 'opacity-0 invisible pointer-events-none' : 'opacity-100 visible'
      }`}
    >
      <span className="w-5 h-0.5 bg-white transition-all duration-300" />
      <span className="w-5 h-0.5 bg-white transition-all duration-300" />
      <span className="w-5 h-0.5 bg-white transition-all duration-300" />
    </button>
  )
}
