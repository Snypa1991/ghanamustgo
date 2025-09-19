"use client";

import { useAuth } from '@/context/app-context';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
import { Badge } from '@/components/ui/badge';
import { useRouter } from 'next/navigation';
import { useEffect } from 'react';
import { Button } from '@/components/ui/button';
import { Edit } from 'lucide-react';
import VehicleDetails from '@/components/vehicle-details';
import { Alert, AlertDescription, AlertTitle } from '@/components/ui/alert';

export default function ProfilePage() {
  const { user } = useAuth();
  const router = useRouter();

  useEffect(() => {
    if (!user) {
      router.push('/login');
    }
  }, [user, router]);

  if (!user) {
    return (
        <div className="flex items-center justify-center min-h-[calc(100vh-10rem)]">
            <p>Loading...</p>
        </div>
    );
  }

  const isPartner = user.role === 'rider' || user.role === 'driver';

  return (
    <div className="container py-12">
        <div className="max-w-2xl mx-auto space-y-8">
            <Card>
                <CardHeader className="text-center">
                    <Avatar className="w-24 h-24 mx-auto mb-4 border-4 border-primary">
                        <AvatarImage src={`https://picsum.photos/seed/${user.email}/200/200`} alt={user.name} />
                        <AvatarFallback className="text-4xl">{user.name.charAt(0)}</AvatarFallback>
                    </Avatar>
                <CardTitle className="text-3xl font-headline">{user.name}</CardTitle>
                <CardDescription className="flex items-center justify-center gap-2">
                    <span>{user.email}</span>
                    <Badge variant="secondary" className="capitalize">{user.role}</Badge>
                </CardDescription>
                </CardHeader>
                <CardContent className="text-center">
                    <p className="text-muted-foreground mb-6">
                        This is your profile page. More details and settings can be added here.
                    </p>
                    <Button>
                        <Edit className="mr-2 h-4 w-4" />
                        Edit Profile
                    </Button>
                </CardContent>
            </Card>

            {isPartner && (
                <VehicleDetails role={user.role} />
            )}

            {!isPartner && user.role === 'vendor' && (
                <Card>
                    <CardHeader>
                        <CardTitle className="font-headline">Vendor Information</CardTitle>
                        <CardDescription>Manage your store and product listings.</CardDescription>
                    </CardHeader>
                    <CardContent>
                       <Alert>
                            <AlertTitle>Coming Soon!</AlertTitle>
                            <AlertDescription>
                                The vendor dashboard for managing your virtual storefront is under construction.
                            </AlertDescription>
                       </Alert>
                    </CardContent>
                </Card>
            )}

        </div>
    </div>
  );
}
