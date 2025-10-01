
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
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { z } from 'zod';
import { Form, FormControl, FormField, FormItem, FormLabel, FormMessage } from '@/components/ui/form';
import { createUserWithEmailAndPassword, updateProfile } from 'firebase/auth';
import { auth } from '@/lib/firebase';
import { useToast } from '@/hooks/use-toast';
import { useRouter } from 'next/navigation';


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

const formSchema = z.object({
  name: z.string().min(1, 'Full name is required.'),
  email: z.string().email('Invalid email address.'),
  password: z.string().min(6, 'Password must be at least 6 characters.'),
});

type SignupFormValues = z.infer<typeof formSchema>;

export default function SignupPage() {
  const [step, setStep] = useState(1);
  const [selectedRole, setSelectedRole] = useState<Role>('user');
  const [isCheckingImage, setIsCheckingImage] = useState(false);
  const [blurResult, setBlurResult] = useState<{ isBlurry: boolean, reasoning: string } | null>(null);
  const [isSubmitting, setIsSubmitting] = useState(false);

  const { toast } = useToast();
  const router = useRouter();
  
  const selectedRoleInfo = roles.find(r => r.name === selectedRole);

  const form = useForm<SignupFormValues>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      name: '',
      email: '',
      password: '',
    },
  });

  const handleAccountCreation = async (values: SignupFormValues) => {
    setIsSubmitting(true);
    try {
      const userCredential = await createUserWithEmailAndPassword(auth, values.email, values.password);
      await updateProfile(userCredential.user, { displayName: values.name });

      // The role will be set to 'unassigned' by the AppContext
      // The user will be redirected to the role selection page on first login.
      toast({
        title: 'Account Created',
        description: 'Please complete the verification step.',
      });

      // For this prototype, we'll decide where to go based on role.
      // A real app would likely always go to verification.
      if (selectedRole === 'user') {
          setStep(4); // Skip verification for simple users
      } else {
          setStep(3); // Go to verification for partners/vendors
      }


    } catch (error: any) {
      toast({
        variant: 'destructive',
        title: 'Signup Failed',
        description: error.message || 'Could not create account.',
      });
    } finally {
      setIsSubmitting(false);
    }
  }

  const handleVerification = () => {
    // In a real app, you would handle document submission here
    // and trigger a backend process.
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
                     <Button className="w-full" onClick={() => setStep(2)}>
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
             <Form {...form}>
                <form onSubmit={form.handleSubmit(handleAccountCreation)}>
                    <CardHeader className="text-center">
                        <GhanaMustGoIcon className="mx-auto h-10 w-10 text-primary" />
                        <CardTitle className="mt-4 font-headline text-2xl">Create Your Account</CardTitle>
                        <CardDescription>
                            You are signing up as a <span className="font-bold text-primary">{selectedRoleInfo?.title}</span>.
                        </CardDescription>
                    </CardHeader>
                    <CardContent className="grid gap-4">
                        <FormField
                            control={form.control}
                            name="name"
                            render={({ field }) => (
                            <FormItem>
                                <FormLabel>Full Name</FormLabel>
                                <FormControl><Input placeholder="Ama Busia" {...field} /></FormControl>
                                <FormMessage />
                            </FormItem>
                            )}
                        />
                        <FormField
                            control={form.control}
                            name="email"
                            render={({ field }) => (
                            <FormItem>
                                <FormLabel>Email</FormLabel>
                                <FormControl><Input placeholder="okada@example.com" {...field} /></FormControl>
                                <FormMessage />
                            </FormItem>
                            )}
                        />
                         <FormField
                            control={form.control}
                            name="password"
                            render={({ field }) => (
                            <FormItem>
                                <FormLabel>Password</FormLabel>
                                <FormControl><Input type="password" {...field} /></FormControl>
                                <FormMessage />
                            </FormItem>
                            )}
                        />
                    </CardContent>
                    <CardFooter className="flex-col gap-4">
                        <Button type="submit" className="w-full" disabled={isSubmitting}>
                            {isSubmitting && <Loader2 className="mr-2 h-4 w-4 animate-spin" />}
                            Create Account
                        </Button>
                        <Button variant="link" onClick={() => setStep(1)}>Back to role selection</Button>
                    </CardFooter>
                </form>
             </Form>
        )}
        
        {step === 3 && (
            <>
                <CardHeader className="text-center">
                    <GhanaMustGoIcon className="mx-auto h-10 w-10 text-primary" />
                    <CardTitle className="mt-4 font-headline text-2xl">Partner Verification</CardTitle>
                    <CardDescription>
                        To ensure safety, partners must provide additional verification.
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
                    <Button className="w-full" onClick={handleVerification} disabled={isCheckingImage || (blurResult?.isBlurry ?? false)}>
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
                    <CardTitle className="mt-4 font-headline text-2xl">Account Created!</CardTitle>
                </CardHeader>
                <CardContent>
                    <Alert>
                        <AlertTitle className="font-headline">What's Next?</AlertTitle>
                        <AlertDescription>
                           <p>Your account is ready!</p>
                           {selectedRole !== 'user' && (
                               <p className="mt-2">Your verification documents have been submitted for review. This process usually takes 24-48 hours. You will receive an email notification once your account is approved.</p>
                           )}
                           <p className="mt-2">You can now proceed to login.</p>
                        </AlertDescription>
                    </Alert>
                </CardContent>
                <CardFooter>
                    <Link href="/login" className="w-full">
                        <Button className="w-full" variant="outline">
                            Proceed to Login
                        </Button>
                    </Link>
                </CardFooter>
            </>
        )}

      </Card>
    </div>
  );
}
