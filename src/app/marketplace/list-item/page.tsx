import { Store, Tag } from 'lucide-react';
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';
import { Button } from '@/components/ui/button';
import { Alert, AlertDescription, AlertTitle } from '@/components/ui/alert';
import { Shield } from 'lucide-react';

export default function ListItemPage() {
  return (
    <div className="container py-12">
      <div className="text-center mb-12">
        <Store className="mx-auto h-12 w-12 text-primary" />
        <h1 className="mt-4 text-4xl font-bold font-headline">List a New Item</h1>
        <p className="mt-2 text-lg text-muted-foreground">Sell your goods to the community.</p>
      </div>

      <div className="max-w-2xl mx-auto">
        <Card>
            <CardHeader>
                <CardTitle className="font-headline">Item Details</CardTitle>
                <CardDescription>Fill out the form below to list your item. Listing fees may apply.</CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
                <div className="space-y-2">
                    <Label htmlFor="title">Item Title</Label>
                    <Input id="title" placeholder="e.g., Traditional Kente Cloth" />
                </div>
                 <div className="space-y-2">
                    <Label htmlFor="price">Your Asking Price (USD)</Label>
                    <Input id="price" type="number" placeholder="120" />
                </div>
                 <div className="space-y-2">
                    <Label htmlFor="description">Full Description</Label>
                    <Textarea id="description" placeholder="Describe your item in detail..." />
                </div>
                 <div className="space-y-2">
                    <Label htmlFor="photos">Upload Photos</Label>
                    <Input id="photos" type="file" multiple />
                </div>
            </CardContent>
             <CardFooter className="flex-col gap-4">
                 <Button className="w-full" style={{ backgroundColor: 'hsl(var(--accent))', color: 'hsl(var(--accent-foreground))' }}>
                     <Tag className="mr-2 h-4 w-4" />
                     List Item for Sale
                 </Button>
                 <Alert variant="default" className="w-full">
                    <Shield className="h-4 w-4" />
                    <AlertTitle className="font-bold">Did you know?</AlertTitle>
                    <AlertDescription>
                        Admins can use AI to suggest an optimal listing fee from the admin dashboard.
                    </AlertDescription>
                </Alert>
             </CardFooter>
        </Card>
      </div>
    </div>
  );
}
