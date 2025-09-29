
"use client";

import { useState } from 'react';
import Link from 'next/link';
import { Package, UtensilsCrossed, Store, UserCircle, Menu, LogOut, Car, Shield, LayoutDashboard } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Sheet, SheetContent, SheetHeader, SheetTitle, SheetTrigger } from '@/components/ui/sheet';
import { GhanaMustGoIcon, MopedIcon } from '@/components/icons';
import { useAuth } from '@/context/app-context';
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu"
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';

const defaultNavItems = [
  { href: '/book', icon: Car, label: 'Book' },
  { href: '/restaurants', icon: UtensilsCrossed, label: 'Food' },
  { href: '/marketplace', icon: Store, label: 'Market' },
];

const partnerNavItems = [
    { href: '/dashboard', icon: LayoutDashboard, label: 'Dashboard' },
    { href: '/restaurants', icon: UtensilsCrossed, label: 'Food' },
    { href: '/marketplace', icon: Store, label: 'Market' },
];

export default function Header() {
  const { user, logout } = useAuth();
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);

  const isPartner = user?.role === 'biker' || user?.role === 'driver';
  const navItems = isPartner ? partnerNavItems : defaultNavItems;

  return (
    <header className="sticky top-0 z-50 w-full border-b bg-background/95 backdrop-blur supports-[backdrop-filter]:bg-background/60">
      <div className="container flex h-16 items-center">
        <div className="flex-1 md:flex-none md:mr-4 flex">
          <Link href="/" className="mr-6 flex items-center space-x-2">
            <GhanaMustGoIcon className="h-12 w-auto text-primary" />
          </Link>
          <nav className="hidden md:flex items-center space-x-6 text-sm font-medium">
            {navItems.map((item) => (
              <Link key={item.label} href={item.href} className="transition-colors hover:text-primary">
                {item.label}
              </Link>
            ))}
             {user?.role === 'admin' && (
                <Link href="/admin/dashboard" className="transition-colors hover:text-primary text-accent font-bold">
                  Dashboard
                </Link>
            )}
            {user?.role === 'vendor' && (
                <Link href="/vendor/dashboard" className="transition-colors hover:text-primary text-accent font-bold">
                  Dashboard
                </Link>
            )}
          </nav>
        </div>

        {/* Mobile Nav */}
        <div className="md:hidden">
          <Sheet open={isMobileMenuOpen} onOpenChange={setIsMobileMenuOpen}>
            <SheetTrigger asChild>
              <Button variant="ghost" size="icon">
                <Menu className="h-6 w-6" />
                <span className="sr-only">Toggle Menu</span>
              </Button>
            </SheetTrigger>
            <SheetContent side="left" className="p-0">
               <SheetHeader className="p-4 border-b">
                 <SheetTitle className="sr-only">Main Menu</SheetTitle>
                  <Link href="/" className="flex items-center space-x-2" onClick={() => setIsMobileMenuOpen(false)}>
                    <GhanaMustGoIcon className="h-12 w-auto text-primary" />
                    <span className="font-bold font-headline text-2xl">Ghana Must Go</span>
                  </Link>
                </SheetHeader>
              <div className="flex flex-col h-full">
                <nav className="flex-grow p-4">
                  <ul className="space-y-4">
                    {navItems.map((item) => (
                      <li key={item.label}>
                        <Link 
                          href={item.href} 
                          className="flex items-center space-x-3 text-lg font-medium text-foreground/80 hover:text-primary"
                          onClick={() => setIsMobileMenuOpen(false)}
                        >
                          <item.icon className="h-5 w-5" />
                          <span>{item.label}</span>
                        </Link>
                      </li>
                    ))}
                     {user?.role === 'vendor' && (
                       <li>
                         <Link href="/vendor/dashboard" className="flex items-center space-x-3 text-lg font-medium text-foreground/80 hover:text-primary" onClick={() => setIsMobileMenuOpen(false)}>
                           <LayoutDashboard className="h-5 w-5" />
                           <span>Vendor Dashboard</span>
                         </Link>
                       </li>
                    )}
                  </ul>
                </nav>
                <div className="p-4 mt-auto border-t">
                  {user ? (
                    <div className="space-y-2">
                       {user.role === 'admin' && (
                         <Link href="/admin/dashboard" onClick={() => setIsMobileMenuOpen(false)}>
                            <Button className="w-full justify-start" variant="ghost">
                                <Shield className="mr-2 h-5 w-5" /> Admin Dashboard
                            </Button>
                        </Link>
                       )}
                       <Link href="/profile" onClick={() => setIsMobileMenuOpen(false)}>
                          <Button className="w-full justify-start" variant="ghost">
                            <UserCircle className="mr-2 h-5 w-5" /> My Profile
                          </Button>
                        </Link>
                       <Button className="w-full justify-start" variant="ghost" onClick={() => { logout(); setIsMobileMenuOpen(false); }}>
                          <LogOut className="mr-2 h-5 w-5" /> Logout
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
        
        <div className="flex flex-1 items-center justify-end">
          <nav className="hidden md:flex items-center space-x-2">
            {user ? (
               <DropdownMenu>
                <DropdownMenuTrigger asChild>
                  <Button variant="ghost" className="relative h-8 w-8 rounded-full">
                    <Avatar className="h-8 w-8">
                       <AvatarImage src={`https://picsum.photos/seed/${user.email}/100/100`} alt={user.name} />
                      <AvatarFallback>{user.name.charAt(0)}</AvatarFallback>
                    </Avatar>
                  </Button>
                </DropdownMenuTrigger>
                <DropdownMenuContent className="w-56" align="end" forceMount>
                  <DropdownMenuLabel className="font-normal">
                    <div className="flex flex-col space-y-1">
                      <p className="text-sm font-medium leading-none">{user.name}</p>
                      <p className="text-xs leading-none text-muted-foreground">
                        {user.email}
                      </p>
                    </div>
                  </DropdownMenuLabel>
                  <DropdownMenuSeparator />
                   {user.role === 'admin' && (
                    <DropdownMenuItem asChild>
                        <Link href="/admin/dashboard"><Shield className="mr-2 h-4 w-4" />Admin Dashboard</Link>
                    </DropdownMenuItem>
                   )}
                   {isPartner && (
                     <DropdownMenuItem asChild>
                        <Link href="/dashboard"><LayoutDashboard className="mr-2 h-4 w-4" />Dashboard</Link>
                    </DropdownMenuItem>
                   )}
                   {user.role === 'vendor' && (
                     <DropdownMenuItem asChild>
                        <Link href="/vendor/dashboard"><LayoutDashboard className="mr-2 h-4 w-4" />Vendor Dashboard</Link>
                    </DropdownMenuItem>
                   )}
                  <DropdownMenuItem asChild>
                    <Link href="/profile"><UserCircle className="mr-2 h-4 w-4" />Profile</Link>
                  </DropdownMenuItem>
                  <DropdownMenuSeparator />
                  <DropdownMenuItem onClick={logout}>
                    <LogOut className="mr-2 h-4 w-4" />
                    Log out
                  </DropdownMenuItem>
                </DropdownMenuContent>
              </DropdownMenu>
            ) : (
              <div className="flex items-center gap-2">
                <Link href="/login">
                  <Button variant="outline" size="sm">
                    Login
                  </Button>
                </Link>
                <Link href="/signup">
                  <Button size="sm" style={{ backgroundColor: 'hsl(var(--accent))', color: 'hsl(var(--accent-foreground))' }}>
                    Sign Up
                  </Button>
                </Link>
              </div>
            )}
          </nav>
        </div>
      </div>
    </header>
  );
}
