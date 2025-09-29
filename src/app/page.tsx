
"use client"

import Image from 'next/image';
import Link from 'next/link';
import { Package, Store, ArrowRight, Car } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardFooter, CardHeader, CardTitle } from '@/components/ui/card';
import { PlaceHolderImages } from '@/lib/placeholder-images';
import { useAuth } from '@/context/app-context';


const features = [
  {
    title: 'Book a Ride or Dispatch',
    description: 'Fast, reliable rides and deliveries to get you where you need to be.',
    icon: Car,
    href: '/book',
    cta: 'Book Now',
  },
  {
    title: 'Shop Local',
    description: 'Discover and buy unique items from local sellers.',
    icon: Store,
    href: '/marketplace',
    cta: 'Explore Market',
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
        <div className="relative container mx-auto flex h-full flex-col items-center justify-center text-center text-white">
          <h1 className="text-4xl font-bold tracking-tight sm:text-5xl md:text-6xl font-headline">
            Your City, Connected.
          </h1>
          <p className="mt-4 max-w-2xl text-lg sm:text-xl">
            Rides, deliveries, and local goods—all in one app. Akwaaba to Ghana Must Go.
          </p>
          <div className="mt-8 flex gap-4">
            {user ? (
               <Link href="/book">
                  <Button size="lg" className="bg-primary hover:bg-primary/90 text-primary-foreground">
                      Book a Service
                  </Button>
               </Link>
            ) : (
              <>
                 <Link href="/signup">
                   <Button size="lg" className="bg-primary hover:bg-primary/90 text-primary-foreground">
                      Get Started
                  </Button>
                </Link>
                 <Link href="/login">
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
          <div className="mt-12 grid gap-8 md:grid-cols-2">
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
                  <Link href={feature.href} className="w-full">
                    <Button variant="ghost" className="w-full text-accent border border-accent hover:bg-accent hover:text-accent-foreground">
                      {feature.cta} <ArrowRight className="ml-2 h-4 w-4" />
                    </Button>
                  </Link>
                </CardFooter>
              </Card>
            ))}
          </div>
        </div>
      </section>
    </div>
  );
}
