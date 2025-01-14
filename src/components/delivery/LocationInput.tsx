import { UseFormRegister, UseFormSetValue } from 'react-hook-form';
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Loader2 } from "lucide-react";
import { useToast } from "@/components/ui/use-toast";
import type { CalculatorInput } from './DeliveryForm';

interface LocationInputProps {
  register: UseFormRegister<CalculatorInput>;
  setValue: UseFormSetValue<CalculatorInput>;
  loading: boolean;
}

export const LocationInput = ({ register, setValue, loading }: LocationInputProps) => {
  const { toast } = useToast();

  const getCurrentLocation = () => {
    if ("geolocation" in navigator) {
      navigator.geolocation.getCurrentPosition(
        (position) => {
          setValue('latitude', position.coords.latitude);
          setValue('longitude', position.coords.longitude);
          toast({
            title: "Location Updated",
            description: "Your current location has been set",
          });
        },
        (error) => {
          toast({
            variant: "destructive",
            title: "Location Error",
            description: "Could not get your location",
          });
        }
      );
    } else {
      toast({
        variant: "destructive",
        title: "Not Supported",
        description: "Geolocation is not supported by your browser",
      });
    }
  };

  return (
    <>
      <div className="space-y-2">
        <label htmlFor="latitude" className="block text-sm font-medium">
          User latitude
        </label>
        <Input
          id="latitude"
          type="number"
          step="any"
          {...register('latitude', { valueAsNumber: true })}
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
          {...register('longitude', { valueAsNumber: true })}
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
    </>
  );
};