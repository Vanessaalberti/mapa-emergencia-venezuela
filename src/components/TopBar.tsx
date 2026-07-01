import { Link } from 'react-router-dom'
import { FileText, Globe } from 'lucide-react'

interface TopBarProps {
  onOpenReportForm: () => void
  onOpenLayersPanel: () => void
}

export function TopBar({ onOpenReportForm }: TopBarProps) {
  return (
    <div className="
      relative
      flex items-center justify-between

      px-4 py-2.5

      bg-[#FAFAFA]
      border-b border-neutral-200

      z-[1500]
    ">

      {/* LEFT - identidad */}
      <div className="flex items-center gap-3 min-w-0">

        <div className="
          w-9 h-9
          flex items-center justify-center

          rounded-[10px]

          bg-[#0B3A6E]
          text-white

          font-black text-[13px]
          tracking-wide

          shadow-sm
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
            text-neutral-600

            rounded-md

            hover:bg-neutral-100
            active:scale-[0.98]

            transition
          "
        >
          <Globe size={16} className="text-neutral-500" />
          <span className="hidden sm:inline">
            Apoyo internacional
          </span>
        </Link>

        <button
          type="button"
          onClick={onOpenReportForm}
          className="
            flex items-center gap-2

            px-4 py-2

            text-sm font-bold

            bg-[#C62828]
            text-white

            rounded-md

            shadow-sm
            border border-red-700/20

            hover:bg-[#B71C1C]
            active:scale-[0.98]

            transition
          "
        >
          <FileText size={16} />
          <span className="hidden sm:inline">
            Reportar situación
          </span>
        </button>

      </div>

      {/* 🇻🇪 FRANJA TRICOLOR SUTIL */}
      <div className="absolute bottom-0 left-0 w-full h-[2px] flex">
        <div className="flex-1 bg-[#F4D03F]" />
        <div className="flex-1 bg-[#1F4E79]" />
        <div className="flex-1 bg-[#C62828]" />
      </div>

    </div>
  )
}
