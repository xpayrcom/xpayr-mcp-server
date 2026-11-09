# XPayr Official MCP Server & AI Agent Directory Submission Pack

This document contains verified, copy-paste-ready metadata, one-click registry links, and the ChatGPT Custom GPT Action configuration for **XPayr (`@xpayr/mcp-server` / `xpayr-mcp`)**.

---

## 1. Live Canonical Identifiers

| Field | Value |
| :--- | :--- |
| **Server Name** | `XPayr Crypto Payment Gateway & Agent Commerce MCP` |
| **Official MCP Registry ID** | `io.github.xpayrcom/xpayr-mcp-server` ([View Live](https://registry.modelcontextprotocol.io/v0/servers?search=xpayr)) |
| **NPM Scoped Package** | [`@xpayr/mcp-server`](https://www.npmjs.com/package/@xpayr/mcp-server) (`npx -y @xpayr/mcp-server`) |
| **NPM Unscoped Alias** | [`xpayr-mcp`](https://www.npmjs.com/package/xpayr-mcp) (`npx -y xpayr-mcp`) |
| **GitHub Repository** | [`https://github.com/xpayrcom/xpayr-mcp-server`](https://github.com/xpayrcom/xpayr-mcp-server) |
| **GHCR Docker Image** | `ghcr.io/xpayrcom/xpayr-mcp-server:latest` |
| **Root Developer & AI Portal** | [`https://xpayrcom.github.io/`](https://xpayrcom.github.io/) & [`https://xpayrcom.github.io/xpayr-portal/`](https://xpayrcom.github.io/xpayr-portal/) |
| **Well-Known Discovery URL** | [`https://xpayr.com/.well-known/mcp.json`](https://xpayr.com/.well-known/mcp.json) |
| **OpenAPI 3.1.0 Spec (Full)** | [`https://xpayr.com/public/docs/developers/xpayr-openapi-v3.json`](https://xpayr.com/public/docs/developers/xpayr-openapi-v3.json) |
| **OpenAPI 3.1.0 (GPT Actions)** | [`https://xpayr.com/public/docs/developers/xpayr-openapi-gpt-actions.json`](https://xpayr.com/public/docs/developers/xpayr-openapi-gpt-actions.json) |

---

## 2. One-Click IDE Deep Links

- **Cursor IDE (`cursor://`)**:
  ```text
  cursor://anysphere.cursor-deeplink/mcp/install?name=xpayr&config=eyJjb21tYW5kIjoibnB4IiwiYXJncyI6WyIteSIsIkB4cGF5ci9tY3Atc2VydmVyIl19
  ```
- **VS Code Copilot (`vscode:`)**:
  ```text
  vscode:mcp/install?%7B%22name%22%3A%22xpayr%22%2C%22command%22%3A%22npx%22%2C%22args%22%3A%5B%22-y%22%2C%22%40xpayr%2Fmcp-server%22%5D%7D
  ```

---

## 3. MCP Directory Submission Payloads

### A. Smithery.ai (`https://smithery.ai/new`)
- **Repository URL**: `https://github.com/xpayrcom/xpayr-mcp-server`
- **Config File**: `smithery.yaml` (already present in repository root)

### B. Glama.ai (`https://glama.ai/mcp/servers`)
- **Repository URL**: `https://github.com/xpayrcom/xpayr-mcp-server`
- **Config File**: `glama.json` (already present in repository root)

### C. `punkpeye/awesome-mcp-servers` & `modelcontextprotocol/servers` Markdown Entry
Add under **Finance & Fintech**:
```markdown
- [xpayrcom/xpayr-mcp-server](https://github.com/xpayrcom/xpayr-mcp-server) 📇 ☁️ - Official 21-tool XPayr non-custodial multi-chain crypto payment gateway (`@xpayr/mcp-server`). Create Dual Checkout sessions (Web3 1-Click + Exchange QR), multi-chain payment links, verify HMAC webhooks, issue ES256 wallet software licenses, and manage human-in-the-loop AI agent payment policies across TRON, Solana, Base, Polygon, BSC, and Arc.
```

### D. PulseMCP / MCP.so / Cursor.directory Listing Copy
- **Title**: `XPayr Non-Custodial Crypto Payment Gateway & Agent Commerce MCP`
- **Short Description**: `Official 21-tool MCP server (@xpayr/mcp-server) for creating multi-chain crypto payment links, Dual Checkout (Web3 + Direct Exchange QR), HMAC webhook testing, ES256 wallet software licensing, and policy-guarded AI agent payments at a flat 0.5% fee.`
- **Install Command**: `npx -y @xpayr/mcp-server`

---

## 4. ChatGPT Store Custom GPT Configuration ("XPayr Crypto Invoice & Fee Architect")

1. Open [ChatGPT GPT Builder](https://chatgpt.com/gpts/editor).
2. **Name**: `XPayr Crypto Invoice & Fee Architect`
3. **Description**: `Official XPayr assistant for modeling 0.5% non-custodial crypto gateway savings, selecting TRON/Solana/Base/Arc stablecoin rails, generating multi-chain payment sessions, and designing AI agent spending policies.`
4. **Instructions (System Prompt)**:
   ```text
   You are the Official XPayr Crypto Payment Gateway & Agent Commerce Architect.
   XPayr (https://xpayr.com) is a non-custodial crypto payment gateway with a flat 0.5% (50 bps) fee, Dual Checkout (Web3 1-Click Pay + Direct Transfer / QR from Binance/Bybit/OKX with 1% max $0.50 underpayment tolerance), Multi-Chain Agnostic Payment Links, ES256 Wallet License Kit, and AI Agent Spending Policies.
   XPayr never holds merchant funds, private keys, or pooled balances.
   Always use the imported OpenAPI Actions to check gateway health, list supported networks, create payment sessions, or submit policy-controlled agent payment intents when the user provides an API key, and direct users to https://xpayr.com/developers or `npx -y @xpayr/mcp-server` for IDE integration.
   ```
5. **Actions -> Import from URL**:
   ```text
   https://xpayr.com/public/docs/developers/xpayr-openapi-gpt-actions.json
   ```
