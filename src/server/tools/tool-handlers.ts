import { ErrorCode, McpError } from '@modelcontextprotocol/sdk/types.js';
import { PrestaShopAPI } from '../main/prestashop-api.js';
import {
    createTextContent,
    formatResponse,
    formatDetailResponse,
    formatSuccessMessage,
    extractArrayLength,
    validateRequiredParams,
} from '../utils/utils.js';
import { ProductsResponse } from '../types/Prestashop.js';
import { ToolFn, ToolResponse } from '../types/Tools.js';

const fetchResource = async <T>(
    api: PrestaShopAPI,
    resource: string,
    args: Record<string, any> = {}
): Promise<T> => {
    const url = api.buildResourceUrl(resource, args);
    const response = await api.callAPI(url); 

    return response.data || {};
};

const getProducts: ToolFn = async (api, args): Promise<ToolResponse> => {
    const { limit = 10, filter, display = '[id,manufacturer_name]' } = args;
    const parsed = await fetchResource<ProductsResponse>(api, 'products', { limit, filter, display });
    const count = parsed.products.length || 0;
    return createTextContent(
        formatResponse(parsed?.products, count, 'Products')
    );
};

const getProductDetails: ToolFn = async (api, args): Promise<ToolResponse> => {
    validateRequiredParams(args, ['product_id']);
    const { product_id } = args;
    const parsed = await fetchResource<ProductsResponse>(api, `products/${product_id}`);
    return createTextContent(
        formatDetailResponse(parsed?.products, product_id, 'Product')
    );
};

const getOrders: ToolFn = async (api, args) => {
    const { limit = 10, filter, display } = args;
    const resource = api.buildResourceUrl('orders', { limit, filter, display });

    const response = await api.callAPI(resource);
    const parsed = api.parseXMLResponse(response.data);

    const count = extractArrayLength(parsed.prestashop, ['orders', 'order']);
    const text = formatResponse(parsed.prestashop?.orders, count, 'orders');

    return createTextContent(text);
};

const getOrderDetails: ToolFn = async (api, args) => {
    validateRequiredParams(args, ['order_id']);
    const { order_id } = args;

    const response = await api.callAPI(`orders/${order_id}`);
    const parsed = api.parseXMLResponse(response.data);

    const text = formatDetailResponse(parsed.prestashop?.order, order_id, 'Order');
    return createTextContent(text);
};

const getCustomers: ToolFn = async (api, args) => {
    const { limit = 10, filter } = args;
    const resource = api.buildResourceUrl('customers', { limit, filter });

    const response = await api.callAPI(resource);
    const parsed = api.parseXMLResponse(response.data);

    const count = extractArrayLength(parsed.prestashop, ['customers', 'customer']);
    const text = formatResponse(parsed.prestashop?.customers, count, 'customers');

    return createTextContent(text);
};

const updateProductStock: ToolFn = async (api, args) => {
    validateRequiredParams(args, ['product_id', 'quantity']);
    const { product_id, quantity } = args;

    const stockResponse = await api.callAPI(`stock_availables?filter=id_product=${product_id}`);
    const stockParsed = api.parseXMLResponse(stockResponse.data);

    const stockAvailable = stockParsed.prestashop?.stock_availables?.stock_available;
    if (!stockAvailable) {
        throw new McpError(ErrorCode.InternalError, 'Stock availability record not found');
    }

    const stockId = Array.isArray(stockAvailable) ? stockAvailable[0]['@_id'] : stockAvailable['@_id'];

    const updateXML = `<?xml version="1.0" encoding="UTF-8"?>
<prestashop xmlns:xlink="http://www.w3.org/1999/xlink">
  <stock_available>
    <id>${stockId}</id>
    <quantity>${quantity}</quantity>
  </stock_available>
</prestashop>`;

    await api.callAPI(`stock_availables/${stockId}`, 'PUT', updateXML);
    return createTextContent(
        formatSuccessMessage(`updated stock for product ${product_id} to ${quantity} units`)
    );
};

const getCategories: ToolFn = async (api, args) => {
    const { limit = 10, filter } = args;
    const resource = api.buildResourceUrl('categories', { limit, filter });

    const response = await api.callAPI(resource);
    const parsed = api.parseXMLResponse(response.data);

    const count = extractArrayLength(parsed.prestashop, ['categories', 'category']);
    const text = formatResponse(parsed.prestashop?.categories, count, 'categories');

    return createTextContent(text);
};

const getOrderStates: ToolFn = async (api, args) => {
    const response = await api.callAPI('order_states');
    const parsed = api.parseXMLResponse(response.data);

    const text = `Available order states:\n${JSON.stringify(parsed.prestashop?.order_states, null, 2)}`;
    return createTextContent(text);
};

export const handlerRegistry: Record<string, ToolFn> = {
  getProducts,
  getProductDetails
};