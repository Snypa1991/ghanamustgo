import Image from 'next/image';
import { Package, MapPin } from 'lucide-react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { PlaceHolderImages } from '@/lib/placeholder-images';
import RouteOptimization from '@/components/route-optimization';
import { Alert, AlertDescription, AlertTitle } from '@/components/ui/alert';
import { ShieldCheck } from 'lucide-react';

export default function DispatchPackagePage() {
  const mapImage = PlaceHolderImages.find(p => p.id === 'map-background');

  return (
    <div className="container py-12">
      <div className="text-center mb-12">
        <Package className="mx-auto h-12 w-12 text-primary" />
        <h1 className="mt-4 text-4xl font-bold font-headline">Dispatch a Package</h1>
        <p className="mt-2 text-lg text-muted-foreground">Secure and efficient delivery, powered by AI.</p>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 items-start">
        <div className="space-y-8">
            <RouteOptimization />
            <Alert>
                <ShieldCheck className="h-4 w-4" />
                <AlertTitle className="font-headline">Secure Payments</AlertTitle>
                <AlertDescription>
                    Your payment is held securely and only released to the rider upon your confirmation of successful delivery.
                </AlertDescription>
            </Alert>
        </div>

        <Card className="overflow-hidden">
          <CardHeader>
            <CardTitle className="font-headline">Live Tracking</CardTitle>
            <CardDescription>Monitor your package's journey (simulation).</CardDescription>
          </CardHeader>
          <CardContent>
            {mapImage && (
              <div className="relative aspect-[4/3] rounded-lg overflow-hidden">
                <Image
                  src={mapImage.imageUrl}
                  alt={mapImage.description}
                  fill
                  className="object-cover"
                  data-ai-hint={mapImage.imageHint}
                />
                 <div className="absolute top-1/4 left-1/4 animate-pulse">
                    <MapPin className="h-8 w-8 text-blue-500" />
                    <div className="absolute -bottom-5 left-1/2 -translate-x-1/2">
                        <span className="text-xs bg-black/50 text-white p-1 rounded">Pickup</span>
                    </div>
                </div>
                 <div className="absolute bottom-1/4 right-1/4 animate-pulse">
                    <MapPin className="h-8 w-8 text-green-500" />
                     <div className="absolute -bottom-5 left-1/2 -translate-x-1/2">
                        <span className="text-xs bg-black/50 text-white p-1 rounded">Dropoff</span>
                    </div>
                </div>
                 <div className="absolute top-1/2 left-1/2 -translate-x-1/2 animate-pulse">
                    <Package className="h-8 w-8 text-primary" />
                </div>
              </div>
            )}
          </CardContent>
        </Card>
      </div>
    </div>
  );
}
