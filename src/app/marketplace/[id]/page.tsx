
"use client";

import Image from 'next/image';
import Link from 'next/link';
import { ArrowLeft, CheckCircle, Shield, Truck } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Card, CardContent } from '@/components/ui/card';
import { PlaceHolderImages } from '@/lib/placeholder-images';
import { Carousel, CarouselContent, CarouselItem, CarouselNext, CarouselPrevious } from '@/components/ui/carousel';
import BiddingCard from '@/components/bidding-card';
import { notFound } from 'next/navigation';

const items = [
  { id: '1', name: 'Traditional Kente Cloth', price: 150.00, imageId: 'marketplace-item-1', description: "This vibrant and authentic Kente cloth is hand-woven by master artisans in Ghana. Made from high-quality cotton and rayon, it features traditional patterns rich in symbolism. Perfect for special occasions, cultural events, or as a stunning piece of home decor. Dimensions: 12 yards.", gallery: ['marketplace-item-1', 'kente-detail-1', 'kente-detail-2'] },
  { id: '2', name: 'Handmade Leather Sandals', price: 45.00, imageId: 'marketplace-item-2', description: "Step out in style with these comfortable and durable handmade leather sandals. Crafted by local cobblers, they feature intricate beadwork and a sturdy sole, perfect for the tropical climate. A true blend of tradition and modern fashion.", gallery: ['marketplace-item-2', 'sandals-detail-1', 'sandals-detail-2'] },
  { id: '3', name: 'Beaded Jewelry Set', price: 75.00, imageId: 'marketplace-item-3', description: "Adorn yourself with this exquisite beaded jewelry set, including a necklace, bracelet, and earrings. Each bead is carefully selected and strung to create a unique and colorful accessory that tells a story. A beautiful gift for a loved one.", gallery: ['marketplace-item-3', 'jewelry-detail-1', 'jewelry-detail-2'] },
  { id: '4', name: 'Carved Wooden Mask', price: 90.00, imageId: 'marketplace-item-4', description: "A striking and authentic carved wooden mask, handcrafted from a single piece of sese wood. This piece of art represents a traditional Adinkra symbol and adds a touch of African heritage to any room. Ideal for collectors and art enthusiasts.", gallery: ['marketplace-item-4', 'mask-detail-1', 'mask-detail-2'] },
];

// Add dummy images for gallery
const extendedPlaceHolderImages = [
    ...PlaceHolderImages,
    { id: 'kente-detail-1', description: 'Close-up of Kente cloth weave', imageUrl: 'https://picsum.photos/seed/kente-d1/800/600', imageHint: 'kente cloth' },
    { id: 'kente-detail-2', description: 'Kente cloth being worn', imageUrl: 'https://picsum.photos/seed/kente-d2/800/600', imageHint: 'kente cloth' },
    { id: 'sandals-detail-1', description: 'Detail of sandal beadwork', imageUrl: 'https://picsum.photos/seed/sandals-d1/800/600', imageHint: 'leather sandals' },
    { id: 'sandals-detail-2', description: 'Person wearing the sandals', imageUrl: 'https://picsum.photos/seed/sandals-d2/800/600', imageHint: 'sandals feet' },
    { id: 'jewelry-detail-1', description: 'Close-up of beaded necklace', imageUrl: 'https://picsum.photos/seed/jewelry-d1/800/600', imageHint: 'beaded jewelry' },
    { id: 'jewelry-detail-2', description: 'Jewelry set on a display', imageUrl: 'https://picsum.photos/seed/jewelry-d2/800/600', imageHint: 'jewelry set' },
    { id: 'mask-detail-1', description: 'Side view of the wooden mask', imageUrl: 'https://picsum.photos/seed/mask-d1/800/600', imageHint: 'wooden mask' },
    { id: 'mask-detail-2', description: 'Mask hanging on a wall', imageUrl: 'https://picsum.photos/seed/mask-d2/800/600', imageHint: 'mask wall' },
];


export default function MarketplaceItemPage({ params }: { params: { id: string } }) {
  const item = items.find(i => i.id === params.id);

  if (!item) {
    notFound();
  }

  return (
    <div className="container py-12">
        <Link href="/marketplace" className="inline-flex items-center text-sm text-muted-foreground hover:text-primary mb-6">
            <ArrowLeft className="mr-2 h-4 w-4" />
            Back to Marketplace
        </Link>
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8 lg:gap-12">
            <div className="lg:col-span-2 space-y-8">
                <Carousel className="w-full">
                    <CarouselContent>
                        {item.gallery.map((imageId, index) => {
                            const image = extendedPlaceHolderImages.find(p => p.id === imageId);
                            return (
                                <CarouselItem key={index}>
                                    <Card className="overflow-hidden">
                                        <div className="relative aspect-[4/3]">
                                            {image && (
                                                <Image
                                                    src={image.imageUrl}
                                                    alt={`${item.name} - image ${index + 1}`}
                                                    fill
                                                    className="object-cover"
                                                    data-ai-hint={image.imageHint}
                                                />
                                            )}
                                        </div>
                                    </Card>
                                </CarouselItem>
                            );
                        })}
                    </CarouselContent>
                    <CarouselPrevious className="left-2 sm:left-4" />
                    <CarouselNext className="right-2 sm:right-4" />
                </Carousel>
                
                <Card>
                    <CardContent className="p-6">
                        <h1 className="text-3xl font-bold font-headline mb-2">{item.name}</h1>
                        <p className="text-lg text-muted-foreground mb-6">By Yaw Vendor</p>
                        
                        <h2 className="font-bold text-lg mb-2">Description</h2>
                        <p className="text-muted-foreground leading-relaxed">{item.description}</p>
                        
                        <div className="mt-6 grid grid-cols-1 md:grid-cols-3 gap-6 text-sm">
                            <div className="flex items-center gap-3">
                                <div className="flex h-10 w-10 items-center justify-center rounded-full bg-primary/10">
                                    <CheckCircle className="h-5 w-5 text-primary" />
                                </div>
                                <div>
                                    <h3 className="font-semibold">Authentic</h3>
                                    <p className="text-muted-foreground">Verified seller</p>
                                </div>
                            </div>
                             <div className="flex items-center gap-3">
                                 <div className="flex h-10 w-10 items-center justify-center rounded-full bg-primary/10">
                                    <Shield className="h-5 w-5 text-primary" />
                                </div>
                                <div>
                                    <h3 className="font-semibold">Secure Payment</h3>
                                    <p className="text-muted-foreground">Paystack protected</p>
                                </div>
                            </div>
                             <div className="flex items-center gap-3">
                                <div className="flex h-10 w-10 items-center justify-center rounded-full bg-primary/10">
                                    <Truck className="h-5 w-5 text-primary" />
                                </div>
                                <div>
                                    <h3 className="font-semibold">Fast Dispatch</h3>
                                    <p className="text-muted-foreground">Ships in 24 hours</p>
                                </div>
                            </div>
                        </div>
                    </CardContent>
                </Card>
            </div>
            
            <div className="w-full">
                <BiddingCard itemId={item.id} startingPrice={item.price} />
            </div>
        </div>
    </div>
  );
}
