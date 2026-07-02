import { useEffect, useRef } from 'react'
import { loadGoogleMaps } from '../lib/googleMaps'
import type { Report, ReportCategory, ReportPriority } from '../types/database'
import { MarkerClusterer } from '@googlemaps/markerclusterer'
import {
  CATEGORY_CONFIG,
  URGENT_HEATMAP_CATEGORIES,
} from '../lib/categoryConfig'

const VENEZUELA_CENTER = { lat: 8.0, lng: -66.0 }
const DEFAULT_ZOOM = 6

interface MapViewProps {
  reports: Report[]
  selectedReportId: string | null
  onMarkerClick: (reportId: string) => void
  visibleCategories: Set<ReportCategory>
  heatmapEnabled: boolean
}

export function MapView({
  reports,
  selectedReportId,
  onMarkerClick,
  visibleCategories,
  heatmapEnabled,
}: MapViewProps) {

  const mapRef = useRef<HTMLDivElement>(null)
  const mapInstance = useRef<google.maps.Map | null>(null)
  const markersRef = useRef<Map<string, google.maps.Marker>>(new Map())
  const clusterRef = useRef<MarkerClusterer | null>(null)
  const infoWindowRef = useRef<google.maps.InfoWindow | null>(null)
  const heatmapRef = useRef<any>(null)

  // ✅ INIT MAP (seguro)
  useEffect(() => {
    let mounted = true

    async function init() {
      if (!mapRef.current || mapInstance.current) return

      const google = await loadGoogleMaps()
      if (!mounted) return

      const map = new google.maps.Map(mapRef.current, {
        center: VENEZUELA_CENTER,
        zoom: DEFAULT_ZOOM,
        mapTypeControl: true,
        streetViewControl: false,
        fullscreenControl: false,

        draggable: true,
        scrollwheel: true, 
        gestureHandling: "auto" 
      })

      mapInstance.current = map
      infoWindowRef.current = new google.maps.InfoWindow()

      if ((google.maps as any).visualization) {
        heatmapRef.current = new (google.maps as any).visualization.HeatmapLayer({
          radius: 35,
        })
      }
    }

    init()

    return () => {
      mounted = false
    }
  }, [])

  // ✅ MARKERS + CLUSTER (FIX REAL)
  useEffect(() => {
    const map = mapInstance.current
    const infoWindow = infoWindowRef.current
    if (!map || !infoWindow) return

    // limpiar markers
    markersRef.current.forEach((m) => m.setMap(null))
    markersRef.current.clear()

    if (clusterRef.current) {
      clusterRef.current.clearMarkers()
    }

    const filtered = reports.filter((r) =>
      visibleCategories.has(r.category)
    )

    const markers: google.maps.Marker[] = []

    filtered.forEach((report) => {
      const config = CATEGORY_CONFIG[report.category]

      const marker = new google.maps.Marker({
        position: {
          lat: report.latitude,
          lng: report.longitude,
        },
        map, // 🔥 IMPORTANTE (esto faltaba a veces)
        icon: {
          url:
            'data:image/svg+xml;charset=UTF-8,' +
            encodeURIComponent(`
              <svg xmlns="http://www.w3.org/2000/svg" width="40" height="40">
                <circle cx="20" cy="20" r="16" fill="${config.color}" stroke="white" stroke-width="2"/>
                <text x="20" y="25" text-anchor="middle" font-size="16">
                  ${config.emoji}
                </text>
              </svg>
            `),
          scaledSize: new google.maps.Size(40, 40),
        },
      })

      marker.addListener('click', () => {
        onMarkerClick(report.id)

        infoWindow.setContent(`
          <div style="font-family:sans-serif;max-width:240px">
            <div style="font-weight:700;font-size:14px;">
              ${config.emoji} ${report.title}
            </div>

            ${report.address ? `<div style="font-size:12px;">📍 ${report.address}</div>` : ''}

            ${report.description ? `<div style="font-size:12px;margin-top:6px;">${report.description}</div>` : ''}
          </div>
        `)

        infoWindow.open(map, marker)
      })

      markersRef.current.set(report.id, marker)
      markers.push(marker)
    })

    clusterRef.current = new MarkerClusterer({
      map,
      markers,
    })
  }, [reports, visibleCategories, onMarkerClick])

  // ✅ ZOOM SELECTED
  useEffect(() => {
    const map = mapInstance.current
    if (!map || !selectedReportId) return

    const marker = markersRef.current.get(selectedReportId)
    if (!marker) return

    const pos = marker.getPosition()
    if (!pos) return

    map.panTo(pos)
    map.setZoom(15)
  }, [selectedReportId])

  // 🔥 HEATMAP (FIX + SIN ROMPER MARKERS)
  useEffect(() => {
    const map = mapInstance.current
    const heatmap = heatmapRef.current
    const google = window.google

    if (!map || !heatmap || !google) return

    if (!heatmapEnabled) {
      heatmap.setMap(null)
      return
    }

    const weight = (p: ReportPriority) =>
      p === 'critica' ? 6 : p === 'alta' ? 4 : p === 'media' ? 2 : 1

    const points = reports
      .filter((r) => URGENT_HEATMAP_CATEGORIES.includes(r.category))
      .map((r) => ({
        location: new google.maps.LatLng(r.latitude, r.longitude),
        weight: weight(r.priority),
      }))

    heatmap.setData(points)
    heatmap.setMap(map)
  }, [reports, heatmapEnabled])

  return <div ref={mapRef} className="w-full h-full" />
}