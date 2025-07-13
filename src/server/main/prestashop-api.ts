import axios, { AxiosResponse } from 'axios';
import { XMLParser } from 'fast-xml-parser';
import { ErrorCode, McpError } from '@modelcontextprotocol/sdk/types.js';
import { ServerConfig } from './config.js';

export class PrestaShopAPI {
  private config: ServerConfig;
  private xmlParser: XMLParser;

  constructor(config: ServerConfig) {
    this.config = config;

    this.xmlParser = new XMLParser({
      ignoreAttributes: false,
      attributeNamePrefix: '@_',
    });
  }

  async callAPI(
    resource: string,
    method: 'GET' | 'POST' | 'PUT' | 'DELETE' = 'GET',
    data?: any
  ): Promise<AxiosResponse> {
    const baseUrl = `${this.config.prestashop.url.replace(/\/$/, '')}/api`;
    const url = `${baseUrl}/${resource}`;

    const config = {
      method,
      url,
      auth: {
        username: this.config.prestashop.apiKey,
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
          `PrestaShop API error: ${error.response?.status} - ${error.response?.data || error.message}`
        );
      }
      throw error;
    }
  }

  parseXMLResponse(xmlData: string): any {
    try {
      return this.xmlParser.parse(xmlData);
    } catch (error) {
      throw new McpError(ErrorCode.InternalError, `XML parsing error: ${error}`);
    }
  }

  buildResourceUrl(resource: string, params: Record<string, any> = {}): string {
    const url = new URL(resource, `${this.config.prestashop.url.replace(/\/$/, '')}/api/`);
    
    Object.entries(params).forEach(([key, value]) => {
      if (value !== undefined && value !== null) {
        url.searchParams.append(key, String(value));
      }
    });
    
    return url.pathname + url.search;
  }
} 