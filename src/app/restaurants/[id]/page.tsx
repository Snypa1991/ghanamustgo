import Image from 'next/image';
import { Star, Clock, PlusCircle } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { PlaceHolderImages } from '@/lib/placeholder-images';
import { Skeleton } from '@/components/ui/skeleton';

// In a real app, you would fetch this data. For the prototype, we use sample data.
const allRestaurants = [
  { id: '1', name: 'Jollof King', cuisine: 'Ghanaian', rating: 4.8, deliveryTime: '30-45 min', imageId: 'restaurant-1' },
  { id: '2', name: 'The Cozy Corner', cuisine: 'Cafe', rating: 4.5, deliveryTime: '20-30 min', imageId: 'restaurant-2' },
  { id: '3', name: 'Aunty Mary\'s Kitchen', cuisine: 'Local', rating: 4.9, deliveryTime: '40-55 min', imageId: 'restaurant-3' },
];

const allMenuItems = [
    {id: 'm1', restaurantId: '1', name: 'Jollof with Grilled Chicken', description: 'The classic, smoky and delicious.', price: '15.00', imageId: 'food-1' },
    {id: 'm2', restaurantId: '1', name: 'Banku and Tilapia', description: 'Served with fresh hot pepper.', price: '20.00', imageId: 'food-3' },
    {id: 'm3', restaurantId: '1', name: 'Waakye Special', description: 'With all the trimmings.', price: '12.00', imageId: 'food-4' },
    {id: 'm4', restaurantId: '2', name: 'Iced Coffee', description: 'Freshly brewed and chilled.', price: '5.00', imageId: 'food-5' },
    {id: 'm5', restaurantId: '2', name: 'Meat Pie', description: 'A savory and filling pastry.', price: '3.00', imageId: 'food-6' },
    {id: 'm6', restaurantId: '3', name: 'Fufu with Light Soup', description: 'A Sunday special, available daily.', price: '18.00', imageId: 'food-2' },
];


export default function RestaurantDetailPage({ params }: { params: { id: string } }) {
  const restaurant = allRestaurants.find(r => r.id === params.id) || { id: '0', name: 'Restaurant Not Found', cuisine: 'N/A', rating: 0.0, deliveryTime: 'N/A', imageId: '' };
  const menuItems = allMenuItems.filter(m => m.restaurantId === params.id);
  const restaurantImage = PlaceHolderImages.find(p => p.id === restaurant.imageId);

  return (
    <div>
        <section className="relative w-full h-64 bg-muted">
            {restaurantImage && (
              <Image
                src={restaurantImage.imageUrl}
                alt={restaurant.name}
                fill
                className="object-cover"
                data-ai-hint={restaurantImage.imageHint}
              />
            )}
            <div className="absolute inset-0 bg-gradient-to-t from-black/80 to-transparent" />
            <div className="relative container mx-auto flex h-full items-end pb-8 text-white">
                <div>
                    <h1 className="text-4xl font-bold font-headline">{restaurant.name}</h1>
                    <div className="flex items-center gap-4 mt-2">
                        <Badge variant="secondary">{restaurant.cuisine}</Badge>
                        <div className="flex items-center gap-1">
                            <Star className="w-5 h-5 text-yellow-400 fill-yellow-400" />
                            <span className="font-semibold">{restaurant.rating.toFixed(1)}</span>
                        </div>
                        <div className="flex items-center gap-1">
                            <Clock className="w-5 h-5" />
                            <span>{restaurant.deliveryTime}</span>
                        </div>
                    </div>
                </div>
            </div>
      </section>
      
      <div className="container py-12">
        <h2 className="text-3xl font-bold font-headline mb-8">Menu</h2>
        {menuItems.length > 0 ? (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              {menuItems.map(item => {
                  const itemImage = PlaceHolderImages.find(p => p.id === item.imageId);
                  return (
                      <Card key={item.id} className="flex flex-col">
                          <CardHeader className="flex-row gap-4 items-start">
                               {itemImage && (
                                  <Image
                                      src={itemImage.imageUrl}
                                      alt={item.name}
                                      width={80}
                                      height={80}
                                      className="rounded-md object-cover"
                                      data-ai-hint={itemImage.imageHint}
                                  />
                              )}
                              <div className="flex-grow">
                                  <CardTitle className="font-headline text-lg">{item.name}</CardTitle>
                                  <p className="text-sm text-muted-foreground mt-1">{item.description}</p>
                              </div>
                          </CardHeader>
                          <CardContent className="flex-grow flex items-end justify-between">
                              <p className="text-xl font-bold text-primary">${item.price}</p>
                              <Button size="sm" style={{ backgroundColor: 'hsl(var(--accent))', color: 'hsl(var(--accent-foreground))' }}>
                                  <PlusCircle className="mr-2 h-4 w-4" />
                                  Add
                              </Button>
                          </CardContent>
                      </Card>
                  );
              })}
          </div>
        ) : (
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                {[1,2,3].map(i => (
                    <Card key={i}>
                        <CardHeader className="flex-row gap-4 items-start">
                            <Skeleton className="w-20 h-20 rounded-md" />
                            <div className="flex-grow space-y-2">
                                <Skeleton className="h-5 w-3/4" />
                                <Skeleton className="h-4 w-full" />
                                <Skeleton className="h-4 w-1/2" />
                            </div>
                        </CardHeader>
                        <CardContent className="flex items-end justify-between">
                            <Skeleton className="h-6 w-1/4" />
                            <Skeleton className="h-8 w-20" />
                        </CardContent>
                    </Card>
                ))}
                 <div className="md:col-span-2 lg:col-span-3 text-center py-10">
                    <p className="text-muted-foreground">No menu items have been added for this restaurant yet.</p>
                </div>
            </div>
        )}
      </div>
    </div>
  );
}
