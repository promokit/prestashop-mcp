import { Server } from '@modelcontextprotocol/sdk/server/index.js';
import { StdioServerTransport } from '@modelcontextprotocol/sdk/server/stdio.js';
import {
    CallToolRequestSchema,
    ErrorCode,
    ListToolsRequestSchema,
    McpError,
} from '@modelcontextprotocol/sdk/types.js';
import { PrestaShopAPI } from './prestashop-api.js';
import { loadConfig, validateConfig, ServerConfig } from './config.js';
import { toolDefinitions } from '../tools/tool-definitions.js';
import { handlerRegistry } from '../tools/tool-handlers.js';

export class PrestaShopMCPServer {
    private api: PrestaShopAPI;
    private server: Server;
    private config: ServerConfig;

    constructor() {
        this.config = loadConfig();
        validateConfig(this.config);

        this.api = new PrestaShopAPI(this.config);

        const { name, version } = this.config.server;

        this.server = new Server(
            { name, version },
            {
                capabilities: {
                    tools: {},
                },
            }
        );

        this.setupToolHandlers();
    }

    private setupToolHandlers() {
        this.server.setRequestHandler(ListToolsRequestSchema, async () => ({
            tools: Object.values(toolDefinitions)
                .map(({ name, description, inputSchema }) => ({
                    name,
                    description,
                    inputSchema
                })),
        }));

        this.server.setRequestHandler(CallToolRequestSchema, async (request) => {
            const { name, arguments: args } = request.params;

            try {
                const tool = toolDefinitions[name];

                if (!tool) {
                    throw new McpError(ErrorCode.MethodNotFound, `Unknown tool: ${name}`);
                }

                const handler = handlerRegistry[tool.handlerName];

                if (!handler) {
                    throw new McpError(ErrorCode.MethodNotFound, `Handler not found for: ${tool.handlerName}`);
                }

                return handler(this.api, args);
            } catch (error) {
                if (error instanceof McpError) {
                    throw error;
                }
                throw new McpError(ErrorCode.InternalError, `Error executing ${name}: ${error}`);
            }
        });
    }

    async run() {
        const transport = new StdioServerTransport();
        await this.server.connect(transport);
        console.error('PrestaShop MCP server running on stdio');
    }
}
