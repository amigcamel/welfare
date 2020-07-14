export interface Orders {
  collected: boolean;
  date: string;
  orders: Order[];
  qr: string;
  user: string;
}

export interface Order {
  ice: string;
  item: string;
  options: [];
  price: number;
  size: string;
  sugar: string;
  value: number;
}
export interface HistoryPipe {
  count: number;
  sum: number;
}

