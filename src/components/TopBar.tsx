import { Link } from 'react-router-dom'
import { FileText, Globe } from 'lucide-react'

interface TopBarProps {
  onOpenReportForm: () => void
  onOpenLayersPanel: () => void
}

export function TopBar({ onOpenReportForm }: TopBarProps) {
  return (
    <div className="
      flex items-center justify-between

      px-4 py-3

      bg-[#F9FAFB]
      border-b border-neutral-200

      z-[1500]
      relative
    ">
      {/* LEFT - identidad */}
      <div className="flex items-center gap-3 min-w-0">
        <div className="
          w-9 h-9
          flex items-center justify-center
          rounded-md
          bg-[#0B3A6E]
          text-white
          font-bold
          text-sm
        ">
          VE
        </div>

        <div className="flex flex-col min-w-0 leading-tight">
          <span className="font-semibold text-sm sm:text-base text-neutral-900 truncate">
            Mapa de Emergencia
          </span>
          <span className="text-[11px] text-neutral-500 hidden sm:block">
            Venezuela · información ciudadana en tiempo real
          </span>
        </div>
      </div>

      {/* RIGHT - acciones */}
      <div className="flex items-center gap-2 flex-shrink-0">

        <Link
          to="/ayuda-extranjero"
          className="
            flex items-center gap-2

            px-3 py-2

            text-sm font-medium

            border border-neutral-200
            bg-white

            rounded-md

            hover:bg-neutral-50

            transition
          "
        >
          <Globe size={16} className="text-neutral-600" />
          <span className="hidden sm:inline text-neutral-700">
            Apoyo internacional
          </span>
        </Link>

        <button
          type="button"
          onClick={onOpenReportForm}
          className="
            flex items-center gap-2

            px-3 py-2

            text-sm font-semibold

            bg-[#C62828]
            text-white

            rounded-md

            hover:bg-[#B71C1C]

            transition
          "
        >
          <FileText size={16} />
          <span className="hidden sm:inline">
            Reportar situación
          </span>
        </button>

      </div>
    </div>
  )
}
