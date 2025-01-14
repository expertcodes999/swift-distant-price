import { z } from 'zod'

// Common schemas for reuse
const coordinatesSchema = z.tuple([
  z.number().min(-180).max(180), // longitude
  z.number().min(-90).max(90)    // latitude
])

const locationSchema = z.object({
  bbox: z.null(),
  type: z.string(),
  coordinates: coordinatesSchema
})

const distanceRangeSchema = z.object({
  min: z.number().min(0),
  max: z.number().min(0),
  a: z.number(),
  b: z.number(),
  flag: z.null()
})

export const venueStaticSchema = z.object({
  venue_raw: z.object({
    id: z.string(),
    name: z.string(),
    location: locationSchema,
    currency: z.string(),
    delivery_methods: z.array(z.string())
  })
}).transform(data => ({
  id: data.venue_raw.id,
  name: data.venue_raw.name,
  coordinates: data.venue_raw.location.coordinates,
  currency: data.venue_raw.currency,
  deliveryMethods: data.venue_raw.delivery_methods
}))

export const venueDynamicSchema = z.object({
  venue_raw: z.object({
    delivery_specs: z.object({
      delivery_enabled: z.boolean(),
      order_minimum_no_surcharge: z.number(),
      order_minimum_possible: z.number(),
      delivery_pricing: z.object({
        base_price: z.number(),
        distance_ranges: z.array(distanceRangeSchema)
      })
    })
  })
}).transform(data => ({
  minimumOrderValue: data.venue_raw.delivery_specs.order_minimum_no_surcharge,
  minimumPossibleOrder: data.venue_raw.delivery_specs.order_minimum_possible,
  baseDeliveryPrice: data.venue_raw.delivery_specs.delivery_pricing.base_price,
  distanceRanges: data.venue_raw.delivery_specs.delivery_pricing.distance_ranges,
  isDeliveryEnabled: data.venue_raw.delivery_specs.delivery_enabled
}))

export type VenueStatic = z.infer<typeof venueStaticSchema>
export type VenueDynamic = z.infer<typeof venueDynamicSchema>