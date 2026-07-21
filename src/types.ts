export interface MenuItem {
  id: string;
  name: string;
  description: string;
  price: number;
  category: string;
  image: string;
  type: 'sweet' | 'restaurant';
  isVeg: boolean;
  isSugarFree?: boolean;
  rating?: number;
  popular?: boolean;
}

export interface CartItem {
  item: MenuItem;
  quantity: number;
}

export type ViewMode = 'home' | 'sweet-shop' | 'restaurant' | 'dashboard' | 'cart' | 'admin' | 'profile';

export interface Order {
  id: string;
  items: CartItem[];
  details: OrderDetails;
  total: number;
  timestamp: string;
  status: 'pending' | 'completed' | 'cancelled';
}

export interface OrderDetails {
  customerName: string;
  customerPhone: string;
  tableNumber?: string;
  orderType: 'dine-in' | 'takeaway' | 'delivery';
  address?: string;
}

export interface UserProfile {
  fullName: string;
  address: string;
  pinCode: string;
  password: string; // 6 digit
  contactNumber: string;
}

