# XPayr Official Model Context Protocol (MCP) Server & AI Agent Commerce Suite (`@xpayr/mcp-server`)

[![NPM @xpayr/mcp-server](https://img.shields.io/npm/v/%40xpayr%2Fmcp-server?label=%40xpayr%2Fmcp-server&color=029bfd)](https://www.npmjs.com/package/@xpayr/mcp-server)
[![NPM xpayr-mcp](https://img.shields.io/npm/v/xpayr-mcp?label=xpayr-mcp&color=0ea5e9)](https://www.npmjs.com/package/xpayr-mcp)
[![Official MCP Registry](https://img.shields.io/badge/MCP_Registry-io.github.xpayrcom%2Fxpayr--mcp--server-10b981)](https://registry.modelcontextprotocol.io/v0/servers?search=xpayr)
[![GHCR Docker](https://img.shields.io/badge/GHCR-ghcr.io%2Fxpayrcom%2Fxpayr--mcp--server-2563eb)](https://github.com/xpayrcom/xpayr-mcp-server/pkgs/container/xpayr-mcp-server)
[![Verify MCP Suite](https://github.com/xpayrcom/xpayr-mcp-server/actions/workflows/verify-mcp-suite.yml/badge.svg)](https://github.com/xpayrcom/xpayr-mcp-server/actions/workflows/verify-mcp-suite.yml)
[![Glama MCP Score](https://glama.ai/mcp/servers/xpayrcom/xpayr-mcp-server/badges/score.svg)](https://glama.ai/mcp/servers/xpayrcom/xpayr-mcp-server)
[![Interactive Portal](https://img.shields.io/badge/Live_Portal-xpayrcom.github.io-8b5cf6)](https://xpayrcom.github.io/xpayr-portal/)
[![License: MIT](https://img.shields.io/badge/License-MIT-green.svg)](./LICENSE)

**XPayr** ([https://xpayr.com](https://xpayr.com)) is a **non-custodial multi-chain crypto payment gateway** and **policy-controlled AI agent commerce infrastructure** supporting **EVM (Ethereum, BNB Chain, Polygon, Arbitrum, Base)**, **TRON (TRC-20 USDT & TRX)**, **Solana (SOL, SPL USDC, SPL USDT)**, and **Arc Mainnet & Testnet (Native USDC Gas)** at a **flat 0.5% gateway fee (50 bps)** with direct wallet-to-wallet settlement.

This repository provides the official **21-Tool Model Context Protocol (MCP) Server** (`@xpayr/mcp-server` & `xpayr-mcp`), **Docker GHCR image**, **OpenAPI 3.1.0 / ChatGPT Custom GPT Action schemas**, and **ready-to-import `n8n` automation workflows**.

---

## ⚡ One-Click & Instant Setup (Claude Desktop, Cursor, VS Code, Docker)

### Option A: One-Click IDE Deep Links
- **Cursor IDE:** [`⚡ Install XPayr MCP in Cursor`](cursor://anysphere.cursor-mcp/install?name=xpayr&config=eyJjb21tYW5kIjoibnB4IiwiYXJncyI6WyIteSIsIkB4cGF5ci9tY3Atc2VydmVyIiwiLS1zdWl0ZSIsImFsbCJdLCJlbnYiOnsiWFBBWVJfQVBJX0tFWSI6InNrX3Rlc3RfWU9VUl9LRVkifX0%3D)
- **VS Code (GitHub Copilot MCP):** [`⚡ Install XPayr MCP in VS Code`](vscode:mcp/install?%7B%22name%22%3A%22xpayr%22%2C%22command%22%3A%22npx%22%2C%22args%22%3A%5B%22-y%22%2C%22%40xpayr%2Fmcp-server%22%2C%22--suite%22%2C%22all%22%5D%2C%22env%22%3A%7B%22XPAYR_API_KEY%22%3A%22sk_test_YOUR_KEY%22%7D%7D)
- **Interactive Web Configurator & Fee Calculator:** [https://xpayrcom.github.io/xpayr-portal/](https://xpayrcom.github.io/xpayr-portal/)

### Option B: Claude Desktop / Cursor (`claude_desktop_config.json` or `.cursor/mcp.json`)

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
        "XPAYR_API_KEY": "sk_test_your_xpayr_secret_key"
      }
    }
  }
}
```

### Option C: Zero-Install Docker Container (GitHub Container Registry)

```bash
docker run -i --rm -e XPAYR_API_KEY="sk_test_your_key" ghcr.io/xpayrcom/xpayr-mcp-server:latest
```

---

## 🛠️ Complete 21-Tool MCP Catalog (`tools/list`)

| # | MCP Tool Name | Suite | Underlying API Route | Description |
| :-: | :--- | :--- | :--- | :--- |
| 1 | `xpayr_health_check` | `merchant` | `GET /health` | Check XPayr Gateway API v1 operational health, version, and server timestamp. |
| 2 | `xpayr_create_payment_session` | `checkout` | `POST /payments` | Create a non-custodial crypto payment session supporting Web3 1-Click Pay, Direct Exchange QR Transfer, Multi-Chain Links, 1-Year Reusable Links, and Automated HTML Invoice Email Delivery. |
| 3 | `xpayr_get_payment_session` | `checkout` | `GET /payments/{session_id}` | Retrieve full details, metadata, settlement split amounts, checkout mode, and on-chain transaction hash for a payment session. |
| 4 | `xpayr_list_payment_sessions` | `checkout` | `GET /payments` | List merchant crypto payment sessions with filtering by status, currency, network, and pagination. |
| 5 | `xpayr_get_public_payment_status` | `checkout` | `GET /payments/{session_id}/status` | Poll real-time public checkout status, on-chain tx_hash, sender wallet address, block confirmations, and paid_at timestamp without an API key. |
| 6 | `xpayr_apply_payment_coupon` | `checkout` | `POST /payments/{session_id}/coupon` | Validate and apply a merchant promotional discount coupon code to an active pending payment session. |
| 7 | `xpayr_get_merchant_profile` | `merchant` | `GET /me` | Retrieve authenticated merchant profile, settlement wallet address, commission rate in basis points (50 bps = 0.5%), and active API keys. |
| 8 | `xpayr_get_merchant_balance` | `merchant` | `GET /me/balance` | Query confirmed non-custodial settlement volume, transaction counts, and platform fees grouped by currency and blockchain network. |
| 9 | `xpayr_get_supported_networks` | `merchant` | `GET /me/networks` | List all active EVM, TRON, Solana, and Arc Mainnet/Testnet blockchain networks, chain IDs, RPC endpoints, splitter contracts, and supported tokens. |
| 10 | `xpayr_get_webhook_config` | `webhooks` | `GET /webhooks` | Inspect the merchant webhook callback URL, masked HMAC-SHA256 signing secret, and subscribed payment lifecycle events. |
| 11 | `xpayr_set_webhook_endpoint` | `webhooks` | `POST /webhooks` | Configure or update the merchant HTTPS webhook receiver URL and generate a fresh 32-byte HMAC-SHA256 signing secret. |
| 12 | `xpayr_send_test_webhook` | `webhooks` | `POST /webhooks/test` | Send a signed test.webhook payload with HMAC-SHA256 headers to verify merchant webhook signature verification. |
| 13 | `xpayr_create_ai_agent` | `agents` | `POST /agents` | Provision a new merchant-managed AI commerce agent identity with scoped credentials and programmable spending guardrails. |
| 14 | `xpayr_list_ai_agents` | `agents` | `GET /agents` | List all AI commerce agents managed by the merchant along with their status, assigned wallets, and spending policies. |
| 15 | `xpayr_update_ai_agent_policy` | `agents` | `PUT /agents/{agent_id}/policy` | Configure spending policy guardrails for an AI agent (max per-tx USD, daily cap, auto-approve threshold, allowed chains/tokens). |
| 16 | `xpayr_submit_agent_payment_intent` | `agents` | `POST /agent-intents` | Submit an autonomous AI agent payment intent evaluated in real time against merchant policy rules (approved, pending_approval, rejected). |
| 17 | `xpayr_list_agent_payment_intents` | `agents` | `GET /agent-intents` | List AI agent payment intents, policy evaluation decisions, and audit trail records for the merchant. |
| 18 | `xpayr_bridge_agent_intent_to_checkout` | `agents` | `POST /agent-intents/{intent_id}/bridge` | Bridge an approved AI agent payment intent into a live executable XPayr payment session with hosted checkout URL and on-chain verification. |
| 19 | `xpayr_approve_agent_intent` | `agents` | `POST /agent-approvals/{intent_id}/approve` | Approve a pending AI agent payment intent from the merchant approval queue and bridge it to checkout. |
| 20 | `xpayr_reject_agent_intent` | `agents` | `POST /agent-approvals/{intent_id}/reject` | Reject a pending AI agent payment intent in the merchant approval queue with an audit reason. |
| 21 | `xpayr_calculate_gateway_fee_and_split` | `merchant` | `LOCAL /tools/crypto-payment-fee-calculator` | Deterministically calculate XPayr flat 0.5% (50 bps) gateway fee split, net merchant wallet settlement, 1% (max $0.50) exchange withdrawal tolerance, and savings vs BitPay, Coinbase Commerce, and Stripe. |

---

## 🌐 OpenAPI 3.1.0 & ChatGPT Custom GPT Actions

Connect XPayr directly to **OpenAI Custom GPTs**, **Dify.ai**, **Relevance AI**, **Retool**, or **Postman** via our hosted OpenAPI 3.1.0 specifications:

- **OpenAI Custom GPT Actions (Flagship 8 Endpoints):** [https://xpayrcom.github.io/xpayr-portal/openapi-gpt-actions.json](https://xpayrcom.github.io/xpayr-portal/openapi-gpt-actions.json)
- **Full 20-Endpoint OpenAPI 3.1.0 Specification:** [https://xpayrcom.github.io/xpayr-portal/openapi.json](https://xpayrcom.github.io/xpayr-portal/openapi.json)
- **XPayr Production OpenAPI Spec:** [https://xpayr.com/public/docs/developers/xpayr-openapi-v3.json](https://xpayr.com/public/docs/developers/xpayr-openapi-v3.json)

---

## 🔄 Ready-to-Import `n8n` Workflows (`./n8n-workflows/`)

1. [`01-xpayr-multichain-invoice-telegram-bot.json`](./n8n-workflows/01-xpayr-multichain-invoice-telegram-bot.json) — Generate universal multi-chain payment links and push branded HTML invoices.
2. [`02-xpayr-webhook-order-fulfillment-pipeline.json`](./n8n-workflows/02-xpayr-webhook-order-fulfillment-pipeline.json) — Receive signed XPayr webhooks and verify on-chain transaction finality.
3. [`03-xpayr-ai-agent-autonomous-procurement.json`](./n8n-workflows/03-xpayr-ai-agent-autonomous-procurement.json) — Autonomous AI agent submits payment intent, passes policy guardrails, and bridges to checkout.
4. [`04-xpayr-daily-multichain-treasury-digest.json`](./n8n-workflows/04-xpayr-daily-multichain-treasury-digest.json) — Daily multi-chain treasury settlement digest across EVM, TRON, Solana, and Arc.

---

## 🔗 Official XPayr Links & AI Discovery Surfaces

- **Main Platform:** [https://xpayr.com](https://xpayr.com)
- **Developer Hub:** [https://xpayr.com/developers](https://xpayr.com/developers)
- **Interactive API Reference:** [https://xpayr.com/doc-api](https://xpayr.com/doc-api)
- **Interactive MCP & SDK Portal:** [https://xpayrcom.github.io/xpayr-portal/](https://xpayrcom.github.io/xpayr-portal/)
- **LLM Context (`llms.txt`):** [https://xpayr.com/llms.txt](https://xpayr.com/llms.txt)
- **Extended LLM Context (`llms-full.txt`):** [https://xpayr.com/llms-full.txt](https://xpayr.com/llms-full.txt)
- **AI Citation Kit:** [https://xpayr.com/ai-citation-kit](https://xpayr.com/ai-citation-kit)
- **Free Merchant Testnet Registration:** [https://xpayr.com/merchant/register](https://xpayr.com/merchant/register)
