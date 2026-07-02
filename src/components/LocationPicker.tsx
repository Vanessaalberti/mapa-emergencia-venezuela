import { useState, useEffect } from 'react'
import { useGeolocation } from '../hooks/useGeolocation'

import {
  Navigation,
  Search,
  Map,
  Hash,
} from 'lucide-react'

import { DraggableMiniMap } from './DraggableMiniMap'

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

/* ---------------------------
   API HELPERS
--------------------------- */

async function searchAddress(query: string) {
  const baseParams =
    'format=json&limit=6&countrycodes=ve&addressdetails=1'

  const fetchResults = async (q: string) => {
    const url = `https://nominatim.openstreetmap.org/search?q=${encodeURIComponent(
      q
    )}&${baseParams}`

    const response = await fetch(url, {
      headers: { 'Accept-Language': 'es' },
    })

    const data: Array<{ display_name: string; lat: string; lon: string }> =
      await response.json()

    return data.map((item) => ({
      label: item.display_name,
      lat: parseFloat(item.lat),
      lng: parseFloat(item.lon),
    }))
  }

  const results = await fetchResults(query)
  if (results.length > 0) return results

  const parts = query.split(',').map((p) => p.trim()).filter(Boolean)
  if (parts.length > 1) {
    return fetchResults(parts.slice(1).join(', '))
  }

  return []
}

async function reverseGeocode(lat: number, lng: number) {
  try {
    const url = `https://nominatim.openstreetmap.org/reverse?lat=${lat}&lon=${lng}&format=json&addressdetails=1`

    const response = await fetch(url, {
      headers: { 'Accept-Language': 'es' },
    })

    const data: { display_name?: string } = await response.json()
    return data.display_name ?? null
  } catch {
    return null
  }
}

/* ---------------------------
   COMPONENT
--------------------------- */

export function LocationPicker({ value, onChange }: LocationPickerProps) {
  const [method, setMethod] = useState<LocationMethod | null>(null)
  const [searchQuery, setSearchQuery] = useState('')
  const [searchResults, setSearchResults] = useState<any[]>([])
  const [searching, setSearching] = useState(false)
  const [manualLat, setManualLat] = useState('')
  const [manualLng, setManualLng] = useState('')

  const { getCurrentLocation, loading: gpsLoading, error: gpsError } =
    useGeolocation()

  useEffect(() => {
  if (!method && value) {
    setMethod('gps')
  }
  }, [])

  const handleUseGps = async () => {
    setMethod('gps')
    try {
      const coords = await getCurrentLocation()
      const address = await reverseGeocode(coords.latitude, coords.longitude)

      onChange({
        latitude: coords.latitude,
        longitude: coords.longitude,
        address,
      })
    } catch {}
  }

  const handleSearch = async () => {
    if (searchQuery.trim().length < 3) return

    setSearching(true)

    try {
      const results = await searchAddress(searchQuery)
      setSearchResults(results)
    } finally {
      setSearching(false)
    }
  }

  const handleSelectSearchResult = (r: any) => {
    onChange({
      latitude: r.lat,
      longitude: r.lng,
      address: r.label,
    })

    setSearchResults([])
    setSearchQuery(r.label)
  }

  const handleManualCoords = async () => {
    const lat = parseFloat(manualLat)
    const lng = parseFloat(manualLng)

    if (isNaN(lat) || isNaN(lng)) return

    const address = await reverseGeocode(lat, lng)

    onChange({
      latitude: lat,
      longitude: lng,
      address,
    })
  }

  /* ---------------------------
     OPTION CARD
  --------------------------- */

  const OptionCard = ({
    active,
    icon: Icon,
    title,
    description,
    onClick,
  }: any) => (
    <button
      type="button"
      onClick={onClick}
      className={`
        flex items-center gap-3 p-4 border rounded-md text-left transition
        ${active ? 'border-[#0B3A6E] bg-blue-50' : 'border-neutral-200 bg-white'}
      `}
    >
      <Icon
        size={22}
        className={active ? 'text-[#0B3A6E]' : 'text-neutral-600'}
      />

      <div className="flex flex-col">
        <span className="text-sm font-semibold">{title}</span>
        <span className="text-xs text-neutral-500">{description}</span>
      </div>
    </button>
  )

  return (
    <div className="space-y-4">

      <p className="text-sm text-neutral-600">
        Selecciona cómo definir la ubicación del incidente:
      </p>

      {/* OPTIONS */}
      <div className="grid grid-cols-2 gap-3">

        <OptionCard
          active={method === 'gps'}
          icon={Navigation}
          title="Usar GPS"
          description="Detecta tu ubicación automáticamente"
          onClick={handleUseGps}
        />

        <OptionCard
          active={method === 'search'}
          icon={Search}
          title="Buscar dirección"
          description="Calle, barrio o referencia"
          onClick={() => setMethod('search')}
        />

        <OptionCard
          active={method === 'map'}
          icon={Map}
          title="Elegir en mapa"
          description="Selecciona un punto exacto"
          onClick={() => setMethod('map')}
        />

        <OptionCard
          active={method === 'coords'}
          icon={Hash}
          title="Coordenadas"
          description="Latitud y longitud manual"
          onClick={() => setMethod('coords')}
        />

      </div>

      {/* GPS */}
      {method === 'gps' && (
        <div className="text-sm text-neutral-600">
          {gpsLoading && <p>Obteniendo ubicación…</p>}
          {gpsError && <p className="text-red-600">{gpsError}</p>}
        </div>
      )}

      {/* SEARCH */}
      {method === 'search' && (
        <div className="space-y-3">

          <input
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            onKeyDown={(e) => e.key === 'Enter' && handleSearch()}
            placeholder="Calle, barrio o referencia"
            className="w-full px-3 py-3 border rounded-md text-sm"
          />

          <button
            onClick={handleSearch}
            className="px-4 py-2 bg-[#0B3A6E] text-white rounded-md text-sm"
          >
            {searching ? 'Buscando...' : 'Buscar'}
          </button>

          {searchResults.map((r, i) => (
            <button
              key={i}
              onClick={() => handleSelectSearchResult(r)}
              className="w-full text-left p-2 text-sm border-b hover:bg-neutral-50"
            >
              {r.label}
            </button>
          ))}
        </div>
      )}

      {/* MAP (UNIFICADO Y ESCALABLE) */}
      {method === 'map' && (
        <DraggableMiniMap
          lat={value?.latitude ?? 8}
          lng={value?.longitude ?? -66}
          onChange={async (lat, lng) => {
            const address = await reverseGeocode(lat, lng)
            onChange({ latitude: lat, longitude: lng, address })
          }}
        />
      )}

      {/* COORDS */}
      {method === 'coords' && (
        <div className="flex gap-2">
          <input
            value={manualLat}
            onChange={(e) => setManualLat(e.target.value)}
            placeholder="Lat"
            className="flex-1 px-3 py-2 border rounded-md text-sm"
          />

          <input
            value={manualLng}
            onChange={(e) => setManualLng(e.target.value)}
            placeholder="Lng"
            className="flex-1 px-3 py-2 border rounded-md text-sm"
          />

          <button
            onClick={handleManualCoords}
            className="px-3 bg-[#0B3A6E] text-white rounded-md text-sm"
          >
            OK
          </button>
        </div>
      )}

      {/* SELECTED */}
      {value && (
        <div className="text-sm p-3 border border-green-200 bg-green-50 rounded-md">
          Ubicación seleccionada
          {value.address && `: ${value.address}`}
        </div>
      )}
    </div>
  )
}