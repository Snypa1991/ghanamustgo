import Image from 'next/image';
import { Star, Clock, PlusCircle } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardFooter, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { PlaceHolderImages } from '@/lib/placeholder-images';

// Mock data
const restaurant = { id: '1', name: 'Jollof King', cuisine: 'Ghanaian', rating: 4.8, deliveryTime: '30-45 min', imageId: 'restaurant-1' };
const menuItems = [
    { id: '1', name: 'Jollof Rice with Chicken', price: '12.00', imageId: 'food-1', description: "Classic smoky jollof rice served with grilled chicken." },
    { id: '2', name: 'Fufu with Light Soup', price: '10.50', imageId: 'food-2', description: "Soft pounded fufu with a flavorful, light goat soup." },
    { id: '3', name: 'Waakye', price: '8.00', imageId: 'food-1', description: "A beloved breakfast dish of rice and beans with accompaniments." },
    { id: '4', name: 'Banku with Tilapia', price: '15.00', imageId: 'food-2', description: "Grilled tilapia served with fermented corn and cassava dough." },
];

export default function RestaurantDetailPage({ params }: { params: { id: string } }) {
  const restaurantImage = PlaceHolderImages.find(p => p.id === restaurant.imageId);

  return (
    <div>
        <section className="relative w-full h-64">
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
                            <span className="font-semibold">{restaurant.rating}</span>
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
      </div>
    </div>
  );
}
