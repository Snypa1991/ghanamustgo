
"use client";

import { useState, useEffect } from 'react';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { z } from 'zod';
import { Card, CardContent, CardHeader, CardTitle, CardFooter, CardDescription } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Form, FormControl, FormField, FormItem, FormLabel, FormMessage } from '@/components/ui/form';
import { Gavel, Loader2, Trophy } from 'lucide-react';
import { useAuth } from '@/context/app-context';
import { DUMMY_USERS, DUMMY_BIDS, Bid, User } from '@/lib/dummy-data';
import { Avatar, AvatarFallback, AvatarImage } from './ui/avatar';
import { formatDistanceToNow } from 'date-fns';
import PaymentButton from './payment-button';
import { ScrollArea } from './ui/scroll-area';

interface BiddingCardProps {
    itemId: string;
    startingPrice: number;
}

const bidSchema = z.object({
    amount: z.coerce.number().min(1, 'Bid amount is required'),
});

type BidFormValues = z.infer<typeof bidSchema>;

export default function BiddingCard({ itemId, startingPrice }: BiddingCardProps) {
    const { user } = useAuth();
    const [bids, setBids] = useState<Bid[]>(() => DUMMY_BIDS.filter(b => b.itemId === itemId).sort((a, b) => b.amount - a.amount));
    const [isLoading, setIsLoading] = useState(false);

    const highestBid = bids.length > 0 ? bids[0].amount : startingPrice;
    const highestBidderId = bids.length > 0 ? bids[0].userId : null;
    
    const userIsHighestBidder = user && highestBidderId === user.id;

    const form = useForm<BidFormValues>({
        resolver: zodResolver(bidSchema),
        defaultValues: {
            amount: Math.floor(highestBid + 1),
        },
    });

     useEffect(() => {
        const newHighestBid = bids.length > 0 ? bids[0].amount : startingPrice;
        form.reset({ amount: Math.floor(newHighestBid + 1) });
    }, [bids, startingPrice, form]);


    function onSubmit(values: BidFormValues) {
        if (!user) {
            alert("Please log in to place a bid.");
            return;
        }
        if (values.amount <= highestBid) {
            form.setError("amount", {
                type: "manual",
                message: `Your bid must be higher than the current highest bid ($${highestBid.toFixed(2)})`,
            });
            return;
        }

        setIsLoading(true);
        // Simulate network delay
        setTimeout(() => {
            const newBid: Bid = {
                id: `bid-${Date.now()}`,
                itemId: itemId,
                userId: user.id,
                amount: values.amount,
                timestamp: new Date().toISOString(),
            };
            setBids(prevBids => [newBid, ...prevBids].sort((a, b) => b.amount - a.amount));
            setIsLoading(false);
        }, 1000);
    }

    const getBidder = (userId: string): User | undefined => {
        return DUMMY_USERS.find(u => u.id === userId);
    }

    return (
        <Card className="sticky top-24">
            <CardHeader>
                <CardTitle className="font-headline">Bidding</CardTitle>
                <CardDescription>Place your bid for this item.</CardDescription>
            </CardHeader>
            <CardContent className="space-y-6">
                <div className="text-center">
                    <p className="text-sm text-muted-foreground">Current Highest Bid</p>
                    <p className="text-4xl font-bold text-primary">${highestBid.toFixed(2)}</p>
                </div>
                
                 {userIsHighestBidder && (
                    <div className="p-4 rounded-lg bg-green-50 text-green-800 border border-green-200 text-center">
                        <Trophy className="mx-auto h-8 w-8 mb-2"/>
                        <h3 className="font-bold">You are the highest bidder!</h3>
                        <p className="text-sm">You can now proceed to payment.</p>
                         <div className="mt-4">
                            <PaymentButton amount={highestBid} />
                        </div>
                    </div>
                )}

                {!userIsHighestBidder && (
                    <Form {...form}>
                        <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-4">
                            <FormField
                                control={form.control}
                                name="amount"
                                render={({ field }) => (
                                    <FormItem>
                                        <FormLabel>Your Bid Amount (USD)</FormLabel>
                                        <FormControl>
                                            <div className="relative">
                                                <div className="pointer-events-none absolute inset-y-0 left-0 flex items-center pl-3">
                                                    <span className="text-muted-foreground sm:text-sm">$</span>
                                                </div>
                                                <Input type="number" step="0.01" className="pl-7" {...field} />
                                            </div>
                                        </FormControl>
                                        <FormMessage />
                                    </FormItem>
                                )}
                            />
                            <Button type="submit" className="w-full" disabled={isLoading || !user}>
                                {isLoading ? <Loader2 className="mr-2 h-4 w-4 animate-spin" /> : <Gavel className="mr-2 h-4 w-4" />}
                                {user ? 'Place Bid' : 'Log in to Bid'}
                            </Button>
                        </form>
                    </Form>
                )}

                <div className="space-y-4">
                    <h4 className="font-semibold">Recent Bids</h4>
                    <ScrollArea className="h-48">
                      <ul className="space-y-3 pr-4">
                          {bids.map(bid => {
                              const bidder = getBidder(bid.userId);
                              return (
                                  <li key={bid.id} className="flex items-center justify-between">
                                      <div className="flex items-center gap-2">
                                          <Avatar className="h-8 w-8">
                                              <AvatarImage src={`https://picsum.photos/seed/${bidder?.email}/100/100`} />
                                              <AvatarFallback>{bidder?.name.charAt(0)}</AvatarFallback>
                                          </Avatar>
                                          <div>
                                              <p className="text-sm font-medium truncate">{bidder?.name} {bid.userId === user?.id && '(You)'}</p>
                                              <p className="text-xs text-muted-foreground">{formatDistanceToNow(new Date(bid.timestamp), { addSuffix: true })}</p>
                                          </div>
                                      </div>
                                      <p className="font-bold text-sm">${bid.amount.toFixed(2)}</p>
                                  </li>
                              )
                          })}
                           <li className="text-center text-sm text-muted-foreground pt-2">Starting Price: ${startingPrice.toFixed(2)}</li>
                      </ul>
                    </ScrollArea>
                </div>
            </CardContent>
        </Card>
    );
}
