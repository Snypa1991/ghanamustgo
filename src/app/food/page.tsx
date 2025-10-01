import { UtensilsCrossed } from 'lucide-react';

export default function FoodPage() {
  return (
    <div className="container py-12 text-center">
      <UtensilsCrossed className="h-12 w-12 text-primary mx-auto" />
      <h1 className="mt-4 text-4xl font-bold font-headline">Food Delivery Coming Soon!</h1>
      <p className="mt-2 text-lg text-muted-foreground">
        We're busy cooking up something special. Check back soon for delicious meals delivered to your door.
      </p>
    </div>
  );
}
