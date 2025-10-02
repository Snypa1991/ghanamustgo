
"use client";

import Link from 'next/link';
import { Package, UtensilsCrossed, Store, Menu, Car, Shield, LayoutDashboard } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Sheet, SheetContent, SheetHeader, SheetTrigger } from '@/components/ui/sheet';
import { GhanaMustGoIcon } from '@/components/icons';
import { useAuth } from '@/context/app-context';
import { Separator } from '../ui/separator';
import { UserNav } from './user-nav';

const defaultNavItems = [
  { href: '/book', icon: Car, label: 'Book' },
  { href: '/food', icon: UtensilsCrossed, label: 'Food' },
  { href: '/marketplace', icon: Store, label: 'Market' },
];

const partnerNavItems = [
    { href: '/dashboard', icon: LayoutDashboard, label: 'Dashboard' },
    { href: '/marketplace', icon: Store, label: 'Market' },
];

export default function Header() {
  const { user } = useAuth();

  const isPartner = user?.role === 'biker' || user?.role === 'driver';
  const navItems = isPartner ? partnerNavItems : defaultNavItems;

  return (
    <header className="sticky top-0 z-50 w-full border-b bg-background/95 backdrop-blur supports-[backdrop-filter]:bg-background/60">
      <div className="container flex h-16 items-center justify-between">
        
        <Link href="/" className="flex items-center space-x-2">
          <GhanaMustGoIcon className="h-8 w-auto text-primary" />
           <span className="font-bold font-headline text-lg">Ghana Must Go</span>
        </Link>

        
        <div className="flex items-center gap-4">
          <div className="hidden md:block">
             <UserNav />
          </div>
         
          <Sheet>
            <SheetTrigger asChild>
              <Button variant="ghost" size="icon" className="">
                <Menu className="h-6 w-6" />
                <span className="sr-only">Toggle Menu</span>
              </Button>
            </SheetTrigger>
            <SheetContent side="right">
              <SheetHeader>
                <Link href="/" className="flex items-center space-x-2">
                  <GhanaMustGoIcon className="h-8 w-auto" />
                   <span className="font-bold font-headline text-lg">Ghana Must Go</span>
                </Link>
              </SheetHeader>
              <Separator className="my-4" />
              <div className="flex flex-col h-full">
                <nav className="flex-grow">
                  <ul className="space-y-2">
                    {navItems.map((item) => (
                      <li key={item.label}>
                        <Link 
                          href={item.href} 
                          className="flex items-center space-x-3 text-lg font-medium text-foreground/80 hover:text-primary p-2 rounded-md"
                        >
                          <item.icon className="h-5 w-5" />
                          <span>{item.label}</span>
                        </Link>
                      </li>
                    ))}
                    {user?.role === 'vendor' && (
                       <li>
                         <Link href="/vendor/dashboard" className="flex items-center space-x-3 text-lg font-medium text-accent hover:text-primary p-2 rounded-md">
                           <LayoutDashboard className="h-5 w-5" />
                           <span>Vendor Dashboard</span>
                         </Link>
                       </li>
                    )}
                     {user?.role === 'admin' && (
                       <li>
                         <Link href="/admin/dashboard" className="flex items-center space-x-3 text-lg font-medium text-accent hover:text-primary p-2 rounded-md">
                           <Shield className="h-5 w-5" />
                           <span>Admin Dashboard</span>
                         </Link>
                       </li>
                    )}
                  </ul>
                </nav>
                <div className="mt-auto">
                  <Separator className="my-4" />
                   <UserNav />
                </div>
              </div>
            </SheetContent>
          </Sheet>
        </div>
      </div>
    </header>
  );
}
