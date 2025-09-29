
"use client";

import { useState } from 'react';
import Image from 'next/image';
import { UtensilsCrossed, Star, Clock, ShoppingCart, PlusCircle, MinusCircle, X, CheckCircle } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '@/components/ui/card';
import { RESTAURANTS, Restaurant, MenuItem } from '@/lib/restaurant-data';
import { PlaceHolderImages } from '@/lib/placeholder-images';
import { Sheet, SheetContent, SheetHeader, SheetTitle, SheetTrigger, SheetFooter } from '@/components/ui/sheet';
import { Separator } from '@/components/ui/separator';
import { useToast } from '@/hooks/use-toast';
import { Alert, AlertTitle, AlertDescription } from '@/components/ui/alert';

export default function FoodPage() {
  const [cart, setCart] = useState<{[key: string]: {item: MenuItem, quantity: number}}>({});
  const { toast } = useToast();

  const addToCart = (item: MenuItem) => {
    setCart(prevCart => {
      const existingItem = prevCart[item.id];
      if (existingItem) {
        // Prevent adding items from different restaurants
        const firstItemRestaurant = RESTAURANTS.find(r => r.menu.some(m => m.id === Object.keys(prevCart)[0]));
        const currentItemRestaurant = RESTAURANTS.find(r => r.menu.some(m => m.id === item.id));
        if (firstItemRestaurant && currentItemRestaurant && firstItemRestaurant.id !== currentItemRestaurant.id) {
          toast({
            variant: 'destructive',
            title: 'Error',
            description: 'You can only order from one restaurant at a time.',
          });
          return prevCart;
        }
        return {
          ...prevCart,
          [item.id]: { ...existingItem, quantity: existingItem.quantity + 1 }
        };
      }
      return {
        ...prevCart,
        [item.id]: { item, quantity: 1 }
      };
    });
  };

  const removeFromCart = (itemId: string) => {
    setCart(prevCart => {
      const newCart = { ...prevCart };
      if (newCart[itemId] && newCart[itemId].quantity > 1) {
        newCart[itemId].quantity -= 1;
      } else {
        delete newCart[itemId];
      }
      return newCart;
    });
  };

  const clearCart = () => {
    setCart({});
  }

  const handlePlaceOrder = () => {
    toast({
      title: 'Order Placed!',
      description: 'Your food is on the way. A rider will be assigned shortly.',
      className: 'bg-green-100 border-green-300',
    });
    clearCart();
    // Here you would typically close the sheet as well, which requires controlling its open state.
    // For simplicity, we'll rely on the user to close it.
  };

  const cartItems = Object.values(cart);
  const cartTotal = cartItems.reduce((total, {item, quantity}) => total + item.price * quantity, 0);
  const cartItemCount = cartItems.reduce((total, {quantity}) => total + quantity, 0);

  return (
    <div className="container py-12">
      <div className="text-left mb-12">
        <UtensilsCrossed className="h-12 w-12 text-primary" />
        <h1 className="mt-4 text-4xl font-bold font-headline">Food Delivery</h1>
        <p className="mt-2 text-lg text-muted-foreground">Craving something delicious? Get it delivered.</p>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
        {RESTAURANTS.map((restaurant) => {
          const image = PlaceHolderImages.find(p => p.id === restaurant.imageId);
          return (
            <RestaurantCard key={restaurant.id} restaurant={restaurant} image={image} onAddToCart={addToCart} />
          );
        })}
      </div>
      
      <Sheet>
        <SheetTrigger asChild>
          <Button
            className="fixed bottom-6 right-6 h-16 w-16 rounded-full shadow-2xl"
            disabled={cartItemCount === 0}
          >
            <ShoppingCart className="h-7 w-7" />
            <span className="sr-only">View Cart</span>
            {cartItemCount > 0 && (
              <span className="absolute -top-1 -right-1 flex h-6 w-6 items-center justify-center rounded-full bg-red-500 text-xs font-bold text-white">
                {cartItemCount}
              </span>
            )}
          </Button>
        </SheetTrigger>
        <SheetContent className="flex flex-col">
          <SheetHeader>
            <SheetTitle className="font-headline text-2xl">Your Order</SheetTitle>
          </SheetHeader>
          <Separator />
           {cartItems.length === 0 ? (
             <div className="flex-grow flex flex-col items-center justify-center text-center">
                <ShoppingCart className="h-16 w-16 text-muted-foreground" />
                <p className="mt-4 text-muted-foreground">Your cart is empty.</p>
                <p className="text-sm text-muted-foreground">Add items from a restaurant to get started.</p>
            </div>
           ) : (
             <div className="flex-grow overflow-y-auto -mx-6 px-6">
                <div className="space-y-4">
                  {cartItems.map(({ item, quantity }) => (
                    <div key={item.id} className="flex items-center gap-4">
                      <div className="flex-grow">
                        <p className="font-semibold">{item.name}</p>
                        <p className="text-sm text-muted-foreground">GH₵{item.price.toFixed(2)}</p>
                      </div>
                      <div className="flex items-center gap-2">
                        <Button variant="ghost" size="icon" className="h-7 w-7" onClick={() => removeFromCart(item.id)}>
                          <MinusCircle className="h-4 w-4" />
                        </Button>
                        <span className="font-bold w-4 text-center">{quantity}</span>
                        <Button variant="ghost" size="icon" className="h-7 w-7" onClick={() => addToCart(item)}>
                          <PlusCircle className="h-4 w-4" />
                        </Button>
                      </div>
                    </div>
                  ))}
                </div>
            </div>
           )}
          <Separator />
          <SheetFooter className="sm:justify-between flex-col sm:flex-col gap-4 pt-4">
            <div className="flex justify-between items-center text-lg font-bold">
              <span>Total:</span>
              <span>GH₵{cartTotal.toFixed(2)}</span>
            </div>
            <Button 
                className="w-full h-12" 
                style={{ backgroundColor: 'hsl(var(--accent))', color: 'hsl(var(--accent-foreground))' }}
                disabled={cartItems.length === 0}
                onClick={handlePlaceOrder}
            >
              <CheckCircle className="mr-2 h-5 w-5" />
              Place Order
            </Button>
            <Button variant="outline" className="w-full" onClick={clearCart} disabled={cartItems.length === 0}>
                <X className="mr-2 h-4 w-4"/> Clear Cart
            </Button>
          </SheetFooter>
        </SheetContent>
      </Sheet>
    </div>
  );
}

function RestaurantCard({ restaurant, image, onAddToCart }: { restaurant: Restaurant, image: any, onAddToCart: (item: MenuItem) => void }) {
  const [selectedItem, setSelectedItem] = useState<MenuItem | null>(null);

  const handleAddToCart = (item: MenuItem) => {
    onAddToCart(item);
    setSelectedItem(null); // Close popover/dialog on add
  }

  return (
    <Card className="flex flex-col">
      <div className="relative aspect-[16/9] bg-muted w-full overflow-hidden rounded-t-lg">
        {image && (
          <Image
            src={image.imageUrl}
            alt={restaurant.name}
            fill
            className="object-cover"
            data-ai-hint={restaurant.imageHint}
          />
        )}
      </div>
      <CardHeader>
        <CardTitle className="font-headline">{restaurant.name}</CardTitle>
        <CardDescription className="flex items-center gap-4 text-sm">
          <span className="flex items-center gap-1"><Star className="h-4 w-4 text-yellow-400" /> {restaurant.rating}</span>
          <span>{restaurant.category}</span>
          <span className="flex items-center gap-1"><Clock className="h-4 w-4" /> {restaurant.deliveryTime}</span>
        </CardDescription>
      </CardHeader>
      <CardContent className="flex-grow space-y-2">
        <h4 className="font-semibold">Menu</h4>
        {restaurant.menu.map(item => (
            <div key={item.id} className="flex justify-between items-start gap-2">
              <div className="flex-grow">
                <p className="text-sm font-medium">{item.name}</p>
                <p className="text-xs text-muted-foreground">{item.description}</p>
              </div>
              <div className="flex flex-col items-end flex-shrink-0 pl-2">
                <p className="text-sm font-bold">GH₵{item.price.toFixed(2)}</p>
                <Button variant="outline" size="sm" className="h-7 text-xs mt-1" onClick={() => handleAddToCart(item)}>
                    <PlusCircle className="h-3 w-3 mr-1" /> Add
                </Button>
              </div>
            </div>
        ))}
      </CardContent>
    </Card>
  )
}
