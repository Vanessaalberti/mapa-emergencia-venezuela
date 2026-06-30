import { useState, useRef, useEffect } from 'react'
import L from 'leaflet'
import { useGeolocation } from '../hooks/useGeolocation'

export interface SelectedLocation {
  latitude: number
  longitude: number
  address: string | null
}

interface LocationPickerProps {
  value: SelectedLocation | null
  onChange: (location: SelectedLocation) => void
}

type LocationMethod = 'gps' | 'search' | 'map' | 'coords'

// Nominatim (OpenStreetMap) puede no encontrar direcciones exactas tipo
// "Calle X, casa 12" en zonas con poco mapeo detallado (común en barrios
// populares de Venezuela). Para mejorar la tasa de aciertos:
// - Forzamos el sesgo geográfico a Venezuela (viewbox + countrycodes)
// - Pedimos resultados "addressdetails" para depurar mejor
// - Si la búsqueda exacta no devuelve nada, reintentamos quitando el
//   último segmento (ej: número de casa) para encontrar al menos la calle/zona
async function searchAddress(query: string): Promise<Array<{ label: string; lat: number; lng: number }>> {
  const baseParams = 'format=json&limit=6&countrycodes=ve&addressdetails=1'

  const fetchResults = async (q: string) => {
    const url = `https://nominatim.openstreetmap.org/search?q=${encodeURIComponent(q)}&${baseParams}`
    const response = await fetch(url, { headers: { 'Accept-Language': 'es' } })
    const data: Array<{ display_name: string; lat: string; lon: string }> = await response.json()
    return data.map((item) => ({
      label: item.display_name,
      lat: parseFloat(item.lat),
      lng: parseFloat(item.lon),
    }))
  }

  const results = await fetchResults(query)
  if (results.length > 0) return results

  // Reintento: si el query tiene varias partes separadas por coma
  // (ej: "Calle 5, Casa 12, Barrio X"), probamos sin el primer segmento
  // específico, que suele ser lo que menos está mapeado.
  const parts = query.split(',').map((p) => p.trim()).filter(Boolean)
  if (parts.length > 1) {
    const broaderQuery = parts.slice(1).join(', ')
    return fetchResults(broaderQuery)
  }

  return []
}

async function reverseGeocode(lat: number, lng: number): Promise<string | null> {
  try {
    const url = `https://nominatim.openstreetmap.org/reverse?lat=${lat}&lon=${lng}&format=json&addressdetails=1`
    const response = await fetch(url, { headers: { 'Accept-Language': 'es' } })
    const data: { display_name?: string } = await response.json()
    return data.display_name ?? null
  } catch {
    return null
  }
}

export function LocationPicker({ value, onChange }: LocationPickerProps) {
  const [method, setMethod] = useState<LocationMethod | null>(null)
  const [searchQuery, setSearchQuery] = useState('')
  const [searchResults, setSearchResults] = useState<Array<{ label: string; lat: number; lng: number }>>([])
  const [searching, setSearching] = useState(false)
  const [searchedOnce, setSearchedOnce] = useState(false)
  const [manualLat, setManualLat] = useState('')
  const [manualLng, setManualLng] = useState('')
  const { getCurrentLocation, loading: gpsLoading, error: gpsError } = useGeolocation()

  useEffect(() => {
    if (value !== null && method === null) {
      setMethod('gps')
    }
  }, [value, method])

  const handleUseGps = async () => {
    setMethod('gps')
    try {
      const coords = await getCurrentLocation()
      const address = await reverseGeocode(coords.latitude, coords.longitude)
      onChange({ latitude: coords.latitude, longitude: coords.longitude, address })
    } catch {
      // El error ya queda reflejado en gpsError
    }
  }

  const handleSearch = async () => {
    if (searchQuery.trim().length < 3) return
    setSearching(true)
    setSearchedOnce(true)
    try {
      const results = await searchAddress(searchQuery)
      setSearchResults(results)
    } finally {
      setSearching(false)
    }
  }

  const handleSelectSearchResult = (result: { label: string; lat: number; lng: number }) => {
    onChange({ latitude: result.lat, longitude: result.lng, address: result.label })
    setSearchResults([])
    setSearchQuery(result.label)
  }

  const handleManualCoords = async () => {
    const lat = parseFloat(manualLat)
    const lng = parseFloat(manualLng)
    if (isNaN(lat) || isNaN(lng)) return
    const address = await reverseGeocode(lat, lng)
    onChange({ latitude: lat, longitude: lng, address })
  }

  return (
    <div className="space-y-4">
      <p className="text-sm text-ink-secondary">
        Elige cómo quieres indicar la ubicación:
      </p>

      <div className="grid grid-cols-2 gap-3">
        <button
          type="button"
          onClick={handleUseGps}
          className={`flex flex-col items-center gap-2 p-4 rounded-xl border-2 transition-colors ${
            method === 'gps'
              ? 'border-info bg-info/10 dark:bg-info/20'
              : 'border-border dark:border-neutral-700'
          }`}
        >
          <span className="text-2xl">📍</span>
          <span className="text-sm font-semibold">Usar GPS</span>
        </button>

        <button
          type="button"
          onClick={() => setMethod('search')}
          className={`flex flex-col items-center gap-2 p-4 rounded-xl border-2 transition-colors ${
            method === 'search'
              ? 'border-info bg-info/10 dark:bg-info/20'
              : 'border-border dark:border-neutral-700'
          }`}
        >
          <span className="text-2xl">🔍</span>
          <span className="text-sm font-semibold">Buscar dirección</span>
        </button>

        <button
          type="button"
          onClick={() => setMethod('map')}
          className={`flex flex-col items-center gap-2 p-4 rounded-xl border-2 transition-colors ${
            method === 'map'
              ? 'border-info bg-info/10 dark:bg-info/20'
              : 'border-border dark:border-neutral-700'
          }`}
        >
          <span className="text-2xl">🗺️</span>
          <span className="text-sm font-semibold">Seleccionar en el mapa</span>
        </button>

        <button
          type="button"
          onClick={() => setMethod('coords')}
          className={`flex flex-col items-center gap-2 p-4 rounded-xl border-2 transition-colors ${
            method === 'coords'
              ? 'border-info bg-info/10 dark:bg-info/20'
              : 'border-border dark:border-neutral-700'
          }`}
        >
          <span className="text-2xl">#️⃣</span>
          <span className="text-sm font-semibold">Coordenadas</span>
        </button>
      </div>

      {method === 'gps' && (
        <div className="text-sm space-y-1">
          {gpsLoading && (
            <p className="text-ink-secondary">
              Obteniendo tu ubicación... esto puede tardar hasta 30 segundos si la señal es
              débil. No cierres esta ventana.
            </p>
          )}
          {gpsError && <p className="text-critical">{gpsError}</p>}
        </div>
      )}

      {method === 'search' && (
        <div className="space-y-2">
          <p className="text-xs text-ink-secondary">
            Tip: si no encuentra una dirección exacta (ej: número de casa), probá con la calle,
            el barrio o un punto de referencia cercano (ej: "cerca de la plaza Bolívar, Petare").
          </p>
          <div className="flex gap-2">
            <input
              type="text"
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              onKeyDown={(e) => e.key === 'Enter' && handleSearch()}
              placeholder="Calle, barrio, ciudad, punto de referencia..."
              className="flex-1 p-3 text-base rounded-lg border border-border dark:border-neutral-700 dark:bg-neutral-900 text-ink-primary dark:text-neutral-100"
            />
            <button
              type="button"
              onClick={handleSearch}
              className="px-4 rounded-lg bg-info text-white font-semibold"
            >
              {searching ? '...' : 'Buscar'}
            </button>
          </div>
          {searchResults.length > 0 && (
            <ul className="border border-border dark:border-neutral-700 rounded-lg divide-y divide-border dark:divide-neutral-700 max-h-48 overflow-y-auto">
              {searchResults.map((result, idx) => (
                <li key={idx}>
                  <button
                    type="button"
                    onClick={() => handleSelectSearchResult(result)}
                    className="w-full text-left p-3 text-sm hover:bg-bg-secondary dark:hover:bg-neutral-800"
                  >
                    {result.label}
                  </button>
                </li>
              ))}
            </ul>
          )}
          {searchedOnce && !searching && searchResults.length === 0 && (
            <p className="text-sm text-warning bg-warning/10 p-3 rounded-lg">
              No encontramos esa dirección exacta. Probá con un punto de referencia más amplio
              (calle, barrio, plaza cercana), o usá "Seleccionar en el mapa" para marcar el punto
              directamente.
            </p>
          )}
        </div>
      )}

      {method === 'map' && (
        <MiniMapPicker
          initialLat={value?.latitude}
          initialLng={value?.longitude}
          onSelect={async (lat, lng) => {
            const address = await reverseGeocode(lat, lng)
            onChange({ latitude: lat, longitude: lng, address })
          }}
        />
      )}

      {method === 'coords' && (
        <div className="flex gap-2">
          <input
            type="text"
            inputMode="decimal"
            value={manualLat}
            onChange={(e) => setManualLat(e.target.value)}
            placeholder="Latitud (ej: 10.4806)"
            className="flex-1 p-3 text-base rounded-lg border border-border dark:border-neutral-700 dark:bg-neutral-900 text-ink-primary dark:text-neutral-100"
          />
          <input
            type="text"
            inputMode="decimal"
            value={manualLng}
            onChange={(e) => setManualLng(e.target.value)}
            placeholder="Longitud (ej: -66.9036)"
            className="flex-1 p-3 text-base rounded-lg border border-border dark:border-neutral-700 dark:bg-neutral-900 text-ink-primary dark:text-neutral-100"
          />
          <button
            type="button"
            onClick={handleManualCoords}
            className="px-4 rounded-lg bg-info text-white font-semibold"
          >
            OK
          </button>
        </div>
      )}

      {value && (
        <div className="p-3 rounded-lg bg-success/10 dark:bg-success/20 border border-success/30 dark:border-success/40 text-sm">
          ✅ Ubicación seleccionada{value.address ? `: ${value.address}` : ` (${value.latitude.toFixed(4)}, ${value.longitude.toFixed(4)})`}
        </div>
      )}
    </div>
  )
}

// Mini mapa embebido solo para seleccionar un punto con un clic
function MiniMapPicker({
  initialLat,
  initialLng,
  onSelect,
}: {
  initialLat?: number
  initialLng?: number
  onSelect: (lat: number, lng: number) => void
}) {
  const containerRef = useRef<HTMLDivElement | null>(null)
  const mapRef = useRef<L.Map | null>(null)

  useEffect(() => {
    if (!containerRef.current || mapRef.current) return

    const map = L.map(containerRef.current, {
      center: [initialLat ?? 8.0, initialLng ?? -66.0],
      zoom: initialLat ? 14 : 6,
    })

    L.tileLayer('https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png', {
      maxZoom: 19,
      attribution: '© OpenStreetMap contributors',
    }).addTo(map)

    let marker: L.Marker | null = null

    map.on('click', (e: L.LeafletMouseEvent) => {
      if (marker) {
        marker.setLatLng(e.latlng)
      } else {
        marker = L.marker(e.latlng).addTo(map)
      }
      onSelect(e.latlng.lat, e.latlng.lng)
    })

    mapRef.current = map

    return () => {
      map.remove()
      mapRef.current = null
    }
  }, [])

  return (
    <div
      ref={containerRef}
      className="h-56 w-full rounded-lg overflow-hidden border border-border dark:border-neutral-700"
    />
  )
}