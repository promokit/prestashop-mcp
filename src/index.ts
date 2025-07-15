#!/usr/bin/env node

import 'dotenv/config';
import { PrestaShopMCPServer } from './server/main/prestashop-server.js';

async function main() {
    try {
        const server = new PrestaShopMCPServer();
        await server.run();
    } catch (error) {
        console.error('Failed to start PrestaShop MCP server: ', error);
        process.exit(1);
    }
}

main();
