
"use client"

import Image from 'next/image';
import Link from 'next/link';
import { Package, Store, ArrowRight, Car, UtensilsCrossed } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardFooter, CardHeader, CardTitle } from '@/components/ui/card';
import { PlaceHolderImages } from '@/lib/placeholder-images';
import { useAuth } from '@/context/app-context';
import { MopedIcon } from '@/components/icons';


const features = [
  {
    title: 'Book Okada',
    description: 'Fast and reliable motorcycle rides to get you through the city traffic.',
    icon: MopedIcon,
    href: '/book',
    cta: 'Book Now',
  },
   {
    title: 'Book Taxi',
    description: 'Comfortable and private car rides for your convenience.',
    icon: Car,
    href: '/book',
    cta: 'Book Now',
  },
  {
    title: 'Dispatch Now',
    description: 'Affordable and secure on-demand dispatch services.',
    icon: Package,
    href: '/dispatch',
    cta: 'Dispatch Now',
  },
];

export default function Home() {
  const { user } = useAuth();
  const heroImage = PlaceHolderImages.find(p => p.id === 'hero-image');

  return (
    <div className="flex flex-col">
      <section className="relative w-full h-[50vh] md:h-[60vh]">
        {heroImage && (
          <Image
            src={heroImage.imageUrl}
            alt={heroImage.description}
            fill
            className="object-cover"
            priority
            data-ai-hint={heroImage.imageHint}
          />
        )}
        <div className="absolute inset-0 bg-black/50" />
        <div className="relative container mx-auto flex h-full flex-col items-center justify-center text-center text-white px-4">
          <h1 className="text-4xl font-bold tracking-tight sm:text-5xl md:text-6xl font-headline">
            Your City, Connected.
          </h1>
          <p className="mt-4 max-w-2xl text-lg sm:text-xl">
            Rides, deliveries, and local goods—all in one app. Akwaaba to Ghana Must Go.
          </p>
          <div className="mt-8 flex flex-col sm:flex-row gap-4">
            {user ? (
               <Link href="/book" passHref>
                  <Button size="lg" style={{ backgroundColor: 'hsl(var(--accent))', color: 'hsl(var(--accent-foreground))' }}>
                      Book a Service
                  </Button>
               </Link>
            ) : (
              <>
                 <Link href="/signup" passHref>
                   <Button size="lg" style={{ backgroundColor: 'hsl(var(--accent))', color: 'hsl(var(--accent-foreground))' }}>
                      Get Started
                  </Button>
                </Link>
                 <Link href="/login" passHref>
                   <Button size="lg" variant="secondary">
                    Login
                  </Button>
                </Link>
              </>
            )}
          </div>
        </div>
      </section>

      <section id="features" className="py-12 md:py-20 lg:py-24">
        <div className="container mx-auto">
          <div className="text-center">
            <h2 className="text-3xl font-bold tracking-tight sm:text-4xl font-headline">Everything You Need, One Tap Away</h2>
            <p className="mt-4 max-w-2xl mx-auto text-lg text-muted-foreground">
              From commuting to cravings, we've got you covered.
            </p>
          </div>
          <div className="mt-12 grid gap-8 md:grid-cols-2 lg:grid-cols-3">
            {features.map((feature) => (
              <Card key={feature.title} className="flex flex-col text-center items-center hover:shadow-lg transition-shadow duration-300">
                <CardHeader>
                  <div className="mx-auto flex h-16 w-16 items-center justify-center rounded-full bg-primary/10">
                    <feature.icon className="h-8 w-8 text-primary" />
                  </div>
                  <CardTitle className="mt-4 font-headline">{feature.title}</CardTitle>
                </CardHeader>
                <CardContent className="flex-grow">
                  <p className="text-muted-foreground">{feature.description}</p>
                </CardContent>
                <CardFooter className="p-6 pt-0 w-full">
                  <Link href={user ? feature.href : '/login'} passHref className="w-full">
                    <Button variant="outline" className="w-full text-primary border border-primary hover:bg-primary hover:text-primary-foreground">
                      {feature.cta} <ArrowRight className="ml-2 h-4 w-4" />
                    </Button>
                  </Link>
                </CardFooter>
              </Card>
            ))}
          </div>
        </div>
      </section>

       <section className="bg-muted py-12 md:py-20 lg:py-24">
        <div className="container mx-auto grid grid-cols-1 md:grid-cols-2 gap-8 items-center">
          <div className="space-y-4">
            <h2 className="text-3xl font-bold tracking-tight sm:text-4xl font-headline">Sell on Our Marketplace</h2>
            <p className="text-lg text-muted-foreground">
              Reach thousands of customers in your city. List your products, from artisan crafts to everyday goods, and grow your business with us.
            </p>
            <div className="flex flex-col sm:flex-row gap-4 pt-4">
              <Link href={user ? "/marketplace" : "/login"} passHref>
                <Button size="lg" className="bg-primary hover:bg-primary/90 text-primary-foreground">
                  Explore Market
                </Button>
              </Link>
              <Link href={user ? "/marketplace/list-item" : "/login"} passHref>
                <Button size="lg" variant="secondary">
                  Start Selling
                </Button>
              </Link>
            </div>
          </div>
          <div className="relative aspect-video bg-background rounded-lg shadow-md overflow-hidden">
             <Image
                src="https://images.unsplash.com/photo-1528698827598-95324919d353?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&ixid=M3w3NDE5ODJ8MHwxfHNlYXJjaHw1fHxsb2NhbCUyMG1hcmtldCUyMHNob3B8ZW58MHx8fHwxNzU5MjA0OTM4fDA&ixlib=rb-4.1.0&q=80&w=1080"
                alt="Local market stall"
                fill
                className="object-cover"
                data-ai-hint="local market"
              />
          </div>
        </div>
      </section>
    </div>
  );
}
