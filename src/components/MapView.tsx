import { useEffect, useRef } from 'react'
import L from 'leaflet'
import 'leaflet/dist/leaflet.css'
import 'leaflet.markercluster'
import 'leaflet.markercluster/dist/MarkerCluster.css'
import 'leaflet.markercluster/dist/MarkerCluster.Default.css'
import 'leaflet.heat'
import type { Report, ReportCategory } from '../types/database'
import { CATEGORY_CONFIG, URGENT_HEATMAP_CATEGORIES } from '../lib/categoryConfig'

// Coordenadas centrales de Venezuela (vista inicial del mapa)
const VENEZUELA_CENTER: [number, number] = [8.0, -66.0]
const DEFAULT_ZOOM = 6

interface MapViewProps {
  reports: Report[]
  selectedReportId: string | null
  onMarkerClick: (reportId: string) => void
  visibleCategories: Set<ReportCategory>
  heatmapEnabled: boolean
}

function buildEmojiIcon(category: Report['category']): L.DivIcon {
  const config = CATEGORY_CONFIG[category]
  return L.divIcon({
    html: `<div style="
      background:${config.color};
      width:36px;height:36px;
      border-radius:50%;
      display:flex;align-items:center;justify-content:center;
      font-size:18px;
      border:2px solid white;
      box-shadow:0 1px 4px rgba(0,0,0,0.4);
    ">${config.emoji}</div>`,
    className: '',
    iconSize: [36, 36],
    iconAnchor: [18, 18],
  })
}

export function MapView({
  reports,
  selectedReportId,
  onMarkerClick,
  visibleCategories,
  heatmapEnabled,
}: MapViewProps) {
  const mapContainerRef = useRef<HTMLDivElement>(null)
  const mapRef = useRef<L.Map | null>(null)
  const clusterGroupRef = useRef<L.MarkerClusterGroup | null>(null)
  const heatLayerRef = useRef<L.HeatLayer | null>(null)
  const markersByIdRef = useRef<Map<string, L.Marker>>(new Map())

  // Inicializar el mapa una sola vez
  useEffect(() => {
    if (!mapContainerRef.current || mapRef.current) return

    const map = L.map(mapContainerRef.current, {
      center: VENEZUELA_CENTER,
      zoom: DEFAULT_ZOOM,
      zoomControl: true,
      attributionControl: true,
    })

    L.tileLayer('https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png', {
      maxZoom: 19,
      attribution: '© OpenStreetMap contributors',
    }).addTo(map)

    const clusterGroup = L.markerClusterGroup({
      maxClusterRadius: 50,
      spiderfyOnMaxZoom: true,
    })
    map.addLayer(clusterGroup)

    const heatLayer = L.heatLayer([], {
      radius: 35,
      blur: 25,
      maxZoom: 12,
      gradient: { 0.2: '#F59E0B', 0.5: '#EA580C', 1.0: '#DC2626' },
    })

    mapRef.current = map
    clusterGroupRef.current = clusterGroup
    heatLayerRef.current = heatLayer

    return () => {
      map.remove()
      mapRef.current = null
    }
  }, [])

  // Sincronizar marcadores cuando cambian los reportes o las categorías visibles
  useEffect(() => {
    const clusterGroup = clusterGroupRef.current
    if (!clusterGroup) return

    clusterGroup.clearLayers()
    markersByIdRef.current.clear()

    const filteredReports = reports.filter((report) => visibleCategories.has(report.category))

    filteredReports.forEach((report) => {
      const marker = L.marker([report.latitude, report.longitude], {
        icon: buildEmojiIcon(report.category),
      })

      marker.bindPopup(
        `<strong>${CATEGORY_CONFIG[report.category].emoji} ${report.title}</strong><br/>${
          report.address ?? ''
        }`
      )

      marker.on('click', () => onMarkerClick(report.id))

      markersByIdRef.current.set(report.id, marker)
      clusterGroup.addLayer(marker)
    })
  }, [reports, visibleCategories, onMarkerClick])

  // Activar/desactivar y alimentar la capa de heatmap (solo categorías urgentes)
  useEffect(() => {
    const map = mapRef.current
    const heatLayer = heatLayerRef.current
    if (!map || !heatLayer) return

    if (heatmapEnabled) {
      const points: L.HeatLatLngTuple[] = reports
        .filter((report) => URGENT_HEATMAP_CATEGORIES.includes(report.category))
        .map((report) => [report.latitude, report.longitude, 1])

      heatLayer.setLatLngs(points)
      if (!map.hasLayer(heatLayer)) {
        map.addLayer(heatLayer)
      }
    } else if (map.hasLayer(heatLayer)) {
      map.removeLayer(heatLayer)
    }
  }, [reports, heatmapEnabled])

  // Hacer zoom/pan al reporte seleccionado desde el feed
  useEffect(() => {
    if (!selectedReportId) return
    const map = mapRef.current
    const marker = markersByIdRef.current.get(selectedReportId)
    if (!map || !marker) return

    map.setView(marker.getLatLng(), 15, { animate: true })
    marker.openPopup()
  }, [selectedReportId])

  return <div ref={mapContainerRef} className="h-full w-full" />
}
