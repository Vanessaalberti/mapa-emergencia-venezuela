import { useEffect, useRef } from 'react'
import { loadGoogleMaps } from '../lib/googleMaps'

interface Props {
  lat: number
  lng: number
  onChange: (lat: number, lng: number) => void
}

export function DraggableMiniMap({ lat, lng, onChange }: Props) {
  const ref = useRef<HTMLDivElement | null>(null)
  const mapRef = useRef<google.maps.Map | null>(null)
  const markerRef = useRef<google.maps.Marker | null>(null)

  useEffect(() => {
  if (!ref.current) return

  let map: google.maps.Map
  let marker: google.maps.Marker

  let isMounted = true

  async function init() {
    const google = await loadGoogleMaps()

    if (!isMounted) return

    map = new google.maps.Map(ref.current!, {
      center: { lat, lng },
      zoom: 6, // 👈 SIEMPRE ZOOM GENERAL AL INICIAR
      mapTypeControl: false,
      streetViewControl: false,
      fullscreenControl: false,
    })

    mapRef.current = map

    // marker SOLO si hay coords válidas
    if (lat != null && lng != null) {
      marker = new google.maps.Marker({
        position: { lat, lng },
        map,
        draggable: true,
      })

      markerRef.current = marker
    }

    // click
    map.addListener('click', (e: google.maps.MapMouseEvent) => {
      const newLat = e.latLng?.lat()
      const newLng = e.latLng?.lng()
      if (newLat == null || newLng == null) return

      if (!markerRef.current) {
        markerRef.current = new google.maps.Marker({
          position: { lat: newLat, lng: newLng },
          map,
          draggable: true,
        })
      } else {
        markerRef.current.setPosition({ lat: newLat, lng: newLng })
      }

      onChange(newLat, newLng)
    })

    // drag
    markerRef.current?.addListener('dragend', () => {
      const pos = markerRef.current?.getPosition()
      if (!pos) return
      onChange(pos.lat(), pos.lng())
    })
  }

  init()

  return () => {
    isMounted = false
  }
}, [])

  // Sync externo (GPS / search / coords)
  useEffect(() => {
  if (!mapRef.current) return

  const position = { lat, lng }

  if (!markerRef.current) return

  markerRef.current.setPosition(position)
  mapRef.current.panTo(position)
}, [lat, lng])

  return <div ref={ref} className="h-56 w-full border rounded-md" />
}