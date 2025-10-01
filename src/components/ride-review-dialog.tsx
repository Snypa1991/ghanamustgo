import { useState } from 'react';
import { Button } from '@/components/ui/button';
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from '@/components/ui/dialog';
import { Star } from 'lucide-react';

export function RideReviewDialog({ ride, onReviewSubmit }) {
  const [rating, setRating] = useState(0);
  const [review, setReview] = useState('');

  const handleSubmit = () => {
    onReviewSubmit(ride.id, rating, review);
  };

  return (
    <Dialog>
      <DialogTrigger asChild>
        <Button variant="outline" size="sm">Rate Ride</Button>
      </DialogTrigger>
      <DialogContent>
        <DialogHeader>
          <DialogTitle>Rate your ride with {ride.driver.name}</DialogTitle>
          <DialogDescription>
            How was your ride experience? Let us know by leaving a rating and a review.
          </DialogDescription>
        </DialogHeader>
        <div className="py-4 space-y-4">
          <div className="flex items-center justify-center space-x-1">
            {[1, 2, 3, 4, 5].map((star) => (
              <Star
                key={star}
                className={`h-8 w-8 cursor-pointer ${rating >= star ? 'text-yellow-400 fill-yellow-400' : 'text-gray-300'}`}
                onClick={() => setRating(star)}
              />
            ))}
          </div>
          <textarea
            className="w-full p-2 border rounded-md"
            placeholder="Write your review..."
            rows={4}
            value={review}
            onChange={(e) => setReview(e.target.value)}
          ></textarea>
        </div>
        <div className="flex justify-end">
          <Button onClick={handleSubmit}>Submit Review</Button>
        </div>
      </DialogContent>
    </Dialog>
  );
}
