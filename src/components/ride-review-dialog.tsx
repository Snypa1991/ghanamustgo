
"use client";

import { useState } from 'react';
import { Button } from '@/components/ui/button';
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
  DialogClose,
} from '@/components/ui/dialog';
import { Star } from 'lucide-react';
import { Textarea } from './ui/textarea';
import type { Ride, User } from '@/lib/dummy-data';

interface RideReviewDialogProps {
    ride: Ride;
    otherUser: User;
    onReviewSubmit: (rideId: string, rating: number, review: string) => void;
    children?: React.ReactNode;
}


export function RideReviewDialog({ ride, otherUser, onReviewSubmit, children }: RideReviewDialogProps) {
  const [rating, setRating] = useState(0);
  const [review, setReview] = useState('');
  const [isOpen, setIsOpen] = useState(false);

  const handleSubmit = () => {
    onReviewSubmit(ride.id, rating, review);
    setIsOpen(false); 
    setRating(0);
    setReview('');
  };

  return (
    <Dialog open={isOpen} onOpenChange={setIsOpen}>
      <DialogTrigger asChild>
        {children || <Button variant="outline" size="sm">Rate Ride</Button>}
      </DialogTrigger>
      <DialogContent>
        <DialogHeader>
          <DialogTitle>Rate your experience with {otherUser.name}</DialogTitle>
          <DialogDescription>
            How was your trip? Let us know by leaving a rating and a review.
          </DialogDescription>
        </DialogHeader>
        <div className="py-4 space-y-4">
          <div className="flex items-center justify-center space-x-1">
            {[1, 2, 3, 4, 5].map((star) => (
              <Star
                key={star}
                className={`h-8 w-8 cursor-pointer transition-colors ${rating >= star ? 'text-yellow-400 fill-yellow-400' : 'text-gray-300 hover:text-gray-400'}`}
                onClick={() => setRating(star)}
              />
            ))}
          </div>
          <Textarea
            placeholder="Write your review..."
            rows={4}
            value={review}
            onChange={(e) => setReview(e.target.value)}
          />
        </div>
        <DialogFooter>
            <DialogClose asChild>
                <Button variant="outline">Cancel</Button>
            </DialogClose>
            <Button onClick={handleSubmit} disabled={rating === 0}>Submit Review</Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
}
