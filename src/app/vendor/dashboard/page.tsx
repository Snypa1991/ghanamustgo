
"use client";

import { useAuth } from '@/context/app-context';
import { Store, Package, LineChart, Tag, Loader2 } from 'lucide-react';
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import Link from 'next/link';
import { useRouter } from 'next/navigation';
import { useEffect } from 'react';

export default function VendorDashboardPage() {
  const { user, loading } = useAuth();
  const router = useRouter();

  useEffect(() => {
    if (!loading && (!user || user.role !== 'vendor')) {
      router.push('/login');
    }
  }, [user, loading, router]);


  if (loading || !user || user.role !== 'vendor') {
    return (
      <div className="flex items-center justify-center min-h-[calc(100vh-10rem)]">
        <Loader2 className="h-8 w-8 animate-spin text-primary" />
      </div>
    );
  }

  return (
    <div className="container py-12">
      <div className="text-left mb-12">
        <Store className="h-12 w-12 text-primary" />
        <h1 className="mt-4 text-4xl font-bold font-headline">Vendor Dashboard</h1>
        <p className="mt-2 text-lg text-muted-foreground">Manage your products, orders, and sales.</p>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        <Card className="md:col-span-2">
          <CardHeader>
            <CardTitle>Welcome, {user.name}!</CardTitle>
            <CardDescription>Here's a quick overview of your store. More features coming soon!</CardDescription>
          </CardHeader>
          <CardContent className="space-y-4">
             <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <Card>
                    <CardHeader className="flex flex-row items-center justify-between pb-2">
                        <CardTitle className="text-sm font-medium">Total Products</CardTitle>
                        <Package className="h-4 w-4 text-muted-foreground" />
                    </CardHeader>
                    <CardContent>
                        <div className="text-2xl font-bold">4</div>
                        <p className="text-xs text-muted-foreground">items listed for sale</p>
                    </CardContent>
                </Card>
                 <Card>
                    <CardHeader className="flex flex-row items-center justify-between pb-2">
                        <CardTitle className="text-sm font-medium">Total Sales</CardTitle>
                        <LineChart className="h-4 w-4 text-muted-foreground" />
                    </CardHeader>
                    <CardContent>
                        <div className="text-2xl font-bold">$215.00</div>
                        <p className="text-xs text-muted-foreground">from 2 successful bids</p>
                    </CardContent>
                </Card>
            </div>
          </CardContent>
        </Card>

        <Card>
            <CardHeader>
                <CardTitle>Quick Actions</CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
                <Link href="/marketplace/list-item" className="w-full">
                    <Button className="w-full" style={{ backgroundColor: 'hsl(var(--accent))', color: 'hsl(var(--accent-foreground))' }}>
                        <Tag className="mr-2 h-4 w-4" /> List a New Item
                    </Button>
                </Link>
                 <Link href="/marketplace" className="w-full">
                    <Button variant="outline" className="w-full">
                        <Package className="mr-2 h-4 w-4" /> Manage My Listings
                    </Button>
                </Link>
            </CardContent>
        </Card>
      </div>
    </div>
  );
}
