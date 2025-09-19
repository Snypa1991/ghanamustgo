import Image from 'next/image';
import { Star, Clock, PlusCircle } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { PlaceHolderImages } from '@/lib/placeholder-images';
import { Skeleton } from '@/components/ui/skeleton';

// Mock data has been removed. This page is now a template for real data.
const restaurant = { id: '1', name: 'Restaurant Name', cuisine: 'Cuisine', rating: 0.0, deliveryTime: 'N/A', imageId: 'restaurant-1' };
const menuItems: any[] = [];

export default function RestaurantDetailPage({ params }: { params: { id: string } }) {
  const restaurantImage = PlaceHolderImages.find(p => p.id === restaurant.imageId);

  // In a real app, you would fetch restaurant and menu data based on `params.id`
  // const [restaurant, setRestaurant] = useState(null);
  // const [menuItems, setMenuItems] = useState([]);
  // const [loading, setLoading] = useState(true);
  //
  // useEffect(() => {
  //   fetch(`/api/restaurants/${params.id}`)
  //     .then(res => res.json())
  //     .then(data => {
  //       setRestaurant(data.restaurant);
  //       setMenuItems(data.menuItems);
  //       setLoading(false);
  //     })
  // }, [params.id]);
  //
  // if(loading) {
  //  return <p>Loading...</p>
  // }


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
