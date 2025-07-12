#!/usr/bin/env node

import 'dotenv/config';
import { Server } from '@modelcontextprotocol/sdk/server/index.js';
import { StdioServerTransport } from '@modelcontextprotocol/sdk/server/stdio.js';
import {
  CallToolRequestSchema,
  ErrorCode,
  ListToolsRequestSchema,
  McpError,
} from '@modelcontextprotocol/sdk/types.js';
import axios, { AxiosResponse } from 'axios';
import { XMLParser } from 'fast-xml-parser';

// Interface definitions
interface PrestaShopConfig {
  shopUrl: string;
  apiKey: string;
}

interface Product {
  id: string;
  name: string;
  price: string;
  active: boolean;
  stock_quantity?: number;
}

interface Order {
  id: string;
  reference: string;
  customer_id: string;
  date_add: string;
  total_paid: string;
  current_state: string;
}

interface Customer {
  id: string;
  firstname: string;
  lastname: string;
  email: string;
  date_add: string;
}

class PrestaShopMCPServer {
  private config: PrestaShopConfig;
  private xmlParser: XMLParser;
  private server: Server;

  constructor() {
    this.config = {
      shopUrl: process.env.PRESTASHOP_URL || '',
      apiKey: process.env.PRESTASHOP_API_KEY || '',
    };

    if (!this.config.shopUrl || !this.config.apiKey) {
      throw new Error('PRESTASHOP_URL and PRESTASHOP_API_KEY environment variables are required');
    }

    this.xmlParser = new XMLParser({
      ignoreAttributes: false,
      attributeNamePrefix: '@_',
    });

    this.server = new Server(
      {
        name: 'prestashop-mcp-server',
        version: '0.1.0',
      },
      {
        capabilities: {
          tools: {},
        },
      }
    );

    this.setupToolHandlers();
  }

  private async callPrestaShopAPI(
    resource: string,
    method: 'GET' | 'POST' | 'PUT' | 'DELETE' = 'GET',
    data?: any
  ): Promise<AxiosResponse> {
    const baseUrl = `${this.config.shopUrl.replace(/\/$/, '')}/api`;
    const url = `${baseUrl}/${resource}`;

    const config = {
      method,
      url,
      auth: {
        username: this.config.apiKey,
        password: '',
      },
      headers: {
        'Content-Type': 'application/xml',
      },
      data,
    };

    try {
      const response = await axios(config);
      return response;
    } catch (error) {
      if (axios.isAxiosError(error)) {
        throw new McpError(
          ErrorCode.InternalError,
          `PrestaShop API error22: ${error.response?.status} - ${error.response?.data || error.message}`
        );
      }
      throw error;
    }
  }

  private parseXMLResponse(xmlData: string): any {
    try {
      return this.xmlParser.parse(xmlData);
    } catch (error) {
      throw new McpError(ErrorCode.InternalError, `XML parsing error: ${error}`);
    }
  }

  private setupToolHandlers() {
    this.server.setRequestHandler(ListToolsRequestSchema, async () => {
      return {
        tools: [
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
        ],
      };
    });

    this.server.setRequestHandler(CallToolRequestSchema, async (request) => {
      const { name, arguments: args } = request.params;

      try {
        switch (name) {
          case 'get_products':
            return await this.getProducts(args);
          case 'get_product_details':
            return await this.getProductDetails(args);
          case 'get_orders':
            return await this.getOrders(args);
          case 'get_order_details':
            return await this.getOrderDetails(args);
          case 'get_customers':
            return await this.getCustomers(args);
          case 'update_product_stock':
            return await this.updateProductStock(args);
          case 'get_categories':
            return await this.getCategories(args);
          case 'get_order_states':
            return await this.getOrderStates(args);
          default:
            throw new McpError(ErrorCode.MethodNotFound, `Unknown tool: ${name}`);
        }
      } catch (error) {
        if (error instanceof McpError) {
          throw error;
        }
        throw new McpError(ErrorCode.InternalError, `Error executing ${name}: ${error}`);
      }
    });
  }

  private async getProducts(args: any) {
    const { limit = 10, filter, display } = args;
    let resource = `products?limit=${limit}`;
    
    if (filter) {
      resource += `&filter=${filter}`;
    }
    
    if (display) {
      resource += `&display=${display}`;
    }

    const response = await this.callPrestaShopAPI(resource);
    const parsed = this.parseXMLResponse(response.data);
    
    return {
      content: [
        {
          type: 'text',
          text: `Retrieved ${parsed.prestashop?.products?.product?.length || 0} products:\n${JSON.stringify(parsed.prestashop?.products, null, 2)}`,
        },
      ],
    };
  }

  private async getProductDetails(args: any) {
    console.log('Getting product details for:', args);
    const { product_id } = args;
    const response = await this.callPrestaShopAPI(`products/${product_id}`);
    const parsed = this.parseXMLResponse(response.data);
    
    return {
      content: [
        {
          type: 'text',
          text: `Product details for ID ${product_id}:\n${JSON.stringify(parsed.prestashop?.product, null, 2)}`,
        },
      ],
    };
  }

  private async getOrders(args: any) {
    const { limit = 10, filter, display } = args;
    let resource = `orders?limit=${limit}`;
    
    if (filter) {
      resource += `&filter=${filter}`;
    }
    
    if (display) {
      resource += `&display=${display}`;
    }

    const response = await this.callPrestaShopAPI(resource);
    const parsed = this.parseXMLResponse(response.data);
    
    return {
      content: [
        {
          type: 'text',
          text: `Retrieved ${parsed.prestashop?.orders?.order?.length || 0} orders:\n${JSON.stringify(parsed.prestashop?.orders, null, 2)}`,
        },
      ],
    };
  }

  private async getOrderDetails(args: any) {
    const { order_id } = args;
    const response = await this.callPrestaShopAPI(`orders/${order_id}`);
    const parsed = this.parseXMLResponse(response.data);
    
    return {
      content: [
        {
          type: 'text',
          text: `Order details for ID ${order_id}:\n${JSON.stringify(parsed.prestashop?.order, null, 2)}`,
        },
      ],
    };
  }

  private async getCustomers(args: any) {
    const { limit = 10, filter } = args;
    let resource = `customers?limit=${limit}`;
    
    if (filter) {
      resource += `&filter=${filter}`;
    }

    const response = await this.callPrestaShopAPI(resource);
    const parsed = this.parseXMLResponse(response.data);
    
    return {
      content: [
        {
          type: 'text',
          text: `Retrieved ${parsed.prestashop?.customers?.customer?.length || 0} customers:\n${JSON.stringify(parsed.prestashop?.customers, null, 2)}`,
        },
      ],
    };
  }

  private async updateProductStock(args: any) {
    const { product_id, quantity } = args;
    
    // First get the current stock availability record
    const stockResponse = await this.callPrestaShopAPI(`stock_availables?filter=id_product=${product_id}`);
    const stockParsed = this.parseXMLResponse(stockResponse.data);
    
    const stockAvailable = stockParsed.prestashop?.stock_availables?.stock_available;
    if (!stockAvailable) {
      throw new McpError(ErrorCode.InternalError, 'Stock availability record not found');
    }

    const stockId = Array.isArray(stockAvailable) ? stockAvailable[0]['@_id'] : stockAvailable['@_id'];
    
    // Update the stock quantity
    const updateXML = `<?xml version="1.0" encoding="UTF-8"?>
<prestashop xmlns:xlink="http://www.w3.org/1999/xlink">
  <stock_available>
    <id>${stockId}</id>
    <quantity>${quantity}</quantity>
  </stock_available>
</prestashop>`;

    const updateResponse = await this.callPrestaShopAPI(`stock_availables/${stockId}`, 'PUT', updateXML);
    
    return {
      content: [
        {
          type: 'text',
          text: `Successfully updated stock for product ${product_id} to ${quantity} units`,
        },
      ],
    };
  }

  private async getCategories(args: any) {
    const { limit = 10, filter } = args;
    let resource = `categories?limit=${limit}`;
    
    if (filter) {
      resource += `&filter=${filter}`;
    }

    const response = await this.callPrestaShopAPI(resource);
    const parsed = this.parseXMLResponse(response.data);
    
    return {
      content: [
        {
          type: 'text',
          text: `Retrieved ${parsed.prestashop?.categories?.category?.length || 0} categories:\n${JSON.stringify(parsed.prestashop?.categories, null, 2)}`,
        },
      ],
    };
  }

  private async getOrderStates(args: any) {
    const response = await this.callPrestaShopAPI('order_states');
    const parsed = this.parseXMLResponse(response.data);
    
    return {
      content: [
        {
          type: 'text',
          text: `Available order states:\n${JSON.stringify(parsed.prestashop?.order_states, null, 2)}`,
        },
      ],
    };
  }

  async run() {
    const transport = new StdioServerTransport();
    await this.server.connect(transport);
    console.error('PrestaShop MCP server running on stdio');
  }
}

// Run the server
const server = new PrestaShopMCPServer();
server.run().catch(console.error);