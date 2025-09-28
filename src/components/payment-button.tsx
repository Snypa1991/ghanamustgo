
"use client";
import { usePaystackPayment } from 'react-paystack';
import { Button } from './ui/button';
import { useAuth } from '@/context/app-context';

interface PaymentButtonProps {
    amount: number; // in the smallest currency unit (e.g., kobo, pesewas, cents)
}

const PaymentButton = ({ amount }: PaymentButtonProps) => {
    const { user } = useAuth();

    const config = {
        reference: (new Date()).getTime().toString(),
        email: user?.email || '',
        amount: amount * 100, // Amount in pesewas
        publicKey: process.env.NEXT_PUBLIC_PAYSTACK_PUBLIC_KEY || '',
    };

    const initializePayment = usePaystackPayment(config);

    const onSuccess = (reference: any) => {
        // In a real app, you would verify the transaction on your backend
        console.log('Payment successful:', reference);
        alert('Payment Successful! Thank you for your purchase.');
    };

    const onClose = () => {
        console.log('Payment modal closed');
    };

    return (
        <Button 
            onClick={() => {
                if (!user) {
                    alert('Please log in to make a payment.');
                    return;
                }
                initializePayment({onSuccess, onClose});
            }}
            className="w-full font-bold"
            style={{ backgroundColor: 'hsl(var(--accent))', color: 'hsl(var(--accent-foreground))' }}
        >
            Pay with Paystack
        </Button>
    );
};

export default PaymentButton;
