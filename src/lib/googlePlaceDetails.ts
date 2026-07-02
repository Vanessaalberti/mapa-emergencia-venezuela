import { loadGoogleMaps } from './googleMaps'

export interface PlaceDetails {
  lat: number
  lng: number
  address: string
}

export async function getPlaceDetails(placeId: string): Promise<PlaceDetails | null> {
  const google = await loadGoogleMaps()

  const { PlacesService } =
    (await google.maps.importLibrary('places')) as google.maps.PlacesLibrary

  const mapDiv = document.createElement('div')
  const service = new PlacesService(mapDiv)

  return new Promise((resolve) => {
    service.getDetails(
      {
        placeId,
        fields: ['geometry', 'formatted_address'],
      },
      (place: any, status: any) => {
        if (
          status !== google.maps.places.PlacesServiceStatus.OK ||
          !place?.geometry?.location
        ) {
          return resolve(null)
        }

        resolve({
          lat: place.geometry.location.lat(),
          lng: place.geometry.location.lng(),
          address: place.formatted_address ?? '',
        })
      }
    )
  })
}