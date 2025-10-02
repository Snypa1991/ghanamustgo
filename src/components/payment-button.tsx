
"use client";
import { usePaystackPayment } from 'react-paystack';
import { Button } from './ui/button';
import { useAuth } from '@/context/app-context';
import { useToast } from '@/hooks/use-toast';

interface PaymentButtonProps {
    amount: number; // in GH₵
}

const PaymentButton = ({ amount }: PaymentButtonProps) => {
    const { user } = useAuth();
    const { toast } = useToast();

    const config = {
        reference: (new Date()).getTime().toString(),
        email: user?.email || '',
        amount: Math.round(amount * 100), // Amount in pesewas
        publicKey: process.env.NEXT_PUBLIC_PAYSTACK_PUBLIC_KEY || '',
    };

    const initializePayment = usePaystackPayment(config);

    const onSuccess = (reference: any) => {
        // In a real app, you would verify the transaction on your backend
        console.log('Payment successful:', reference);
        toast({
            title: "Payment Successful!",
            description: `Your payment of GHS ${amount.toFixed(2)} was successful.`
        });
    };

    const onClose = () => {
        toast({
            variant: "default",
            title: "Payment window closed",
            description: "You can try to pay again anytime.",
        });
    };

    return (
        <Button 
            onClick={() => {
                if (!user) {
                    toast({
                        variant: "destructive",
                        title: "Not Logged In",
                        description: "Please log in to make a payment.",
                    });
                    return;
                }
                if (!config.publicKey) {
                    toast({
                        variant: "destructive",
                        title: "Configuration Error",
                        description: "Paystack is not configured correctly. Missing public key.",
                    });
                    console.error("Paystack public key is not set in environment variables.");
                    return;
                }
                initializePayment({onSuccess, onClose});
            }}
            className="w-full font-bold"
        >
            Pay with Paystack
        </Button>
    );
};

export default PaymentButton;
