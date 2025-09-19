import Link from 'next/link';
import { Package, UtensilsCrossed, Store, UserCircle, Menu } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Sheet, SheetContent, SheetTrigger } from '@/components/ui/sheet';
import { Separator } from '@/components/ui/separator';
import { MopedIcon } from '@/components/icons';

const navItems = [
  { href: '/book-ride', icon: MopedIcon, label: 'Rides' },
  { href: '/dispatch-package', icon: Package, label: 'Dispatch' },
  { href: '/restaurants', icon: UtensilsCrossed, label: 'Food' },
  { href: '/marketplace', icon: Store, label: 'Market' },
];

export default function Header() {
  return (
    <header className="sticky top-0 z-50 w-full border-b bg-background/95 backdrop-blur supports-[backdrop-filter]:bg-background/60">
      <div className="container flex h-16 items-center">
        <div className="mr-4 hidden md:flex">
          <Link href="/" className="mr-6 flex items-center space-x-2">
            <MopedIcon className="h-6 w-6 text-primary" />
            <span className="hidden font-bold sm:inline-block font-headline">Ghana Must Go</span>
          </Link>
          <nav className="flex items-center space-x-6 text-sm font-medium">
            {navItems.map((item) => (
              <Link key={item.label} href={item.href} className="transition-colors hover:text-primary">
                {item.label}
              </Link>
            ))}
          </nav>
        </div>

        {/* Mobile Nav */}
        <div className="md:hidden">
          <Sheet>
            <SheetTrigger asChild>
              <Button variant="ghost" size="icon">
                <Menu className="h-6 w-6" />
                <span className="sr-only">Toggle Menu</span>
              </Button>
            </SheetTrigger>
            <SheetContent side="left">
              <div className="flex flex-col h-full">
                <div className="p-4 border-b">
                  <Link href="/" className="flex items-center space-x-2">
                    <MopedIcon className="h-6 w-6 text-primary" />
                    <span className="font-bold font-headline">Ghana Must Go</span>
                  </Link>
                </div>
                <nav className="flex-grow p-4">
                  <ul className="space-y-4">
                    {navItems.map((item) => (
                      <li key={item.label}>
                        <Link href={item.href} className="flex items-center space-x-3 text-lg font-medium text-foreground/80 hover:text-primary">
                          <item.icon className="h-5 w-5" />
                          <span>{item.label}</span>
                        </Link>
                      </li>
                    ))}
                  </ul>
                </nav>
                <div className="p-4 mt-auto border-t">
                  <Link href="/login">
                    <Button className="w-full justify-start" variant="ghost">
                      <UserCircle className="mr-2 h-5 w-5" /> Login / Sign Up
                    </Button>
                  </Link>
                </div>
              </div>
            </SheetContent>
          </Sheet>
        </div>
        
        <div className="flex flex-1 items-center justify-center md:justify-end">
          <div className="md:hidden">
            <Link href="/" className="flex items-center space-x-2">
              <MopedIcon className="h-6 w-6 text-primary" />
              <span className="font-bold font-headline">Ghana Must Go</span>
            </Link>
          </div>
          <nav className="hidden md:flex items-center space-x-2">
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
          </nav>
        </div>
      </div>
    </header>
  );
}
