import { ToolDefinition } from '../types/Tools';

export const toolDefinitions: Record<string, ToolDefinition> = {
    'get_products': {
        name: 'get_products',
        description: 'Retrieve products from PrestaShop store',
        label: 'Products',
        resource: 'products',
        handlerName: 'getProducts',
        inputSchema: {
            type: 'object',
            properties: {
                limit: {
                    type: 'number',
                    description: 'Number of products to retrieve',
                    default: 10,
                },
                filter: {
                    type: 'string',
                    description: 'Filter criteria (e.g., "[id]=[1,10]")',
                    default: '[id]=[1,10]'
                },
                display: {
                    type: 'string',
                    description: 'Comma-separated list of fields to display (e.g. "[id,manufacturer_name]")',
                    default: '[id,manufacturer_name]'
                },
            },
        },
    },
    'get_product_details': {
        name: 'get_product_details',
        description: 'Get detailed information about a specific product',
        label: 'Product Details',
        resource: 'products',
        handlerName: 'getProductDetails',
        inputSchema: {
            type: 'object',
            properties: {
                product_id: {
                    type: 'number',
                    description: 'Product ID',
                    default: 1
                },
            },
            required: ['product_id'],
        },
    },
    'get_categories': {
        name: 'get_categories',
        description: 'Retrieve product categories',
        label: 'Categories',
        resource: 'categories',
        handlerName: 'getCategories',
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
                display: {
                    type: 'string',
                    description: 'Comma-separated list of fields to display (e.g. "[id,name]" or "full")',
                    default: '[id,name]'
                },
            },
        },
    },
            // {
            //     name: 'get_orders',
            //     description: 'Retrieve orders from PrestaShop store',
            //     inputSchema: {
            //         type: 'object',
            //         properties: {
            //             limit: {
            //                 type: 'number',
            //                 description: 'Number of orders to retrieve (default: 10)',
            //                 default: 10,
            //             },
            //             filter: {
            //                 type: 'string',
            //                 description: 'Filter criteria (e.g., "date_add>[2024-01-01]")',
            //             },
            //             display: {
            //                 type: 'string',
            //                 description: 'Comma-separated list of fields to display',
            //             },
            //         },
            //     },
            // },
            // {
            //     name: 'get_order_details',
            //     description: 'Get detailed information about a specific order',
            //     inputSchema: {
            //         type: 'object',
            //         properties: {
            //             order_id: {
            //                 type: 'number',
            //                 description: 'Order ID',
            //             },
            //         },
            //         required: ['order_id'],
            //     },
            // },
            // {
            //     name: 'get_customers',
            //     description: 'Retrieve customers from PrestaShop store',
            //     inputSchema: {
            //         type: 'object',
            //         properties: {
            //             limit: {
            //                 type: 'number',
            //                 description: 'Number of customers to retrieve (default: 10)',
            //                 default: 10,
            //             },
            //             filter: {
            //                 type: 'string',
            //                 description: 'Filter criteria (e.g., "email=[customer@email.com]")',
            //             },
            //         },
            //     },
            // },
            // {
            //     name: 'update_product_stock',
            //     description: 'Update product stock quantity',
            //     inputSchema: {
            //         type: 'object',
            //         properties: {
            //             product_id: {
            //                 type: 'number',
            //                 description: 'Product ID',
            //             },
            //             quantity: {
            //                 type: 'number',
            //                 description: 'New stock quantity',
            //             },
            //         },
            //         required: ['product_id', 'quantity'],
            //     },
            // },
            // {
            //     name: 'get_order_states',
            //     description: 'Retrieve available order states',
            //     inputSchema: {
            //         type: 'object',
            //         properties: {},
            //     },
            // },
};

export type ToolName = keyof typeof toolDefinitions;
