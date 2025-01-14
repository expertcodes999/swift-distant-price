import { useState } from 'react';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { z } from 'zod';
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Card } from "@/components/ui/card";
import { useToast } from "@/components/ui/use-toast";
import { Loader2 } from "lucide-react";
import { WoltApiClient, calculateDistance, calculateDeliveryPrice } from '../api/WoltApiClient';

const calculatorSchema = z.object({
  venueSlug: z.string().min(1, "Venue slug is required"),
  cartValue: z.number().min(0),
  latitude: z.number(),
  longitude: z.number(),
});

type CalculatorInput = z.infer<typeof calculatorSchema>;

const DeliveryCalculator = () => {
  const { register, handleSubmit, setValue, formState: { errors } } = useForm<CalculatorInput>({
    resolver: zodResolver(calculatorSchema),
    defaultValues: {
      venueSlug: 'home-assignment-venue-helsinki',
      cartValue: 10,
      latitude: 60.17094,
      longitude: 24.93087,
    }
  });

  const [loading, setLoading] = useState(false);
  const [priceBreakdown, setPriceBreakdown] = useState<{
    cartValue: number;
    deliveryFee: number;
    distance: number;
    smallOrderSurcharge: number;
    total: number;
  } | null>(null);
  
  const { toast } = useToast();
  const api = new WoltApiClient();

  const onSubmit = async (data: CalculatorInput) => {
    setLoading(true);
    try {
      const venueData = await api.getVenueFullData(data.venueSlug);
      
      const coordinates: [number, number] = [data.longitude, data.latitude];
      const distance = calculateDistance(
        venueData.coordinates,
        coordinates
      );

      const deliveryFee = calculateDeliveryPrice(
        distance,
        venueData.distanceRanges,
        venueData.baseDeliveryPrice
      );

      if (deliveryFee === null) {
        toast({
          variant: "destructive",
          title: "Error",
          description: "Delivery not possible to this location",
        });
        return;
      }

      const smallOrderSurcharge = data.cartValue < venueData.minimumOrderValue 
        ? venueData.minimumOrderValue - data.cartValue 
        : 0;

      setPriceBreakdown({
        cartValue: data.cartValue,
        deliveryFee,
        distance,
        smallOrderSurcharge,
        total: data.cartValue + deliveryFee + smallOrderSurcharge,
      });

      toast({
        title: "Price Calculated",
        description: "Delivery price has been calculated successfully",
      });
    } catch (error) {
      console.error('API Error:', error);
      toast({
        variant: "destructive",
        title: "Error",
        description: error instanceof Error ? error.message : "Failed to calculate price",
      });
    } finally {
      setLoading(false);
    }
  };

  const getCurrentLocation = () => {
    setLoading(true);
    if ("geolocation" in navigator) {
      navigator.geolocation.getCurrentPosition(
        (position) => {
          setValue('latitude', position.coords.latitude);
          setValue('longitude', position.coords.longitude);
          toast({
            title: "Location Updated",
            description: "Your current location has been set",
          });
          setLoading(false);
        },
        (error) => {
          toast({
            variant: "destructive",
            title: "Location Error",
            description: "Could not get your location",
          });
          setLoading(false);
        }
      );
    } else {
      toast({
        variant: "destructive",
        title: "Not Supported",
        description: "Geolocation is not supported by your browser",
      });
      setLoading(false);
    }
  };

  return (
    <Card className="w-full max-w-md p-6 space-y-6">
      <h1 className="text-2xl font-bold text-center">Delivery Price Calculator</h1>
      
      <form onSubmit={handleSubmit(onSubmit)} className="space-y-4">
        <div className="space-y-2">
          <label htmlFor="venue-slug" className="block text-sm font-medium">
            Venue slug
          </label>
          <Input
            id="venue-slug"
            {...register('venueSlug')}
            className="w-full"
          />
        </div>

        <div className="space-y-2">
          <label htmlFor="cart-value" className="block text-sm font-medium">
            Cart value (EUR)
          </label>
          <Input
            id="cart-value"
            type="number"
            step="0.01"
            {...register('cartValue')}
            className="w-full"
          />
        </div>

        <div className="space-y-2">
          <label htmlFor="latitude" className="block text-sm font-medium">
            User latitude
          </label>
          <Input
            id="latitude"
            type="number"
            step="any"
            {...register('latitude')}
            className="w-full"
          />
        </div>

        <div className="space-y-2">
          <label htmlFor="longitude" className="block text-sm font-medium">
            User longitude
          </label>
          <Input
            id="longitude"
            type="number"
            step="any"
            {...register('longitude')}
            className="w-full"
          />
        </div>

        <Button
          type="button"
          variant="outline"
          onClick={getCurrentLocation}
          className="w-full"
          disabled={loading}
        >
          {loading && <Loader2 className="mr-2 h-4 w-4 animate-spin" />}
          Get Current Location
        </Button>

        <Button type="submit" className="w-full" disabled={loading}>
          {loading && <Loader2 className="mr-2 h-4 w-4 animate-spin" />}
          Calculate Delivery Price
        </Button>
      </form>

      {priceBreakdown && (
        <div className="mt-6 space-y-2">
          <h2 className="text-xl font-semibold">Price Breakdown</h2>
          <div className="space-y-1">
            <div className="flex justify-between">
              <span>Cart Value</span>
              <span>{priceBreakdown.cartValue.toFixed(2)} €</span>
            </div>
            <div className="flex justify-between">
              <span>Delivery Fee</span>
              <span>{priceBreakdown.deliveryFee.toFixed(2)} €</span>
            </div>
            <div className="flex justify-between">
              <span>Delivery Distance</span>
              <span>{priceBreakdown.distance} m</span>
            </div>
            <div className="flex justify-between">
              <span>Small Order Surcharge</span>
              <span>{priceBreakdown.smallOrderSurcharge.toFixed(2)} €</span>
            </div>
            <div className="flex justify-between font-bold">
              <span>Total Price</span>
              <span>{priceBreakdown.total.toFixed(2)} €</span>
            </div>
          </div>
        </div>
      )}
    </Card>
  );
};

export default DeliveryCalculator;
