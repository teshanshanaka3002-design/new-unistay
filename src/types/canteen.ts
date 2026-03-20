export interface Canteen {
  id: string;
  name: string;
  location: string;
  rating: number;
  description: string;
  image: string;
}

export interface MenuItem {
  id: string;
  canteenId: string;
  name: string;
  description: string;
  price: number;
  image: string;
  category: string;
}

export interface OrderItem {
  menuItemId: string;
  name: string;
  price: number;
  quantity: number;
}

export type OrderStatus = 'Pending' | 'Preparing' | 'Ready' | 'Collected';

export interface Order {
  id: string;
  canteenId: string;
  canteenName: string;
  studentId: string;
  items: OrderItem[];
  totalPrice: number;
  pickupTime: string;
  notes?: string;
  status: OrderStatus;
  createdAt: string;
}
