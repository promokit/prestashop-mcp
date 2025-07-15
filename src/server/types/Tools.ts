import { PrestaShopAPI } from '../main/prestashop-api';
import { ToolName } from '../tools/tool-definitions';

export type ToolFn = (api: PrestaShopAPI, args: any) => Promise<any>;

export interface ToolDefinition {
    name: ToolName;
    description: string;
    label: string;
    resource: string;
    handlerName: string;
    inputSchema: {
        type: string;
        properties: Record<string, any>;
        required?: string[];
    };
}

export interface ToolResponse {
    content: [
        {
            type: 'text';
            text: string;
        },
    ];
}
