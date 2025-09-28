
"use client";

import React, { useState } from 'react';
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogDescription, DialogFooter, DialogTrigger } from '@/components/ui/dialog';
import { Button } from '@/components/ui/button';
import { Textarea } from '@/components/ui/textarea';
import { Star } from 'lucide-react';
import { Ride, User } from '@/lib/dummy-data';
import { cn } from '@/lib/utils';
import { Label } from './ui/label';

interface RideReviewDialogProps {
    ride: Ride;
    otherUser: User;
    onReviewPublished: (rideId: string, rating: number, review: string) => void;
}

export default function RideReviewDialog({ ride, otherUser, onReviewPublished }: RideReviewDialogProps) {
    const [isOpen, setIsOpen] = useState(false);
    const [rating, setRating] = useState(0);
    const [hoverRating, setHoverRating] = useState(0);
    const [review, setReview] = useState("");

    const handleSubmit = () => {
        if (rating > 0 && review) {
            onReviewPublished(ride.id, rating, review);
            setIsOpen(false);
            // Reset state for next time
            setRating(0);
            setReview("");
        } else {
            alert("Please provide a rating and a review.");
        }
    }

    return (
        <Dialog open={isOpen} onOpenChange={setIsOpen}>
            <DialogTrigger asChild>
                <Button variant="outline" size="sm" className="w-full mt-2">
                    <Star className="mr-2 h-4 w-4" /> Rate & Review
                </Button>
            </DialogTrigger>
            <DialogContent>
                <DialogHeader>
                    <DialogTitle>Rate your trip with {otherUser.name}</DialogTitle>
                    <DialogDescription>
                        Your feedback helps us improve the community.
                    </DialogDescription>
                </DialogHeader>
                <div className="py-4 space-y-4">
                    <div className="space-y-2">
                        <Label>Rating</Label>
                        <div 
                            className="flex items-center gap-1"
                             onMouseLeave={() => setHoverRating(0)}
                        >
                            {[...Array(5)].map((_, index) => {
                                const starValue = index + 1;
                                return (
                                    <Star
                                        key={starValue}
                                        className={cn(
                                            "h-8 w-8 cursor-pointer transition-colors",
                                            starValue <= (hoverRating || rating)
                                                ? "text-yellow-400 fill-yellow-400"
                                                : "text-gray-300"
                                        )}
                                        onClick={() => setRating(starValue)}
                                        onMouseEnter={() => setHoverRating(starValue)}
                                    />
                                );
                            })}
                        </div>
                    </div>
                    <div className="space-y-2">
                        <Label htmlFor='review-text'>Review</Label>
                        <Textarea 
                            id="review-text"
                            placeholder={`Tell us about your experience...`} 
                            value={review} 
                            onChange={(e) => setReview(e.target.value)}
                        />
                    </div>
                </div>
                <DialogFooter>
                    <Button variant="ghost" onClick={() => setIsOpen(false)}>Cancel</Button>
                    <Button onClick={handleSubmit}>Submit Review</Button>
                </DialogFooter>
            </DialogContent>
        </Dialog>
    );
}
