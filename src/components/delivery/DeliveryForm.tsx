import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { z } from 'zod';
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Loader2 } from "lucide-react";
import { LocationInput } from './LocationInput';

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

export const DeliveryForm = ({ onSubmit, loading }: DeliveryFormProps) => {
  const { register, handleSubmit, setValue, formState: { errors } } = useForm<CalculatorInput>({
    resolver: zodResolver(calculatorSchema),
    defaultValues: {
      venueSlug: 'home-assignment-venue-helsinki',
      cartValue: 10,
      latitude: 60.17094,
      longitude: 24.93087,
    }
  });

  return (
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
          {...register('cartValue', { valueAsNumber: true })}
          className="w-full"
        />
      </div>

      <LocationInput register={register} setValue={setValue} loading={loading} />

      <Button type="submit" className="w-full" disabled={loading}>
        {loading && <Loader2 className="mr-2 h-4 w-4 animate-spin" />}
        Calculate Delivery Price
      </Button>
    </form>
  );
};