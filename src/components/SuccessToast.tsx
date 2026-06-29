import { useEffect } from 'react'

interface SuccessToastProps {
  message: string
  onDismiss: () => void
}

export function SuccessToast({ message, onDismiss }: SuccessToastProps) {
  useEffect(() => {
    const timer = setTimeout(onDismiss, 4000)
    return () => clearTimeout(timer)
  }, [onDismiss])

  return (
    <div className="fixed top-16 left-1/2 -translate-x-1/2 z-[2100] bg-success text-white px-5 py-3 rounded-full shadow-xl font-semibold text-sm flex items-center gap-2">
      <span>✅</span>
      <span>{message}</span>
    </div>
  )
}
