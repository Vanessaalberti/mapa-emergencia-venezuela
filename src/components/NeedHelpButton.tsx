interface NeedHelpButtonProps {
  onClick: () => void
}

export function NeedHelpButton({ onClick }: NeedHelpButtonProps) {
  return (
    <button
      type="button"
      onClick={onClick}
      aria-label="Necesito ayuda"
      className="fixed bottom-5 right-4 z-[1900] flex items-center gap-2 px-5 py-4 rounded-full bg-critical text-white font-bold shadow-2xl active:scale-95 transition-transform"
      style={{ boxShadow: '0 4px 20px rgba(220, 38, 38, 0.5)' }}
    >
      <span className="text-2xl">🆘</span>
      <span className="text-base">Necesito Ayuda</span>
    </button>
  )
}
