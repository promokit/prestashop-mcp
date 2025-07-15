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
        url: string,
        method: 'GET' | 'POST' | 'PUT' | 'DELETE' = 'GET',
        data?: any
    ): Promise<AxiosResponse> {
        const authKey = Buffer.from(`${this.config.prestashop.apiKey}:`).toString('base64');
        const config = {
            method,
            url,
            data,
            headers: {
                Authorization: `Basic ${authKey}`,
                'Content-Type': 'application/json',
                'Output-Format': 'JSON',
            },
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
                if (key === 'filter') {
                    const [filterBy, filterValues] = value.split('=');
                    url.searchParams.append(`${key}${filterBy}`, filterValues);
                } else {
                    url.searchParams.append(key, String(value));
                }
            }
        });

        return url.toString();
    }
}
