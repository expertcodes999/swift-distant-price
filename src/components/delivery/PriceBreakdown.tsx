interface PriceBreakdownProps {
  breakdown: {
    cartValue: number;
    deliveryFee: number;
    distance: number;
    smallOrderSurcharge: number;
    total: number;
  };
}

export const PriceBreakdown = ({ breakdown }: PriceBreakdownProps) => {
  return (
    <div className="mt-6 space-y-2">
      <h2 className="text-xl font-semibold">Price Breakdown</h2>
      <div className="space-y-1">
        <div className="flex justify-between">
          <span>Cart Value</span>
          <span>{breakdown.cartValue.toFixed(2)} €</span>
        </div>
        <div className="flex justify-between">
          <span>Delivery Fee</span>
          <span>{breakdown.deliveryFee.toFixed(2)} €</span>
        </div>
        <div className="flex justify-between">
          <span>Delivery Distance</span>
          <span>{breakdown.distance} m</span>
        </div>
        <div className="flex justify-between">
          <span>Small Order Surcharge</span>
          <span>{breakdown.smallOrderSurcharge.toFixed(2)} €</span>
        </div>
        <div className="flex justify-between font-bold">
          <span>Total Price</span>
          <span>{breakdown.total.toFixed(2)} €</span>
        </div>
      </div>
    </div>
  );
};