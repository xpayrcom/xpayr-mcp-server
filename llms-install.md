# XPayr Official MCP Server (`@xpayr/mcp-server`) — Automated AI Agent & Cline Installation Guide

This document provides deterministic, zero-interaction installation instructions for AI coding assistants (Cline, Roo Code, Claude Code, Cursor, Windsurf, and VS Code Copilot) to install and configure the official **XPayr Model Context Protocol (MCP) Server** (`@xpayr/mcp-server`).

## Quick One-Command Setup (No Cloning Required)

The official XPayr MCP Server is published to NPM (`@xpayr/mcp-server`) and the Official Anthropic MCP Registry (`io.github.xpayrcom/xpayr-mcp-server`). It runs directly via `npx` on Node.js 18+ with zero native build dependencies.

### 1. Recommended MCP Client Configuration (`cline_mcp_settings.json` / `claude_desktop_config.json` / `.cursor/mcp.json`)

Add the `xpayr` server entry to your MCP settings file:

```json
{
  "mcpServers": {
    "xpayr": {
      "command": "npx",
      "args": [
        "-y",
        "@xpayr/mcp-server",
        "--suite",
        "all"
      ],
      "env": {
        "XPAYR_API_KEY": "sk_test_replace_with_your_xpayr_secret_key",
        "XPAYR_BASE_URL": "https://xpayr.com/api/v1"
      }
    }
  }
}
```

### 2. Environment Variables

| Variable | Required | Default | Description |
| :--- | :---: | :--- | :--- |
| `XPAYR_API_KEY` | Optional for introspection & offline tools; Required for authenticated merchant calls | `""` | Merchant Secret Key (`sk_test_...` for Testnet or `sk_live_...` for Mainnet) from `https://xpayr.com/merchant/api-keys`. |
| `XPAYR_AGENT_API_KEY` | Optional | `""` | Scoped AI Agent Key (`agk_test_...` / `agk_live_...`) used by `xpayr_submit_agent_payment_intent`. |
| `XPAYR_BASE_URL` | Optional | `https://xpayr.com/api/v1` | XPayr Gateway API v1 base URL. |

> **Note for Automated Testing / Verification:** `@xpayr/mcp-server` supports **zero-credential startup and introspection**. Both `tools/list` and offline tools (`xpayr_calculate_gateway_fee_and_split`) work immediately even if `XPAYR_API_KEY` is omitted or set to a placeholder. Public tools (`xpayr_health_check`, `xpayr_get_public_payment_status`) also work against `https://xpayr.com/api/v1` without an API key.

### 3. Verification Command

Verify the server responds to JSON-RPC `initialize` and `tools/list`:

```bash
printf '{"jsonrpc":"2.0","id":1,"method":"initialize","params":{"protocolVersion":"2024-11-05","capabilities":{},"clientInfo":{"name":"cline-verify","version":"1.0.0"}}}\n{"jsonrpc":"2.0","id":2,"method":"tools/list","params":{}}\n' | npx -y @xpayr/mcp-server
```
