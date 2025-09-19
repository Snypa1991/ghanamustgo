import Image from 'next/image';
import { MapPin } from 'lucide-react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { PlaceHolderImages } from '@/lib/placeholder-images';
import RouteOptimization from '@/components/route-optimization';
import { MopedIcon } from '@/components/icons';

export default function BookRidePage() {
  const mapImage = PlaceHolderImages.find(p => p.id === 'map-background');

  return (
    <div className="container py-12">
      <div className="text-center mb-12">
        <MopedIcon className="mx-auto h-12 w-12 text-primary" />
        <h1 className="mt-4 text-4xl font-bold font-headline">Book an Okada Ride</h1>
        <p className="mt-2 text-lg text-muted-foreground">Enter your details and let us find the quickest route for you.</p>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 items-start">
        <RouteOptimization />

        <Card className="overflow-hidden">
          <CardHeader>
            <CardTitle className="font-headline">Live Map</CardTitle>
            <CardDescription>Track your rider in real-time (simulation).</CardDescription>
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
                 <div className="absolute top-1/3 left-1/4">
                    <MapPin className="h-8 w-8 text-green-500 animate-pulse" />
                    <span className="text-xs bg-black/50 text-white p-1 rounded">You</span>
                </div>
                 <div className="absolute top-2/3 left-2/3">
                    <MopedIcon className="h-8 w-8 text-blue-500 animate-bounce" />
                     <span className="text-xs bg-black/50 text-white p-1 rounded">Rider</span>
                </div>
              </div>
            )}
          </CardContent>
        </Card>
      </div>
    </div>
  );
}
