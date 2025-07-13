export interface ServerConfig {
  prestashop: {
    url: string;
    apiKey: string;
  };
  server: {
    name: string;
    version: string;
  };
}

export function loadConfig(): ServerConfig {
  const prestashopUrl = process.env.PRESTASHOP_URL;
  const prestashopApiKey = process.env.PRESTASHOP_API_KEY;

  if (!prestashopUrl) {
    throw new Error('PRESTASHOP_URL environment variable is required');
  }

  if (!prestashopApiKey) {
    throw new Error('PRESTASHOP_API_KEY environment variable is required');
  }

  return {
    prestashop: {
      url: prestashopUrl,
      apiKey: prestashopApiKey,
    },
    server: {
      name: 'prestashop-mcp-server',
      version: '0.1.0',
    },
  };
}

export function validateConfig(config: ServerConfig): void {
  if (!config.prestashop.url) {
    throw new Error('PrestaShop URL is required');
  }

  if (!config.prestashop.apiKey) {
    throw new Error('PrestaShop API key is required');
  }

  try {
    new URL(config.prestashop.url);
  } catch {
    throw new Error('Invalid PrestaShop URL format');
  }
} 