import { useState, useCallback, useMemo } from 'react'
import { MapView } from '../components/MapView'
import { ReportFeed } from '../components/ReportFeed'
import { TopBar } from '../components/TopBar'
import { NeedHelpButton } from '../components/NeedHelpButton'
import { ReportForm } from '../components/ReportForm'
import { NeedHelpForm } from '../components/NeedHelpForm'
import { SuccessToast } from '../components/SuccessToast'
import { LayersPanel } from '../components/LayersPanel'
import { MapLegend } from '../components/MapLegend'
import { AuthModal } from '../components/AuthModal'
import { ProfileModal } from '../components/ProfileModal'
import { AdminPanel } from '../components/admin/AdminPanel'
import { useReports } from '../hooks/useReports'
import { useLayers } from '../hooks/useLayers'
import { Footer } from '../components/Footer'
import { usePaginatedReports } from '../hooks/usePaginatedReports'
import { SlidersHorizontal } from 'lucide-react'

type ActiveModal = 'report' | 'needHelp' | 'layers' | 'auth' | 'profile' | 'admin' | null

export function HomePage() {
  const { reports, loading, error } = useReports()
  const { reports: paginatedReports, currentPage, totalPages, nextPage, previousPage, } = usePaginatedReports()
  const [selectedReportId, setSelectedReportId] = useState<string | null>(null)
  const [activeModal, setActiveModal] = useState<ActiveModal>(null)
  const [successMessage, setSuccessMessage] = useState<string | null>(null)

  const {
    visibleCategories,
    heatmapEnabled,
    toggleCategory,
    toggleHeatmap,
    showAll,
    hideAll,
    isAllVisible,
  } = useLayers()

  const visiblePaginatedReports = useMemo(
  () =>
    paginatedReports.filter((report) =>
      visibleCategories.has(report.category)
    ),
  [paginatedReports, visibleCategories]
)
  const handleSelectReport = useCallback((reportId: string) => {
    setSelectedReportId(reportId)
  }, [])

  const handleReportSuccess = () => {
    setActiveModal(null)
    setSuccessMessage('Tu reporte fue publicado. Ya es visible en el mapa.')
  }

  const handleNeedHelpSuccess = () => {
    setActiveModal(null)
    setSuccessMessage('Tu solicitud de ayuda fue publicada y es visible para todos.')
  }

  return (
    <div className="min-h-screen w-full bg-bg-primary overflow-x-hidden">
      <TopBar
        onOpenReportForm={() => setActiveModal('report')}
        onOpenLayersPanel={() => setActiveModal('layers')}
      />
      <div className="sticky top-[50px] h-[55vh] relative z-10">
        <MapView
          reports={reports}
          selectedReportId={selectedReportId}
          onMarkerClick={handleSelectReport}
          visibleCategories={visibleCategories}
          heatmapEnabled={heatmapEnabled}
        />
        <button
          onClick={() => setActiveModal('layers')}
          className="absolute top-4 right-4 z-[1000] flex items-center gap-2 bg-white border border-border rounded-md px-3 py-2 hover:bg-neutral-50 transition"
        >
          <SlidersHorizontal size={18} />
          <span className="font-medium">Filtros</span>
        </button>
        <MapLegend reports={reports} visibleCategories={visibleCategories} />

        {error && (
          <div className="absolute top-2 left-1/2 -translate-x-1/2 bg-critical text-white text-sm px-4 py-2 rounded-lg shadow-lg z-[1000]">
            No se pudieron cargar los reportes: {error}
          </div>
        )}

        {loading && (
          <div className="absolute top-2 left-1/2 -translate-x-1/2 bg-bg-primary dark:bg-neutral-900 text-sm px-4 py-2 rounded-lg shadow-lg z-[1000]">
            Cargando reportes...
          </div>
        )}
      </div>

      <div className="border-t border-border" style={{ flex: '1 1 0%' }}>
        <ReportFeed
          reports={visiblePaginatedReports}
          selectedReportId={selectedReportId}
          onSelectReport={handleSelectReport}
          currentPage={currentPage}
          totalPages={totalPages}
          onNextPage={nextPage}
          onPreviousPage={previousPage}
        />
      </div>

      <NeedHelpButton onClick={() => setActiveModal('needHelp')} />

      {activeModal === 'report' && (
        <ReportForm onClose={() => setActiveModal(null)} onSuccess={handleReportSuccess} />
      )}

      {activeModal === 'needHelp' && (
        <NeedHelpForm onClose={() => setActiveModal(null)} onSuccess={handleNeedHelpSuccess} />
      )}

      {activeModal === 'layers' && (
        <LayersPanel
          visibleCategories={visibleCategories}
          heatmapEnabled={heatmapEnabled}
          isAllVisible={isAllVisible}
          onToggleCategory={toggleCategory}
          onToggleHeatmap={toggleHeatmap}
          onShowAll={showAll}
          onHideAll={hideAll}
          onClose={() => setActiveModal(null)}
        />
      )}

      {activeModal === 'auth' && <AuthModal onClose={() => setActiveModal(null)} />}

      {activeModal === 'profile' && (
        <ProfileModal
          onClose={() => setActiveModal(null)}
          onOpenAdminPanel={() => setActiveModal('admin')}
        />
      )}

      {activeModal === 'admin' && (
        <AdminPanel reports={reports} onClose={() => setActiveModal(null)} />
      )}

      {successMessage && (
        <SuccessToast message={successMessage} onDismiss={() => setSuccessMessage(null)} />
      )}
      <Footer />
    </div>
  )
}
