import { useState } from 'react'

interface GeolocationResult {
  latitude: number
  longitude: number
  accuracy: number
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
      if (!window.isSecureContext) {
        const message =
          'Tu navegador bloquea la ubicación porque el sitio no usa una conexión segura (HTTPS). Si estás en producción, esto no debería pasar — avisanos.'
        setError(message)
        setLoading(false)
        reject(new Error(message))
        return
      }

      if (!navigator.geolocation) {
        const message = 'Tu navegador no soporta geolocalización.'
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
            accuracy: position.coords.accuracy,
          })
        },
        (geoError) => {
          setLoading(false)
          let message = 'No se pudo obtener tu ubicación.'

          if (geoError.code === geoError.PERMISSION_DENIED) {
            message =
              'Permiso de ubicación denegado. En tu teléfono, revisá: Configuración del navegador → Permisos del sitio → Ubicación, y también que el GPS del teléfono esté activado (en Configuración del sistema, no solo del navegador).'
          } else if (geoError.code === geoError.TIMEOUT) {
            message =
              'La búsqueda de ubicación tardó demasiado. Si estás en un lugar cerrado o con poca señal, puede tardar más — probá salir a un espacio abierto o usá otra opción de ubicación.'
          } else if (geoError.code === geoError.POSITION_UNAVAILABLE) {
            message =
              'No se pudo determinar tu ubicación en este momento. Verificá que el GPS esté activado en tu teléfono e intentá de nuevo.'
          }

          setError(message)
          reject(new Error(message))
        },
        {
          enableHighAccuracy: true,
          timeout: 30000,
          maximumAge: 0,
        }
      )
    })
  }

  return { getCurrentLocation, loading, error }
}