import { loadGoogleMaps } from './googleMaps'

export interface PlaceResult {
  label: string
  placeId: string
  lat: number
  lng: number
}

export async function autocompletePlaces(
  input: string
): Promise<PlaceResult[]> {
  const google = await loadGoogleMaps()

  const { AutocompleteService } =
    (await google.maps.importLibrary('places')) as google.maps.PlacesLibrary

  const service = new AutocompleteService()

  return new Promise((resolve) => {
    service.getPlacePredictions(
      {
        input,
        componentRestrictions: { country: 've' },
      },
      (
        predictions: google.maps.places.AutocompletePrediction[] | null
      ) => {
        if (!predictions) return resolve([])

        const results: PlaceResult[] = predictions.map(
          (p: google.maps.places.AutocompletePrediction) => ({
            label: p.description,
            placeId: p.place_id,
            lat: 0,
            lng: 0,
          })
        )

        resolve(results)
      }
    )
  })
}