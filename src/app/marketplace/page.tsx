
"use client";

import Image from 'next/image';
import Link from 'next/link';
import { Store, Tag, ShoppingCart, Search } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardFooter, CardHeader, CardTitle } from '@/components/ui/card';
import { PlaceHolderImages } from '@/lib/placeholder-images';
import { useState, useMemo } from 'react';
import { Input } from '@/components/ui/input';

const items = [
  { id: '1', name: 'Traditional Kente Cloth', price: '150.00', imageId: 'marketplace-item-1', imageHint: 'kente cloth' },
  { id: '2', name: 'Handmade Leather Sandals', price: '45.00', imageId: 'marketplace-item-2', imageHint: 'leather sandals' },
  { id: '3', name: 'Beaded Jewelry Set', price: '75.00', imageId: 'marketplace-item-3', imageHint: 'beaded jewelry' },
  { id: '4', name: 'Carved Wooden Mask', price: '90.00', imageId: 'marketplace-item-4', imageHint: 'wooden mask' },
];

export default function MarketplacePage() {
  const [searchQuery, setSearchQuery] = useState('');

  const filteredItems = useMemo(() => {
    if (!searchQuery) {
      return items;
    }
    return items.filter(item => 
      item.name.toLowerCase().includes(searchQuery.toLowerCase())
    );
  }, [searchQuery]);

  return (
    <div className="container py-8 md:py-12">
      <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-6 mb-8 md:mb-12">
        <div className="text-left">
          <Store className="h-12 w-12 text-primary" />
          <h1 className="mt-4 text-4xl font-bold font-headline">Marketplace</h1>
          <p className="mt-2 text-lg text-muted-foreground">Discover unique items from local artisans and sellers.</p>
        </div>
        <div className="flex flex-col sm:flex-row gap-4 w-full md:w-auto">
            <div className="relative w-full sm:w-auto flex-grow">
              <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-5 w-5 text-muted-foreground" />
              <Input 
                placeholder="Search items..." 
                className="pl-10 w-full sm:w-64"
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
              />
            </div>
            <Link href="/marketplace/list-item" className="w-full sm:w-auto">
                <Button style={{ backgroundColor: 'hsl(var(--accent))', color: 'hsl(var(--accent-foreground))' }} className="w-full">
                    <Tag className="mr-2 h-4 w-4" />
                    Sell Your Item
                </Button>
            </Link>
        </div>
      </div>

      {filteredItems.length > 0 ? (
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
          {filteredItems.map((item) => {
            const image = PlaceHolderImages.find(p => p.id === item.imageId);
            return (
              <Card key={item.id} className="overflow-hidden hover:shadow-xl transition-shadow duration-300 group flex flex-col">
                <Link href={`/marketplace/${item.id}`} className="flex flex-col h-full">
                  {image && (
                    <div className="relative aspect-[4/3] bg-muted">
                        <Image
                            src={image.imageUrl}
                            alt={item.name}
                            fill
                            className="object-cover transition-transform duration-300 group-hover:scale-105"
                            data-ai-hint={item.imageHint}
                        />
                    </div>
                  )}
                  <CardHeader>
                    <CardTitle className="font-headline text-lg truncate">{item.name}</CardTitle>
                  </CardHeader>
                  <CardContent className="flex-grow">
                    <p className="text-sm text-muted-foreground">Starting at</p>
                    <p className="text-2xl font-bold text-primary">${item.price}</p>
                  </CardContent>
                  <CardFooter>
                    <Button variant="outline" className="w-full">View Item & Bid</Button>
                  </CardFooter>
                </Link>
              </Card>
            );
          })}
        </div>
      ) : (
        <div className="text-center py-16 border-2 border-dashed rounded-lg">
            <ShoppingCart className="mx-auto h-12 w-12 text-muted-foreground" />
            <h2 className="mt-6 text-2xl font-semibold font-headline">No Items Found</h2>
             <p className="mt-2 text-muted-foreground">Your search for "{searchQuery}" did not match any items.</p>
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
