let googlePromise: Promise<typeof google> | null = null

export function loadGoogleMaps(): Promise<typeof google> {
  if (googlePromise) return googlePromise

  googlePromise = new Promise((resolve, reject) => {
    if (window.google) {
      resolve(window.google)
      return
    }

    const script = document.createElement('script')

    script.src = `https://maps.googleapis.com/maps/api/js?key=${
      import.meta.env.VITE_GOOGLE_MAPS_API_KEY
    }&libraries=places,visualization`

    script.async = true
    script.defer = true

    script.onload = () => resolve(window.google)
    script.onerror = reject

    document.head.appendChild(script)
  })

  return googlePromise
}