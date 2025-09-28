
"use client";

import { useState } from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Label } from '@/components/ui/label';
import { Input } from '@/components/ui/input';
import { Button } from '@/components/ui/button';
import { Upload, Loader2, AlertCircle } from 'lucide-react';
import { MopedIcon } from './icons';
import { Car } from 'lucide-react';
import { Alert, AlertDescription, AlertTitle } from './ui/alert';
import { checkImage } from '@/app/actions';

interface VehicleDetailsProps {
    role: 'biker' | 'driver';
}

export default function VehicleDetails({ role }: VehicleDetailsProps) {
    const [imagePreview, setImagePreview] = useState<string | null>(null);
    const [isLoading, setIsLoading] = useState(false);
    const [blurResult, setBlurResult] = useState<{ isBlurry: boolean, reasoning: string } | null>(null);

    const handleFileChange = (event: React.ChangeEvent<HTMLInputElement>) => {
        const file = event.target.files?.[0];
        if (file) {
            const reader = new FileReader();
            reader.onloadend = async () => {
                const dataUri = reader.result as string;
                setImagePreview(dataUri);
                setBlurResult(null);
                setIsLoading(true);
                const result = await checkImage({ imageDataUri: dataUri });
                if (result.success && result.data) {
                    setBlurResult(result.data);
                }
                setIsLoading(false);
            };
            reader.readAsDataURL(file);
        }
    };


    return (
        <Card>
            <CardHeader>
                <CardTitle className="font-headline flex items-center gap-2">
                    {role === 'biker' ? <MopedIcon className="h-6 w-6"/> : <Car/>}
                    Vehicle Information
                </CardTitle>
                <CardDescription>
                    Your vehicle must be verified before you can start accepting rides or deliveries.
                </CardDescription>
            </CardHeader>
            <CardContent className="space-y-6">
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <div className="space-y-2">
                        <Label htmlFor="license-plate">License Plate Number</Label>
                        <Input id="license-plate" placeholder="GT 1234-24" />
                    </div>
                     <div className="space-y-2">
                        <Label htmlFor="vehicle-model">Vehicle Make & Model</Label>
                        <Input id="vehicle-model" placeholder={role === 'biker' ? "Honda CB125F" : "Toyota Vitz"} />
                    </div>
                </div>
                 <div className="space-y-2">
                    <Label htmlFor="vehicle-photo">Vehicle Photo</Label>
                    <Input id="vehicle-photo" type="file" accept="image/*" onChange={handleFileChange} />
                    <p className="text-xs text-muted-foreground">Upload a clear photo of your vehicle.</p>
                </div>

                {isLoading && (
                    <div className="flex items-center justify-center rounded-md border border-dashed p-4">
                        <Loader2 className="h-6 w-6 animate-spin text-primary" />
                        <p className="ml-3 text-muted-foreground">Analyzing image clarity...</p>
                    </div>
                )}
                
                {blurResult && blurResult.isBlurry && (
                    <Alert variant="destructive">
                        <AlertCircle className="h-4 w-4" />
                        <AlertTitle>Image Appears Blurry</AlertTitle>
                        <AlertDescription>
                            {blurResult.reasoning} Please upload a clearer image.
                        </AlertDescription>
                    </Alert>
                )}

                {blurResult && !blurResult.isBlurry && imagePreview && (
                    <div>
                        <Label>Image Preview</Label>
                        <div className="mt-2 relative">
                             <img src={imagePreview} alt="Vehicle Preview" className="rounded-md object-cover w-full max-h-64" />
                             <div className="absolute top-2 right-2 bg-green-500 text-white text-xs font-bold px-2 py-1 rounded-full">
                                Looks Clear
                             </div>
                        </div>
                    </div>
                )}
                
                <Button className="w-full" disabled={isLoading || (blurResult?.isBlurry ?? false)}>
                    <Upload className="mr-2 h-4 w-4" />
                    Submit for Verification
                </Button>
            </CardContent>
        </Card>
    );
}
