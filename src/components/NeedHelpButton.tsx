import { LifeBuoy } from 'lucide-react'

interface NeedHelpButtonProps {
  onClick: () => void
}

export function NeedHelpButton({ onClick }: NeedHelpButtonProps) {
  return (
    <button
      type="button"
      onClick={onClick}
      aria-label="Necesito ayuda"
      className="
        fixed bottom-6 right-6 z-[1900]

        flex items-center gap-3

        px-5 py-4

        bg-red-600 text-white

        border border-red-700/30

        rounded-lg

        shadow-lg

        hover:bg-red-700
        active:scale-[0.98]

        transition-all duration-200

        min-w-[200px]
        justify-center
      "
    >
      <LifeBuoy size={22} />

      <span className="text-base font-bold leading-none tracking-wide">
        Necesito ayuda
      </span>
    </button>
  )
}
