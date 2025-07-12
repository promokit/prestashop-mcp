# Promokit Prestashop MCP Server

## System Requirements

- **Node.js 20.0.0 or higher** (recommended: latest LTS version)
- Claude Desktop

## Installation

### 1. Clone the Repository

```bash
git clone https://github.com/promokit/prestashop-mcp.git
cd prestashop-mcp
```

### 2. Install Dependencies

```bash
npm install
```

### 3. Configure Environment Variables

Create a `.env` file in the project root:

```bash
cp .env.example .env
```

Edit the `.env` file with your configuration:

```env
API_KEY=your-api-key-here
API_URL=https://your-api-endpoint.com
```

### 4. Build the Project

For TypeScript projects:
```bash
npm run build
```

### 5. Test the Server

Run the server locally to verify it works:

```bash
npm start
```

Or for development mode:
```bash
npm run dev
```

## Adding MCP Server to Claude Desktop

### 1. Locate the Configuration File

Find `claude_desktop_config.json` in your system's config directory:

- **Windows**: `%APPDATA%\Claude\claude_desktop_config.json`
- **macOS**: `~/Library/Application Support/Claude/claude_desktop_config.json`
- **Linux**: `~/.config/Claude/claude_desktop_config.json`

### 2. Edit the Configuration

Open the config file in a text editor and add your MCP server configuration:

```json
{
  "mcpServers": {
    "prestashop": {
      "command": "node",
      "args": ["/path/to/build/index.js"]
    }
  }
}
```

### 3. Restart Claude Desktop

Close and reopen the application for changes to take effect.

### 4. Verify Connection

Check that your MCP server appears in Claude Desktop's interface and is functioning properly.

---

**Note**: The MCP server must be compatible with the Model Context Protocol specification and properly configured to work with Claude Desktop.