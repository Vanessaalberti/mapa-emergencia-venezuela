import { useState } from 'react'

interface GeolocationResult {
  latitude: number
  longitude: number
}

interface UseGeolocationResult {
  getCurrentLocation: () => Promise<GeolocationResult>
  loading: boolean
  error: string | null
}

export function useGeolocation(): UseGeolocationResult {
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState<string | null>(null)

  const getCurrentLocation = (): Promise<GeolocationResult> => {
    setLoading(true)
    setError(null)

    return new Promise((resolve, reject) => {
      if (!navigator.geolocation) {
        const message = 'Tu navegador no soporta geolocalización'
        setError(message)
        setLoading(false)
        reject(new Error(message))
        return
      }

      navigator.geolocation.getCurrentPosition(
        (position) => {
          setLoading(false)
          resolve({
            latitude: position.coords.latitude,
            longitude: position.coords.longitude,
          })
        },
        (geoError) => {
          setLoading(false)
          let message = 'No se pudo obtener tu ubicación'
          if (geoError.code === geoError.PERMISSION_DENIED) {
            message = 'Permiso de ubicación denegado. Habilítalo en la configuración del navegador.'
          } else if (geoError.code === geoError.TIMEOUT) {
            message = 'La solicitud de ubicación tardó demasiado. Intenta de nuevo.'
          }
          setError(message)
          reject(new Error(message))
        },
        { enableHighAccuracy: true, timeout: 10000, maximumAge: 0 }
      )
    })
  }

  return { getCurrentLocation, loading, error }
}
