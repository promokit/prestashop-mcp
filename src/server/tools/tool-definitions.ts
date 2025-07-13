export interface ToolDefinition {
  name: string;
  description: string;
  inputSchema: {
    type: string;
    properties: Record<string, any>;
    required?: string[];
  };
}

export class ToolDefinitions {
  static getAllTools(): ToolDefinition[] {
    return [
      {
        name: 'get_products',
        description: 'Retrieve products from PrestaShop store',
        inputSchema: {
          type: 'object',
          properties: {
            limit: {
              type: 'number',
              description: 'Number of products to retrieve (default: 10)',
              default: 10,
            },
            filter: {
              type: 'string',
              description: 'Filter criteria (e.g., "name=[product_name]")',
            },
            display: {
              type: 'string',
              description: 'Comma-separated list of fields to display',
            },
          },
        },
      },
      {
        name: 'get_product_details',
        description: 'Get detailed information about a specific product',
        inputSchema: {
          type: 'object',
          properties: {
            product_id: {
              type: 'number',
              description: 'Product ID',
            },
          },
          required: ['product_id'],
        },
      },
      {
        name: 'get_orders',
        description: 'Retrieve orders from PrestaShop store',
        inputSchema: {
          type: 'object',
          properties: {
            limit: {
              type: 'number',
              description: 'Number of orders to retrieve (default: 10)',
              default: 10,
            },
            filter: {
              type: 'string',
              description: 'Filter criteria (e.g., "date_add>[2024-01-01]")',
            },
            display: {
              type: 'string',
              description: 'Comma-separated list of fields to display',
            },
          },
        },
      },
      {
        name: 'get_order_details',
        description: 'Get detailed information about a specific order',
        inputSchema: {
          type: 'object',
          properties: {
            order_id: {
              type: 'number',
              description: 'Order ID',
            },
          },
          required: ['order_id'],
        },
      },
      {
        name: 'get_customers',
        description: 'Retrieve customers from PrestaShop store',
        inputSchema: {
          type: 'object',
          properties: {
            limit: {
              type: 'number',
              description: 'Number of customers to retrieve (default: 10)',
              default: 10,
            },
            filter: {
              type: 'string',
              description: 'Filter criteria (e.g., "email=[customer@email.com]")',
            },
          },
        },
      },
      {
        name: 'update_product_stock',
        description: 'Update product stock quantity',
        inputSchema: {
          type: 'object',
          properties: {
            product_id: {
              type: 'number',
              description: 'Product ID',
            },
            quantity: {
              type: 'number',
              description: 'New stock quantity',
            },
          },
          required: ['product_id', 'quantity'],
        },
      },
      {
        name: 'get_categories',
        description: 'Retrieve product categories',
        inputSchema: {
          type: 'object',
          properties: {
            limit: {
              type: 'number',
              description: 'Number of categories to retrieve (default: 10)',
              default: 10,
            },
            filter: {
              type: 'string',
              description: 'Filter criteria',
            },
          },
        },
      },
      {
        name: 'get_order_states',
        description: 'Retrieve available order states',
        inputSchema: {
          type: 'object',
          properties: {},
        },
      },
    ];
  }
} 