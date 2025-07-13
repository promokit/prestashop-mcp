import { Server } from '@modelcontextprotocol/sdk/server/index.js';
import { StdioServerTransport } from '@modelcontextprotocol/sdk/server/stdio.js';
import {
  CallToolRequestSchema,
  ErrorCode,
  ListToolsRequestSchema,
  McpError,
} from '@modelcontextprotocol/sdk/types.js';
import { PrestaShopAPI } from './prestashop-api.js';
import { ToolDefinitions } from '../tools/tool-definitions.js';
import { ToolHandlers } from '../tools/tool-handlers.js';
import { loadConfig, validateConfig, ServerConfig } from './config.js';

export class PrestaShopMCPServer {
  private api: PrestaShopAPI;
  private server: Server;
  private toolHandlers: ToolHandlers;
  private config: ServerConfig;

  constructor() {
    this.config = loadConfig();
    validateConfig(this.config);
    
    this.api = new PrestaShopAPI(this.config);
    this.toolHandlers = new ToolHandlers(this.api);
    
    this.server = new Server(
      {
        name: this.config.server.name,
        version: this.config.server.version,
      },
      {
        capabilities: {
          tools: {},
        },
      }
    );

    this.setupToolHandlers();
  }

  private setupToolHandlers() {
    this.server.setRequestHandler(ListToolsRequestSchema, async () => {
      return {
        tools: ToolDefinitions.getAllTools(),
      };
    });

    this.server.setRequestHandler(CallToolRequestSchema, async (request) => {
      const { name, arguments: args } = request.params;

      try {
        return await this.toolHandlers.handleTool(name, args);
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