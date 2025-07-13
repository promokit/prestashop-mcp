import { ErrorCode, McpError } from '@modelcontextprotocol/sdk/types.js';
import { PrestaShopAPI } from '../main/prestashop-api.js';
import { createTextContent, formatResponse, formatDetailResponse, formatSuccessMessage, extractArrayLength, validateRequiredParams } from '../utils/utils.js';

export class ToolHandlers {
  constructor(private api: PrestaShopAPI) {}

  async handleTool(name: string, args: any) {
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
  }

  private async getProducts(args: any) {
    const { limit = 10, filter, display } = args;
    const resource = this.api.buildResourceUrl('products', { limit, filter, display });

    const response = await this.api.callAPI(resource);
    const parsed = this.api.parseXMLResponse(response.data);
    
    const count = extractArrayLength(parsed.prestashop, ['products', 'product']);
    const text = formatResponse(parsed.prestashop?.products, count, 'products');
    
    return createTextContent(text);
  }

  private async getProductDetails(args: any) {
    validateRequiredParams(args, ['product_id']);
    const { product_id } = args;
    
    const response = await this.api.callAPI(`products/${product_id}`);
    const parsed = this.api.parseXMLResponse(response.data);
    
    const text = formatDetailResponse(parsed.prestashop?.product, product_id, 'Product');
    return createTextContent(text);
  }

  private async getOrders(args: any) {
    const { limit = 10, filter, display } = args;
    const resource = this.api.buildResourceUrl('orders', { limit, filter, display });

    const response = await this.api.callAPI(resource);
    const parsed = this.api.parseXMLResponse(response.data);
    
    const count = extractArrayLength(parsed.prestashop, ['orders', 'order']);
    const text = formatResponse(parsed.prestashop?.orders, count, 'orders');
    
    return createTextContent(text);
  }

  private async getOrderDetails(args: any) {
    validateRequiredParams(args, ['order_id']);
    const { order_id } = args;
    
    const response = await this.api.callAPI(`orders/${order_id}`);
    const parsed = this.api.parseXMLResponse(response.data);
    
    const text = formatDetailResponse(parsed.prestashop?.order, order_id, 'Order');
    return createTextContent(text);
  }

  private async getCustomers(args: any) {
    const { limit = 10, filter } = args;
    const resource = this.api.buildResourceUrl('customers', { limit, filter });

    const response = await this.api.callAPI(resource);
    const parsed = this.api.parseXMLResponse(response.data);
    
    const count = extractArrayLength(parsed.prestashop, ['customers', 'customer']);
    const text = formatResponse(parsed.prestashop?.customers, count, 'customers');
    
    return createTextContent(text);
  }

  private async updateProductStock(args: any) {
    validateRequiredParams(args, ['product_id', 'quantity']);
    const { product_id, quantity } = args;
    
    // First get the current stock availability record
    const stockResponse = await this.api.callAPI(`stock_availables?filter=id_product=${product_id}`);
    const stockParsed = this.api.parseXMLResponse(stockResponse.data);
    
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

    await this.api.callAPI(`stock_availables/${stockId}`, 'PUT', updateXML);
    
    const message = `updated stock for product ${product_id} to ${quantity} units`;
    return createTextContent(formatSuccessMessage(message));
  }

  private async getCategories(args: any) {
    const { limit = 10, filter } = args;
    const resource = this.api.buildResourceUrl('categories', { limit, filter });

    const response = await this.api.callAPI(resource);
    const parsed = this.api.parseXMLResponse(response.data);
    
    const count = extractArrayLength(parsed.prestashop, ['categories', 'category']);
    const text = formatResponse(parsed.prestashop?.categories, count, 'categories');
    
    return createTextContent(text);
  }

  private async getOrderStates(args: any) {
    const response = await this.api.callAPI('order_states');
    const parsed = this.api.parseXMLResponse(response.data);
    
    const text = `Available order states:\n${JSON.stringify(parsed.prestashop?.order_states, null, 2)}`;
    return createTextContent(text);
  }
} 