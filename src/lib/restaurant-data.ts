'use server';

export type MenuItem = {
  id: string;
  name: string;
  description: string;
  price: number;
};

export type Restaurant = {
  id: string;
  name: string;
  category: string;
  rating: number;
  deliveryTime: string;
  imageId: string;
  imageHint: string;
  menu: MenuItem[];
};

export const RESTAURANTS: Restaurant[] = [
  {
    id: 'resto-1',
    name: 'Jollof King',
    category: 'Ghanaian',
    rating: 4.8,
    deliveryTime: '25-35 min',
    imageId: 'restaurant-jollof',
    imageHint: 'jollof rice',
    menu: [
      { id: 'j-1', name: 'Jollof Rice with Chicken', description: 'Smoky, party-style jollof with a grilled chicken lap.', price: 45.0 },
      { id: 'j-2', name: 'Waakye Special', description: 'Classic waakye served with shito, gari, spaghetti, and boiled egg.', price: 35.0 },
      { id: 'j-3', name: 'Kelewele', description: 'Spicy fried plantain chunks with roasted peanuts.', price: 20.0 },
    ],
  },
  {
    id: 'resto-2',
    name: 'The Burger Spot',
    category: 'Burgers',
    rating: 4.6,
    deliveryTime: '30-40 min',
    imageId: 'restaurant-burger',
    imageHint: 'gourmet burger',
    menu: [
      { id: 'b-1', name: 'Classic Beef Burger', description: '150g beef patty, lettuce, tomato, and special sauce.', price: 55.0 },
      { id: 'b-2', name: 'Spicy Chicken Burger', description: 'Crispy fried chicken breast with a spicy slaw.', price: 50.0 },
      { id: 'b-3', name: 'Seasoned Fries', description: 'Crispy fries tossed in our house seasoning.', price: 25.0 },
    ],
  },
  {
    id: 'resto-3',
    name: 'Pizza Palace',
    category: 'Pizza',
    rating: 4.7,
    deliveryTime: '35-45 min',
    imageId: 'restaurant-pizza',
    imageHint: 'pepperoni pizza',
    menu: [
      { id: 'p-1', name: 'Meat-Lovers Pizza', description: 'Pepperoni, beef, bacon, and sausage on a cheesy base.', price: 80.0 },
      { id: 'p-2', name: 'Veggie Supreme Pizza', description: 'Bell peppers, onions, mushrooms, and olives.', price: 70.0 },
      { id: 'p-3', name: 'Garlic Bread with Cheese', description: 'Toasted garlic bread with melted mozzarella.', price: 30.0 },
    ],
  },
];
