
"use client";

import { useState } from 'react';
import Link from 'next/link';
import { Package, UtensilsCrossed, Store, UserCircle, Menu, LogOut, Car, Shield, LayoutDashboard } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Sheet, SheetContent, SheetHeader, SheetTitle, SheetTrigger } from '@/components/ui/sheet';
import { GhanaMustGoIcon } from '@/components/icons';
import { useAuth } from '@/context/app-context';
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
  DropdownMenuGroup,
} from "@/components/ui/dropdown-menu"
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
import { Separator } from '../ui/separator';

const defaultNavItems = [
  { href: '/book', icon: Car, label: 'Book' },
  { href: '/dispatch', icon: Package, label: 'Dispatch' },
  { href: '/food', icon: UtensilsCrossed, label: 'Food' },
  { href: '/marketplace', icon: Store, label: 'Market' },
];

const partnerNavItems = [
    { href: '/dashboard', icon: LayoutDashboard, label: 'Dashboard' },
    { href: '/marketplace', icon: Store, label: 'Market' },
];

export default function Header() {
  const { user, logout } = useAuth();
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);

  const isPartner = user?.role === 'biker' || user?.role === 'driver';
  const navItems = isPartner ? partnerNavItems : defaultNavItems;

  return (
    <header className="sticky top-0 z-50 w-full border-b bg-background/95 backdrop-blur supports-[backdrop-filter]:bg-background/60">
      <div className="container flex h-16 items-center justify-between">
        
        <Link href="/" className="flex items-center space-x-2">
          <GhanaMustGoIcon className="h-12 w-auto text-primary" />
        </Link>
        
        <Sheet open={isMobileMenuOpen} onOpenChange={setIsMobileMenuOpen}>
          <SheetTrigger asChild>
            <Button variant="ghost" size="icon">
              <Menu className="h-6 w-6" />
              <span className="sr-only">Toggle Menu</span>
            </Button>
          </SheetTrigger>
          <SheetContent side="right">
            <SheetHeader>
               <Link href="/" className="flex items-center space-x-2" onClick={() => setIsMobileMenuOpen(false)}>
                <GhanaMustGoIcon className="h-12 w-auto text-primary" />
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
                        onClick={() => setIsMobileMenuOpen(false)}
                      >
                        <item.icon className="h-5 w-5" />
                        <span>{item.label}</span>
                      </Link>
                    </li>
                  ))}
                   {user?.role === 'vendor' && (
                     <li>
                       <Link href="/vendor/dashboard" className="flex items-center space-x-3 text-lg font-medium text-accent hover:text-primary p-2 rounded-md" onClick={() => setIsMobileMenuOpen(false)}>
                         <LayoutDashboard className="h-5 w-5" />
                         <span>Vendor Dashboard</span>
                       </Link>
                     </li>
                  )}
                   {user?.role === 'admin' && (
                     <li>
                       <Link href="/admin/dashboard" className="flex items-center space-x-3 text-lg font-medium text-accent hover:text-primary p-2 rounded-md" onClick={() => setIsMobileMenuOpen(false)}>
                         <Shield className="h-5 w-5" />
                         <span>Admin Dashboard</span>
                       </Link>
                     </li>
                  )}
                </ul>
              </nav>
              <div className="mt-auto">
                <Separator className="my-4" />
                {user ? (
                   <div className="space-y-4">
                     <DropdownMenu>
                        <DropdownMenuTrigger asChild>
                          <Button variant="ghost" className="w-full justify-start h-auto py-2 px-2">
                             <div className="flex items-center gap-2">
                               <Avatar className="h-9 w-9">
                                <AvatarImage src={`https://picsum.photos/seed/${user.email}/100/100`} alt={user.name} />
                                <AvatarFallback>{user.name.charAt(0)}</AvatarFallback>
                              </Avatar>
                               <div className="text-left">
                                <p className="text-sm font-medium leading-none">{user.name}</p>
                                <p className="text-xs leading-none text-muted-foreground">
                                  {user.email}
                                </p>
                              </div>
                             </div>
                          </Button>
                        </DropdownMenuTrigger>
                        <DropdownMenuContent className="w-56 mb-2" align="end">
                          <DropdownMenuItem asChild>
                             <Link href="/profile" onClick={() => setIsMobileMenuOpen(false)}><UserCircle className="mr-2 h-4 w-4" />Profile</Link>
                          </DropdownMenuItem>
                          <DropdownMenuSeparator />
                        </DropdownMenuContent>
                      </DropdownMenu>
                      <Button variant="outline" className="w-full" onClick={() => { logout(); setIsMobileMenuOpen(false); }}>
                        <LogOut className="mr-2 h-4 w-4" />
                        Log out
                      </Button>
                   </div>
                ) : (
                  <div className="flex items-center gap-2">
                    <Link href="/login" className="flex-1" onClick={() => setIsMobileMenuOpen(false)}>
                      <Button className="w-full" variant="outline">
                        Login
                      </Button>
                    </Link>
                    <Link href="/signup" className="flex-1" onClick={() => setIsMobileMenuOpen(false)}>
                      <Button className="w-full" style={{ backgroundColor: 'hsl(var(--accent))', color: 'hsl(var(--accent-foreground))' }}>
                        Sign Up
                      </Button>
                    </Link>
                  </div>
                )}
              </div>
            </div>
          </SheetContent>
        </Sheet>
      </div>
    </header>
  );
}
