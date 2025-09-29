
"use client"

import Link from 'next/link';
import { useState } from 'react';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { GhanaMustGoIcon } from '@/components/icons';
import { User, Store, Car, Upload, CheckCircle, Loader2, AlertCircle } from 'lucide-react';
import { RadioGroup, RadioGroupItem } from '@/components/ui/radio-group';
import { cn } from '@/lib/utils';
import { Alert, AlertDescription, AlertTitle } from '@/components/ui/alert';
import { checkImage } from '@/app/actions';

type Role = 'user' | 'partner' | 'vendor';

const roles = [
    {
        name: 'user' as Role,
        title: 'User',
        description: 'Book rides, order food, and shop.',
        icon: User,
    },
    {
        name: 'partner' as Role,
        title: 'Biker or Driver',
        description: 'Offer rides and delivery services.',
        icon: Car,
    },
    {
        name: 'vendor' as Role,
        title: 'Vendor',
        description: 'Sell food or items on the marketplace.',
        icon: Store,
    }
]

export default function SignupPage() {
  const [step, setStep] = useState(1);
  const [selectedRole, setSelectedRole] = useState<Role>('user');
  const [isCheckingImage, setIsCheckingImage] = useState(false);
  const [blurResult, setBlurResult] = useState<{ isBlurry: boolean, reasoning: string } | null>(null);

  const selectedRoleInfo = roles.find(r => r.name === selectedRole);

  const handleAccountCreation = () => {
    // In a real app, you would handle form submission, validation,
    // and user creation via an API call here.
    setStep(3);
  }

  const handleVerification = () => {
    // In a real app, you would handle document submission here.
    setStep(4);
  }

  const handleFileChange = async (event: React.ChangeEvent<HTMLInputElement>) => {
        const file = event.target.files?.[0];
        if (file) {
            const reader = new FileReader();
            reader.onloadend = async () => {
                const dataUri = reader.result as string;
                setBlurResult(null);
                setIsCheckingImage(true);
                const result = await checkImage({ imageDataUri: dataUri });
                if (result.success && result.data) {
                    setBlurResult(result.data);
                } else {
                    setBlurResult({isBlurry: false, reasoning: "Could not check image quality."})
                }
                setIsCheckingImage(false);
            };
            reader.readAsDataURL(file);
        }
    };


  return (
    <div className="flex items-center justify-center min-h-screen sm:min-h-[calc(100vh-10rem)] py-12 px-4">
      <Card className="w-full max-w-md">
        {step === 1 && (
            <>
                <CardHeader className="text-center">
                    <GhanaMustGoIcon className="mx-auto h-10 w-10 text-primary" />
                    <CardTitle className="mt-4 font-headline text-2xl">Join the Community</CardTitle>
                    <CardDescription>How would you like to use our service?</CardDescription>
                </CardHeader>
                <CardContent>
                    <RadioGroup 
                        defaultValue="user" 
                        className="grid gap-4"
                        onValueChange={(value: Role) => setSelectedRole(value)}
                    >
                       {roles.map((role) => (
                         <Label 
                            key={role.name}
                            htmlFor={role.name}
                            className={cn(
                                "flex items-start space-x-4 rounded-md border p-4 transition-all hover:bg-accent/50",
                                selectedRole === role.name && "border-primary bg-accent/50"
                            )}
                         >
                            <RadioGroupItem value={role.name} id={role.name} className="mt-1"/>
                            <div className="flex flex-col">
                                <span className="font-semibold text-base flex items-center gap-2">
                                    <role.icon className="h-5 w-5 text-primary" />
                                    {role.title}
                                </span>
                                <span className="text-sm text-muted-foreground">{role.description}</span>
                            </div>
                         </Label>
                       ))}
                    </RadioGroup>
                </CardContent>
                <CardFooter className="flex-col gap-4">
                     <Button className="w-full" style={{ backgroundColor: 'hsl(var(--accent))', color: 'hsl(var(--accent-foreground))' }} onClick={() => setStep(2)}>
                        Continue
                    </Button>
                    <div className="text-center text-sm">
                        Already have an account?{' '}
                        <Link href="/login" className="underline text-primary hover:text-primary/80">
                        Sign in
                        </Link>
                    </div>
                </CardFooter>
            </>
        )}

        {step === 2 && (
             <>
                <CardHeader className="text-center">
                    <GhanaMustGoIcon className="mx-auto h-10 w-10 text-primary" />
                    <CardTitle className="mt-4 font-headline text-2xl">Create Your Account</CardTitle>
                    <CardDescription>
                        You are signing up for a <span className="font-bold text-primary">{selectedRoleInfo?.title}</span> account.
                    </CardDescription>
                </CardHeader>
                <CardContent className="grid gap-4">
                    <div className="grid gap-2">
                        <Label htmlFor="name">Full Name</Label>
                        <Input id="name" placeholder="Ama Busia" required />
                    </div>
                    <div className="grid gap-2">
                        <Label htmlFor="email">Email</Label>
                        <Input id="email" type="email" placeholder="okada@example.com" required />
                    </div>
                    <div className="grid gap-2">
                        <Label htmlFor="password">Password</Label>
                        <Input id="password" type="password" required />
                    </div>
                </CardContent>
                <CardFooter className="flex-col gap-4">
                    <Button className="w-full" style={{ backgroundColor: 'hsl(var(--accent))', color: 'hsl(var(--accent-foreground))' }} onClick={handleAccountCreation}>Create Account</Button>
                    <Button variant="link" onClick={() => setStep(1)}>Back to role selection</Button>
                </CardFooter>
            </>
        )}
        
        {step === 3 && (
            <>
                <CardHeader className="text-center">
                    <GhanaMustGoIcon className="mx-auto h-10 w-10 text-primary" />
                    <CardTitle className="mt-4 font-headline text-2xl">Account Verification</CardTitle>
                    <CardDescription>
                        For security, we require all users to verify their identity.
                    </CardDescription>
                </CardHeader>
                <CardContent className="grid gap-6">
                    <div className="space-y-4">
                        <div className="space-y-2">
                            <Label htmlFor="ghana-card">Ghana Card Number</Label>
                            <Input id="ghana-card" placeholder="GHA-123456789-0" required />
                        </div>
                         <div className="space-y-2">
                            <Label htmlFor="ghana-card-upload">Upload Ghana Card</Label>
                            <Input id="ghana-card-upload" type="file" required onChange={handleFileChange}/>
                            <p className="text-xs text-muted-foreground">The image will be checked for clarity.</p>
                        </div>
                        {isCheckingImage && (
                            <div className="flex items-center text-sm text-muted-foreground">
                                <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                                Checking image quality...
                            </div>
                        )}
                        {blurResult && (
                             <Alert variant={blurResult.isBlurry ? "destructive" : "default"} className={!blurResult.isBlurry ? "bg-green-50" : ""}>
                                <AlertCircle className="h-4 w-4" />
                                <AlertTitle>{blurResult.isBlurry ? "Image Appears Blurry" : "Image Looks Clear"}</AlertTitle>
                                <AlertDescription>
                                    {blurResult.reasoning}
                                    {blurResult.isBlurry && " Please upload a clearer image."}
                                </AlertDescription>
                            </Alert>
                        )}
                    </div>

                    {selectedRole === 'partner' && (
                       <div className="space-y-4 pt-4 border-t">
                            <div className="space-y-2">
                                <Label htmlFor="license">Driver's License Number</Label>
                                <Input id="license" placeholder="AA-1234-5678" required />
                            </div>
                            <div className="space-y-2">
                                <Label htmlFor="license-upload">Upload Driver's License</Label>
                                <Input id="license-upload" type="file" required />
                            </div>
                       </div>
                    )}
                </CardContent>
                <CardFooter className="flex-col gap-4">
                    <Button className="w-full" style={{ backgroundColor: 'hsl(var(--accent))', color: 'hsl(var(--accent-foreground))' }} onClick={handleVerification} disabled={isCheckingImage || (blurResult?.isBlurry ?? false)}>
                        <Upload className="mr-2 h-4 w-4" />
                        Submit for Verification
                    </Button>
                     <Button variant="link" onClick={() => setStep(2)}>Back</Button>
                </CardFooter>
            </>
        )}

        {step === 4 && (
            <>
                <CardHeader className="text-center">
                    <CheckCircle className="mx-auto h-12 w-12 text-green-500" />
                    <CardTitle className="mt-4 font-headline text-2xl">Verification Submitted</CardTitle>
                </CardHeader>
                <CardContent>
                    <Alert>
                        <AlertTitle className="font-headline">What's Next?</AlertTitle>
                        <AlertDescription>
                           <p>Your documents have been submitted for review. This process usually takes 24-48 hours.</p>
                           <p className="mt-2">You will receive an email notification once your account is approved. You can then log in to your account.</p>
                        </AlertDescription>
                    </Alert>
                </CardContent>
                <CardFooter>
                    <Link href="/login" className="w-full">
                        <Button className="w-full" variant="outline">
                            Back to Login
                        </Button>
                    </Link>
                </CardFooter>
            </>
        )}

      </Card>
    </div>
  );
}
