# Promokit Prestashop MCP Server

## Installation

...

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