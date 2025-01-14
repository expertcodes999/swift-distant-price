import { z } from 'zod';
import { venueStaticSchema, venueDynamicSchema } from '../types/api.types';
import type { VenueStatic, VenueDynamic } from '../types/api.types';
import { VENUE_STATIC_HELSINKI, VENUE_STATIC_TALLINN, VENUE_DYNAMIC_HELSINKI, VENUE_DYNAMIC_TALLINN } from './data';

export class WoltApiClient {
  constructor(private readonly fetcher = fetch) {}

  private async request<T>(endpoint: string, schema: z.ZodSchema<T>): Promise<T> {
    let data;
    switch (endpoint) {
      case '/venues/home-assignment-venue-helsinki/static':
        data = VENUE_STATIC_HELSINKI;
        break;
      case '/venues/home-assignment-venue-tallinn/static':
        data = VENUE_STATIC_TALLINN;
        break;
      case '/venues/home-assignment-venue-helsinki/dynamic':
        data = VENUE_DYNAMIC_HELSINKI;
        break;
      case '/venues/home-assignment-venue-tallinn/dynamic':
        data = VENUE_DYNAMIC_TALLINN;
        break;
      default:
        throw new Error(`Unknown endpoint: ${endpoint}`);
    }
    return schema.parse(data);
  }

  async getVenueStatic(slug: string): Promise<VenueStatic> {
    return this.request(`/venues/${slug}/static`, venueStaticSchema);
  }

  async getVenueDynamic(slug: string): Promise<VenueDynamic> {
    return this.request(`/venues/${slug}/dynamic`, venueDynamicSchema);
  }

  async getVenueFullData(slug: string) {
    const [staticData, dynamicData] = await Promise.all([
      this.getVenueStatic(slug),
      this.getVenueDynamic(slug)
    ]);

    return {
      ...staticData,
      ...dynamicData
    };
  }
}