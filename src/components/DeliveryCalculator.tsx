import { useState } from 'react';
import { Card } from "@/components/ui/card";
import { useToast } from "@/components/ui/use-toast";
import { WoltApiClient, calculateDistance, calculateDeliveryPrice } from '../api/WoltApiClient';
import { DeliveryForm, type CalculatorInput } from './delivery/DeliveryForm';
import { PriceBreakdown } from './delivery/PriceBreakdown';

const DeliveryCalculator = () => {
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

  return (
    <Card className="w-full max-w-md p-6 space-y-6">
      <h1 className="text-2xl font-bold text-center">Delivery Price Calculator</h1>
      <DeliveryForm onSubmit={onSubmit} loading={loading} />
      {priceBreakdown && <PriceBreakdown breakdown={priceBreakdown} />}
    </Card>
  );
};

export default DeliveryCalculator;