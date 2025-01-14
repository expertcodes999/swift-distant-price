import { venueStaticSchema, venueDynamicSchema } from '../types/api.types'
import type { VenueStatic, VenueDynamic } from '../types/api.types'

export class WoltApiClient {
  private readonly baseUrl = 'https://consumer-api.development.dev.woltapi.com/home-assignment-api/v1'
  
  constructor(private readonly fetcher = fetch) {}

  private async request<T>(endpoint: string, schema: z.ZodSchema<T>): Promise<T> {
    const response = await this.fetcher(`${this.baseUrl}${endpoint}`)
    
    if (!response.ok) {
      throw new Error(`API Error: ${response.status} - ${response.statusText}`)
    }

    const data = await response.json()
    return schema.parse(data)
  }

  async getVenueStatic(slug: string): Promise<VenueStatic> {
    return this.request(`/venues/${slug}/static`, venueStaticSchema)
  }

  async getVenueDynamic(slug: string): Promise<VenueDynamic> {
    return this.request(`/venues/${slug}/dynamic`, venueDynamicSchema)
  }

  async getVenueFullData(slug: string) {
    const [staticData, dynamicData] = await Promise.all([
      this.getVenueStatic(slug),
      this.getVenueDynamic(slug)
    ])

    return {
      ...staticData,
      ...dynamicData
    }
  }
}

export const calculateDistance = (
  [lon1, lat1]: [number, number],
  [lon2, lat2]: [number, number]
): number => {
  const R = 6371e3 // Earth's radius in meters
  const φ1 = (lat1 * Math.PI) / 180
  const φ2 = (lat2 * Math.PI) / 180
  const Δφ = ((lat2 - lat1) * Math.PI) / 180
  const Δλ = ((lon2 - lon1) * Math.PI) / 180

  const a =
    Math.sin(Δφ / 2) * Math.sin(Δφ / 2) +
    Math.cos(φ1) * Math.cos(φ2) * Math.sin(Δλ / 2) * Math.sin(Δλ / 2)
  const c = 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1 - a))

  return Math.round(R * c) // Distance in meters, rounded
}

export const calculateDeliveryPrice = (
  distance: number,
  distanceRanges: VenueDynamic['distanceRanges'],
  basePrice: number
): number | null => {
  const range = distanceRanges.find(
    range => distance >= range.min && (range.max === 0 || distance < range.max)
  )

  if (!range || range.max === 0) {
    return null // Delivery not possible
  }

  return basePrice + range.a + Math.round((range.b * distance) / 10)
}