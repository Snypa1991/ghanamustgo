import Image from 'next/image';
import Link from 'next/link';
import { Store, Tag, ShoppingCart } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardFooter, CardHeader, CardTitle } from '@/components/ui/card';
import { PlaceHolderImages } from '@/lib/placeholder-images';

const items = [
  { id: '1', name: 'Traditional Kente Cloth', price: '150.00', imageId: 'marketplace-item-1' },
  { id: '2', name: 'Handmade Leather Sandals', price: '45.00', imageId: 'marketplace-item-2' },
  { id: '3', name: 'Beaded Jewelry Set', price: '75.00', imageId: 'marketplace-item-3' },
  { id: '4', name: 'Carved Wooden Mask', price: '90.00', imageId: 'marketplace-item-4' },
];

export default function MarketplacePage() {
  return (
    <div className="container py-12">
      <div className="flex justify-between items-center mb-12">
        <div className="text-left">
          <Store className="h-12 w-12 text-primary" />
          <h1 className="mt-4 text-4xl font-bold font-headline">Marketplace</h1>
          <p className="mt-2 text-lg text-muted-foreground">Discover unique items from local artisans and sellers.</p>
        </div>
        <Link href="/marketplace/list-item">
            <Button style={{ backgroundColor: 'hsl(var(--accent))', color: 'hsl(var(--accent-foreground))' }}>
                <Tag className="mr-2 h-4 w-4" />
                Sell Your Item
            </Button>
        </Link>
      </div>

      {items.length > 0 ? (
        <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-6">
          {items.map((item) => {
            const image = PlaceHolderImages.find(p => p.id === item.imageId);
            return (
              <Card key={item.id} className="overflow-hidden hover:shadow-xl transition-shadow duration-300 group">
                {image && (
                   <div className="relative aspect-[4/3] bg-muted">
                      <Image
                          src={image.imageUrl}
                          alt={item.name}
                          fill
                          className="object-cover transition-transform duration-300 group-hover:scale-105"
                          data-ai-hint={image.imageHint}
                      />
                   </div>
                )}
                <CardHeader>
                  <CardTitle className="font-headline text-lg truncate">{item.name}</CardTitle>
                </CardHeader>
                <CardContent>
                  <p className="text-2xl font-bold text-primary">${item.price}</p>
                </CardContent>
                <CardFooter>
                  <Button variant="outline" className="w-full">View Item</Button>
                </CardFooter>
              </Card>
            );
          })}
        </div>
      ) : (
        <div className="text-center py-16 border-2 border-dashed rounded-lg">
            <ShoppingCart className="mx-auto h-12 w-12 text-muted-foreground" />
            <h2 className="mt-6 text-2xl font-semibold font-headline">Marketplace is Empty</h2>
            <p className="mt-2 text-muted-foreground">No items have been listed for sale yet. Be the first to sell!</p>
            <Link href="/marketplace/list-item" className="mt-6 inline-block">
                 <Button style={{ backgroundColor: 'hsl(var(--accent))', color: 'hsl(var(--accent-foreground))' }}>
                    <Tag className="mr-2 h-4 w-4" />
                    List Your Item
                </Button>
            </Link>
        </div>
      )}
    </div>
  );
}
