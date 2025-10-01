
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
    <div className="container py-8 md:py-12">
      <div className="text-left mb-8 md:mb-12">
        <Shield className="h-12 w-12 text-primary" />
        <h1 className="mt-4 text-4xl font-bold font-headline">Admin Dashboard</h1>
        <p className="mt-2 text-lg text-muted-foreground">Smart Tools & Platform Management</p>
      </div>

      <Tabs defaultValue="route-optimization" className="w-full" orientation="vertical">
        <TabsList className="w-full md:w-auto md:grid md:grid-cols-1 md:h-auto mb-6">
          <TabsTrigger value="route-optimization" className="w-full justify-start">
            <Bot className="mr-2 h-4 w-4" />
            Route Optimizer
          </TabsTrigger>
          <TabsTrigger value="fee-suggestion" className="w-full justify-start">
             <Package className="mr-2 h-4 w-4" />
            Fee Suggester
          </TabsTrigger>
          <TabsTrigger value="review-summarizer" className="w-full justify-start">
            <Star className="mr-2 h-4 w-4" />
            Review Summarizer
          </TabsTrigger>
        </TabsList>
        <TabsContent value="route-optimization" className="mt-0">
            <AdminRouteOptimization />
        </TabsContent>
        <TabsContent value="fee-suggestion" className="mt-0">
            <ListingFeeSuggestion />
        </TabsContent>
        <TabsContent value="review-summarizer" className="mt-0">
            <ReviewSummarizer />
        </TabsContent>
      </Tabs>
    </div>
  );
}
