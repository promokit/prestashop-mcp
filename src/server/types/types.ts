export interface Product {
  id: string;
  name: string;
  price: string;
  active: boolean;
  stock_quantity?: number;
}

export interface Order {
  id: string;
  reference: string;
  customer_id: string;
  date_add: string;
  total_paid: string;
  current_state: string;
}

export interface Customer {
  id: string;
  firstname: string;
  lastname: string;
  email: string;
  date_add: string;
}

export interface Category {
  id: string;
  name: string;
  active: boolean;
  position: number;
}

export interface OrderState {
  id: string;
  name: string;
  color: string;
  logable: boolean;
  invoice: boolean;
  hidden: boolean;
  send_email: boolean;
  module_name: string;
  delivery: boolean;
  shipped: boolean;
  paid: boolean;
  pdf_invoice: boolean;
  pdf_delivery: boolean;
  deleted: boolean;
}

export interface StockAvailable {
  id: string;
  id_product: string;
  id_product_attribute: string;
  id_shop: string;
  id_shop_group: string;
  quantity: number;
  depends_on_stock: boolean;
  out_of_stock: number;
}

export interface ApiResponse<T> {
  prestashop: T;
}

export interface ProductsResponse {
  products: {
    product: Product[];
  };
}

export interface OrdersResponse {
  orders: {
    order: Order[];
  };
}

export interface CustomersResponse {
  customers: {
    customer: Customer[];
  };
}

export interface CategoriesResponse {
  categories: {
    category: Category[];
  };
}

export interface OrderStatesResponse {
  order_states: {
    order_state: OrderState[];
  };
}

export interface StockAvailablesResponse {
  stock_availables: {
    stock_available: StockAvailable[];
  };
} 