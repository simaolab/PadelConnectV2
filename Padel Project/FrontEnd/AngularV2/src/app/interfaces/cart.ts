export interface CartItem {
  name: string;
  address: string;
  startDate: string;
  endDate: string;
  pricePerHour: number;
  totalHours: number;
  totalPrice: number;
}

export interface Cart {
  items: CartItem[];
  totalPrice: number;
}
