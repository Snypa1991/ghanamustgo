import Image from 'next/image';
import { MapPin, Car } from 'lucide-react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { PlaceHolderImages } from '@/lib/placeholder-images';
import RouteOptimization from '@/components/route-optimization';

export default function BookTaxiPage() {
  const mapImage = PlaceHolderImages.find(p => p.id === 'map-background');

  return (
    <div className="container py-12">
      <div className="text-center mb-12">
        <Car className="mx-auto h-12 w-12 text-primary" />
        <h1 className="mt-4 text-4xl font-bold font-headline">Book a Taxi</h1>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 items-start">
        <RouteOptimization />

        <Card className="overflow-hidden">
          <CardHeader>
            <CardTitle className="font-headline">Live Map</CardTitle>
            <CardDescription>Track your driver in real-time (simulation).</CardDescription>
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
                 <div className="absolute top-1/3 left-1/4 animate-pulse">
                    <MapPin className="h-8 w-8 text-green-500" />
                    <div className="absolute -bottom-5 left-1/2 -translate-x-1/2">
                        <span className="text-xs bg-black/50 text-white p-1 rounded">You</span>
                    </div>
                </div>
                 <div className="absolute top-2/3 left-2/3 animate-bounce">
                    <Car className="h-8 w-8 text-blue-500" />
                     <div className="absolute -bottom-5 left-1/2 -translate-x-1/2">
                        <span className="text-xs bg-black/50 text-white p-1 rounded">Driver</span>
                    </div>
                </div>
              </div>
            )}
          </CardContent>
        </Card>
      </div>
    </div>
  );
}
