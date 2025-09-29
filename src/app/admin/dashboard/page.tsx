
"use client";

import { useAuth } from '@/context/app-context';
import { Shield, Bot, Package, Star, Loader2 } from 'lucide-react';
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import ListingFeeSuggestion from '@/components/listing-fee-suggestion';
import AdminRouteOptimization from '@/components/admin-route-optimization';
import ReviewSummarizer from '@/components/review-summarizer';
import { useRouter } from 'next/navigation';
import { useEffect } from 'react';

export default function AdminDashboardPage() {
  const { user, loading } = useAuth();
  const router = useRouter();

  useEffect(() => {
    if (!loading && (!user || user.role !== 'admin')) {
      router.push('/login');
    }
  }, [user, loading, router]);

  if (loading || !user || user.role !== 'admin') {
    return (
      <div className="flex items-center justify-center min-h-[calc(100vh-10rem)]">
        <Loader2 className="h-8 w-8 animate-spin text-primary" />
      </div>
    );
  }

  return (
    <div className="container py-12">
      <div className="text-left mb-12">
        <Shield className="h-12 w-12 text-primary" />
        <h1 className="mt-4 text-4xl font-bold font-headline">Admin Dashboard</h1>
        <p className="mt-2 text-lg text-muted-foreground">Smart Tools & Platform Management</p>
      </div>

      <Tabs defaultValue="route-optimization" className="w-full" orientation="vertical">
        <TabsList className="grid w-full grid-cols-1 h-auto md:grid-cols-3 md:h-10 mb-6 md:mb-0">
          <TabsTrigger value="route-optimization">
            <Bot className="mr-2 h-4 w-4" />
            Route Optimizer
          </TabsTrigger>
          <TabsTrigger value="fee-suggestion">
             <Package className="mr-2 h-4 w-4" />
            Fee Suggester
          </TabsTrigger>
          <TabsTrigger value="review-summarizer">
            <Star className="mr-2 h-4 w-4" />
            Review Summarizer
          </TabsTrigger>
        </TabsList>
        <TabsContent value="route-optimization">
            <div className="md:mt-6">
                <AdminRouteOptimization />
            </div>
        </TabsContent>
        <TabsContent value="fee-suggestion">
             <div className="md:mt-6">
                <ListingFeeSuggestion />
            </div>
        </TabsContent>
        <TabsContent value="review-summarizer">
             <div className="md:mt-6">
                <ReviewSummarizer />
            </div>
        </TabsContent>
      </Tabs>
    </div>
  );
}
