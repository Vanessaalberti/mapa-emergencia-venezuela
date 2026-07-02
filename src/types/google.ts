export interface GooglePlaceSuggestion {
  placeId: string
  description: string
}

export interface ConfirmedLocation {
  latitude: number
  longitude: number
  address: string
  placeId: string
}