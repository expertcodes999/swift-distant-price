import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { z } from 'zod';
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Loader2 } from "lucide-react";
import { LocationInput } from './LocationInput';
import { useState } from 'react';

const calculatorSchema = z.object({
  venueSlug: z.string().min(1, "Venue slug is required"),
  cartValue: z.number().min(0),
  latitude: z.number(),
  longitude: z.number(),
});

export type CalculatorInput = z.infer<typeof calculatorSchema>;

interface DeliveryFormProps {
  onSubmit: (data: CalculatorInput) => Promise<void>;
  loading: boolean;
}

const venueData = {
  'home-assignment-venue-helsinki': {
    cartValue: 10,
    latitude: 60.17094,
    longitude: 24.93087,
  },
  'home-assignment-venue-tallinn': {
    cartValue: 15,
    latitude: 59.437,
    longitude: 24.7535,
  },
  'home-assignment-venue-helsinki-dynamic': {
    cartValue: 20,
    latitude: 60.17094,
    longitude: 24.93087,
  },
  'home-assignment-venue-tallinn-dynamic': {
    cartValue: 25,
    latitude: 59.437,
    longitude: 24.7535,
  }
};

export const DeliveryForm = ({ onSubmit, loading }: DeliveryFormProps) => {
  const { register, handleSubmit, setValue, formState: { errors } } = useForm<CalculatorInput>({
    resolver: zodResolver(calculatorSchema),
    defaultValues: {
      venueSlug: 'home-assignment-venue-helsinki',
      cartValue: venueData['home-assignment-venue-helsinki'].cartValue,
      latitude: venueData['home-assignment-venue-helsinki'].latitude,
      longitude: venueData['home-assignment-venue-helsinki'].longitude,
    }
  });

  const handleVenueChange = (event: React.ChangeEvent<HTMLSelectElement>) => {
    const selectedVenue = event.target.value;
    setValue('venueSlug', selectedVenue);
    setValue('cartValue', venueData[selectedVenue].cartValue);
    setValue('latitude', venueData[selectedVenue].latitude);
    setValue('longitude', venueData[selectedVenue].longitude);
  };

  return (
    <form onSubmit={handleSubmit(onSubmit)} className="space-y-4">
      <div>
        <label htmlFor="venueSlug">Venue</label>
        <select id="venueSlug" {...register('venueSlug')} onChange={handleVenueChange}>
          <option value="home-assignment-venue-helsinki">Helsinki Static</option>
          <option value="home-assignment-venue-tallinn">Tallinn Static</option>
          <option value="home-assignment-venue-helsinki-dynamic">Helsinki Dynamic</option>
          <option value="home-assignment-venue-tallinn-dynamic">Tallinn Dynamic</option>
        </select>
      </div>
      <div>
        <label htmlFor="cartValue">Cart Value</label>
        <Input id="cartValue" type="number" {...register('cartValue')} />
        {errors.cartValue && <p>{errors.cartValue.message}</p>}
      </div>
      <LocationInput register={register} errors={errors} />
      <Button type="submit" disabled={loading}>
        {loading ? <Loader2 className="animate-spin" /> : 'Calculate'}
      </Button>
    </form>
  );
};