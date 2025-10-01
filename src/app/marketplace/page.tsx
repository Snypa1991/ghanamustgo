import { Store } from 'lucide-react';

export default function MarketplacePage() {
  return (
    <div className="container py-12 text-center">
      <Store className="h-12 w-12 text-primary mx-auto" />
      <h1 className="mt-4 text-4xl font-bold font-headline">Marketplace Coming Soon!</h1>
      <p className="mt-2 text-lg text-muted-foreground">
        Get ready to discover and shop from local vendors. Our marketplace is launching soon.
      </p>
    </div>
  );
}
