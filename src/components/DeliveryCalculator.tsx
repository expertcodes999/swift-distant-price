import { useState } from 'react';
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Card } from "@/components/ui/card";
import { useToast } from "@/components/ui/use-toast";
import { Loader2 } from "lucide-react";

interface CalculatorState {
  cartValue: string;
  deliveryDistance: string;
  numberOfItems: string;
  time: string;
  lat?: number;
  lng?: number;
}

const DeliveryCalculator = () => {
  const [state, setState] = useState<CalculatorState>({
    cartValue: '',
    deliveryDistance: '',
    numberOfItems: '',
    time: new Date().toISOString().slice(0, 16),
  });
  const [loading, setLoading] = useState(false);
  const { toast } = useToast();

  const calculateDeliveryPrice = () => {
    const cartValue = parseFloat(state.cartValue);
    const distance = parseFloat(state.deliveryDistance);
    const items = parseInt(state.numberOfItems);
    const orderTime = new Date(state.time);
    
    // Base delivery fee is 2€
    let deliveryFee = 2;
    
    // Small order surcharge
    if (cartValue < 10) {
      deliveryFee += (10 - cartValue);
    }
    
    // Distance fee
    if (distance > 1000) {
      deliveryFee += 2;
      const additionalDistance = Math.ceil((distance - 1000) / 500);
      deliveryFee += additionalDistance;
    }
    
    // Bulk fee
    if (items >= 5) {
      deliveryFee += (items - 4) * 0.5;
      if (items > 12) {
        deliveryFee += 1.2;
      }
    }
    
    // Rush hour fee (Friday 15-19)
    const isFriday = orderTime.getDay() === 5;
    const hour = orderTime.getHours();
    if (isFriday && hour >= 15 && hour < 19) {
      deliveryFee *= 1.2;
    }
    
    // Maximum fee is 15€
    deliveryFee = Math.min(15, deliveryFee);
    
    // Free delivery for cart value >= 100€
    if (cartValue >= 100) {
      deliveryFee = 0;
    }
    
    return deliveryFee.toFixed(2);
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    try {
      const result = calculateDeliveryPrice();
      toast({
        title: "Delivery Fee Calculated",
        description: `The delivery fee is €${result}`,
      });
    } catch (error) {
      toast({
        variant: "destructive",
        title: "Error",
        description: "Please check your input values",
      });
    }
  };

  const getCurrentLocation = () => {
    setLoading(true);
    if ("geolocation" in navigator) {
      navigator.geolocation.getCurrentPosition(
        (position) => {
          setState(prev => ({
            ...prev,
            lat: position.coords.latitude,
            lng: position.coords.longitude,
          }));
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
      
      <form onSubmit={handleSubmit} className="space-y-4">
        <div className="space-y-2">
          <label htmlFor="cart-value" className="block text-sm font-medium">
            Cart Value (€)
          </label>
          <Input
            id="cart-value"
            data-test-id="cart-value"
            type="number"
            step="0.01"
            min="0"
            value={state.cartValue}
            onChange={(e) => setState(prev => ({ ...prev, cartValue: e.target.value }))}
            required
            className="w-full"
          />
        </div>

        <div className="space-y-2">
          <label htmlFor="delivery-distance" className="block text-sm font-medium">
            Delivery Distance (meters)
          </label>
          <Input
            id="delivery-distance"
            data-test-id="delivery-distance"
            type="number"
            min="0"
            value={state.deliveryDistance}
            onChange={(e) => setState(prev => ({ ...prev, deliveryDistance: e.target.value }))}
            required
            className="w-full"
          />
        </div>

        <div className="space-y-2">
          <label htmlFor="number-of-items" className="block text-sm font-medium">
            Number of Items
          </label>
          <Input
            id="number-of-items"
            data-test-id="amount-of-items"
            type="number"
            min="1"
            value={state.numberOfItems}
            onChange={(e) => setState(prev => ({ ...prev, numberOfItems: e.target.value }))}
            required
            className="w-full"
          />
        </div>

        <div className="space-y-2">
          <label htmlFor="time" className="block text-sm font-medium">
            Order Time
          </label>
          <Input
            id="time"
            data-test-id="time"
            type="datetime-local"
            value={state.time}
            onChange={(e) => setState(prev => ({ ...prev, time: e.target.value }))}
            required
            className="w-full"
          />
        </div>

        <div className="space-y-2">
          <Button
            type="button"
            variant="outline"
            onClick={getCurrentLocation}
            className="w-full"
            disabled={loading}
          >
            {loading ? (
              <Loader2 className="mr-2 h-4 w-4 animate-spin" />
            ) : null}
            Get Current Location
          </Button>
          {state.lat && state.lng && (
            <p className="text-sm text-muted-foreground text-center">
              Location: {state.lat.toFixed(6)}, {state.lng.toFixed(6)}
            </p>
          )}
        </div>

        <Button type="submit" className="w-full">
          Calculate Delivery Price
        </Button>
      </form>
    </Card>
  );
};

export default DeliveryCalculator;