import Image from 'next/image';
import Link from 'next/link';
import { UtensilsCrossed, Star, Clock, Inbox } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardFooter, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { PlaceHolderImages } from '@/lib/placeholder-images';

const restaurants = [
  { id: '1', name: 'Jollof King', cuisine: 'Ghanaian', rating: 4.8, deliveryTime: '30-45 min', imageId: 'restaurant-1' },
  { id: '2', name: 'The Cozy Corner', cuisine: 'Cafe', rating: 4.5, deliveryTime: '20-30 min', imageId: 'restaurant-2' },
  { id: '3', name: 'Aunty Mary\'s Kitchen', cuisine: 'Local', rating: 4.9, deliveryTime: '40-55 min', imageId: 'restaurant-3' },
  { id: '4', name: 'Continental Bites', cuisine: 'International', rating: 4.6, deliveryTime: '35-50 min', imageId: 'restaurant-4' },
];

export default function RestaurantsPage() {
  return (
    <div className="container py-12">
      <div className="text-left mb-12">
        <UtensilsCrossed className="h-12 w-12 text-primary" />
        <h1 className="mt-4 text-4xl font-bold font-headline">Order Food</h1>
        <p className="mt-2 text-lg text-muted-foreground">The best local flavors, delivered right to you.</p>
      </div>

      {restaurants.length > 0 ? (
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
          {restaurants.map((resto) => {
            const image = PlaceHolderImages.find(p => p.id === resto.imageId);
            return (
               <Link key={resto.id} href={`/restaurants/${resto.id}`} className="group">
                  <Card className="overflow-hidden h-full flex flex-col hover:shadow-xl transition-shadow duration-300">
                    {image && (
                       <div className="relative aspect-[16/9] bg-muted">
                          <Image
                              src={image.imageUrl}
                              alt={resto.name}
                              fill
                              className="object-cover transition-transform duration-300 group-hover:scale-105"
                              data-ai-hint={image.imageHint}
                          />
                       </div>
                    )}
                    <CardHeader>
                      <CardTitle className="font-headline text-xl truncate">{resto.name}</CardTitle>
                      <div className="flex items-center justify-between text-sm text-muted-foreground pt-2">
                          <Badge variant="secondary">{resto.cuisine}</Badge>
                          <div className="flex items-center gap-1">
                              <Star className="w-4 h-4 text-yellow-500 fill-yellow-500" />
                              <span>{resto.rating}</span>
                          </div>
                      </div>
                    </CardHeader>
                    <CardContent className="flex-grow"></CardContent>
                    <CardFooter>
                       <div className="flex items-center text-sm text-muted-foreground">
                          <Clock className="w-4 h-4 mr-1" />
                          <span>{resto.deliveryTime}</span>
                      </div>
                    </CardFooter>
                  </Card>
               </Link>
            );
          })}
        </div>
      ) : (
         <div className="text-center py-16 border-2 border-dashed rounded-lg">
            <Inbox className="mx-auto h-12 w-12 text-muted-foreground" />
            <h2 className="mt-6 text-2xl font-semibold font-headline">No Restaurants Available</h2>
            <p className="mt-2 text-muted-foreground">We are not currently serving in your area. Please check back later!</p>
        </div>
      )}
    </div>
  );
}
