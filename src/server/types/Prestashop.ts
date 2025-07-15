export type Resources = 'addresses' | 'attachments' | 'carriers' | 'cart_rules' | 'carts' | 'categories' | 'combinations' | 'configurations' | 'contacts' | 'content_management_system' | 'countries' | 'currencies' | 'customer_messages' | 'customer_threads' | 'customers' | 'customizations' | 'deliveries' | 'employees' | 'groups' | 'guests' | 'image_types' | 'images' | 'languages' | 'manufacturers' | 'messages' | 'order_carriers' | 'order_cart_rules' | 'order_details' | 'order_histories' | 'order_invoices' | 'order_payments' | 'order_returns' | 'order_slip' | 'order_states' | 'orders' | 'price_ranges' | 'product_customization_fields' | 'product_feature_values' | 'product_features' | 'product_option_values' | 'product_options' | 'product_suppliers' | 'products' | 'search' | 'shop_groups' | 'shop_urls' | 'shops' | 'specific_price_rules' | 'specific_prices' | 'states' | 'stock_availables' | 'stock_movement_reasons' | 'stock_movements' | 'stocks' | 'stores' | 'suppliers' | 'tags' | 'tax_rule_groups' | 'tax_rules' | 'taxes' | 'translated_configurations' | 'warehouses' | 'weight_ranges' | 'zones';

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
  products: Product[];
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