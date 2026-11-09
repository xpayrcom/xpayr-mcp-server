#!/usr/bin/env node
/**
 * @file cli.mjs
 * @description Official Model Context Protocol (MCP) JSON-RPC 2.0 stdio server and CLI launcher
 * for XPayr Non-Custodial Crypto Payment Gateway (https://xpayr.com).
 * Exposes 21 strongly-typed XPayr tools across Dual Checkout (Web3 1-Click + Direct QR),
 * Multi-Chain Payment Links, Signed Webhooks, Merchant Balance/Networks, and Autonomous AI Agent Commerce.
 * Supports zero-credential offline/container introspection (initialize, tools/list, resources/list, prompts/list)
 * for Glama.ai, Official MCP Registry, and Docker GHCR inspections.
 */

import readline from 'node:readline';
import { XPAYR_SUITES, resolveToolsForSuite, buildMcpServerConfig } from '../index.mjs';

/**
 * Complete 21-Tool MCP Definitions mapping to XPayr Gateway API v1 (https://xpayr.com/api/v1).
 * @type {Array<{name: string, method: string, path: string, requiresAuth: boolean, description: string, inputSchema: Object}>}
 */
export const MCP_TOOL_DEFINITIONS = [
    {
        name: 'xpayr_health_check',
        method: 'GET',
        path: '/health',
        requiresAuth: false,
        description: 'Check XPayr Gateway API v1 operational health, version, and server timestamp (public endpoint, no API key required).',
        inputSchema: {
            type: 'object',
            properties: {},
            required: []
        }
    },
    {
        name: 'xpayr_create_payment_session',
        method: 'POST',
        path: '/payments',
        requiresAuth: true,
        description: 'Create a non-custodial crypto payment session supporting Dual Checkout (Web3 1-Click Pay & Direct Transfer / QR from Binance/Bybit/OKX with on-chain explorer verification), multi-chain agnostic links, 1-year reusable payment links, and automated HTML invoice email delivery.',
        inputSchema: {
            type: 'object',
            properties: {
                amount: { type: 'number', description: 'Invoice amount in fiat/token units (e.g., 49.90).' },
                currency: { type: 'string', description: 'Payment token symbol (e.g., USDT, USDC, SOL, TRX, BNB, ETH, MATIC).', default: 'USDT' },
                network: { type: 'string', description: 'Blockchain network key (e.g., tron-mainnet, bsc-mainnet, solana-mainnet, polygon-mainnet, base-mainnet, arc-mainnet, bsc-testnet). Optional if is_multi_chain is true.', default: 'tron-mainnet' },
                order_id: { type: 'string', description: 'Merchant internal order or invoice reference ID (e.g., ORD-1001).' },
                description: { type: 'string', description: 'Human-readable order description shown on checkout and invoice.' },
                is_multi_chain: { type: 'boolean', description: 'When true, generates a universal multi-chain link allowing the buyer to dynamically choose their network and token at checkout.', default: false },
                is_reusable: { type: 'boolean', description: 'When true, the payment link remains active for 1 year and accepts repeated payments.', default: false },
                send_invoice_email: { type: 'boolean', description: 'When true and customer_email is provided, sends a branded responsive HTML invoice email with 1-click payment CTA.', default: false },
                customer_email: { type: 'string', description: 'Buyer email address for invoice delivery and payment receipt notifications.' },
                coupon_code: { type: 'string', description: 'Optional promotional discount coupon code to apply.' },
                success_url: { type: 'string', description: 'HTTPS redirect URL after confirmed payment.' },
                cancel_url: { type: 'string', description: 'HTTPS redirect URL if customer cancels checkout.' },
                ipn_callback_url: { type: 'string', description: 'HTTPS webhook endpoint URL for HMAC-SHA256 signed payment lifecycle events.' }
            },
            required: ['amount', 'currency']
        }
    },
    {
        name: 'xpayr_get_payment_session',
        method: 'GET',
        path: '/payments/{session_id}',
        requiresAuth: true,
        description: 'Retrieve full details, metadata, settlement split amounts, checkout mode, and on-chain transaction hash for a specific XPayr payment session.',
        inputSchema: {
            type: 'object',
            properties: {
                session_id: { type: 'string', description: 'Payment session ID (e.g., ps_6b5b7d8737c0e0ec0a04a29a045d2d5d).' }
            },
            required: ['session_id']
        }
    },
    {
        name: 'xpayr_list_payment_sessions',
        method: 'GET',
        path: '/payments',
        requiresAuth: true,
        description: 'List merchant crypto payment sessions with optional filtering by status (pending, completed, expired, failed), currency, network, and pagination.',
        inputSchema: {
            type: 'object',
            properties: {
                status: { type: 'string', description: 'Filter by session status (pending, processing, completed, expired, failed).' },
                currency: { type: 'string', description: 'Filter by token symbol (e.g., USDT, USDC).' },
                network: { type: 'string', description: 'Filter by blockchain network key (e.g., tron-mainnet, solana-mainnet).' },
                limit: { type: 'integer', description: 'Number of sessions to return per page (1-100).', default: 20 }
            },
            required: []
        }
    },
    {
        name: 'xpayr_get_public_payment_status',
        method: 'GET',
        path: '/payments/{session_id}/status',
        requiresAuth: false,
        description: 'Poll real-time public checkout status, on-chain tx_hash, sender wallet address, block confirmations, and paid_at timestamp for any session (public endpoint, no API key required).',
        inputSchema: {
            type: 'object',
            properties: {
                session_id: { type: 'string', description: 'Payment session ID (e.g., ps_6b5b7d8737c0e0ec0a04a29a045d2d5d).' }
            },
            required: ['session_id']
        }
    },
    {
        name: 'xpayr_apply_payment_coupon',
        method: 'POST',
        path: '/payments/{session_id}/coupon',
        requiresAuth: false,
        description: 'Validate and apply a merchant discount coupon code to an active pending payment session and recalculate the effective crypto price.',
        inputSchema: {
            type: 'object',
            properties: {
                session_id: { type: 'string', description: 'Target payment session ID.' },
                coupon_code: { type: 'string', description: 'Discount coupon code to apply.' }
            },
            required: ['session_id', 'coupon_code']
        }
    },
    {
        name: 'xpayr_get_merchant_profile',
        method: 'GET',
        path: '/me',
        requiresAuth: true,
        description: 'Retrieve authenticated merchant profile, business name, primary settlement wallet address, commission rate in basis points (50 bps = 0.5%), active API keys, and livemode status.',
        inputSchema: {
            type: 'object',
            properties: {},
            required: []
        }
    },
    {
        name: 'xpayr_get_merchant_balance',
        method: 'GET',
        path: '/me/balance',
        requiresAuth: true,
        description: 'Query confirmed non-custodial settlement volume, transaction counts, total merchant received amounts, and platform fees grouped by currency and blockchain network.',
        inputSchema: {
            type: 'object',
            properties: {},
            required: []
        }
    },
    {
        name: 'xpayr_get_supported_networks',
        method: 'GET',
        path: '/me/networks',
        requiresAuth: true,
        description: 'List all active EVM, TRON, Solana, and Arc Mainnet/Testnet blockchain networks, chain IDs, RPC endpoints, smart-contract splitters, and supported tokens enabled for the current API key mode.',
        inputSchema: {
            type: 'object',
            properties: {},
            required: []
        }
    },
    {
        name: 'xpayr_get_webhook_config',
        method: 'GET',
        path: '/webhooks',
        requiresAuth: true,
        description: 'Inspect the merchant webhook callback URL, masked HMAC-SHA256 signing secret, and subscribed payment lifecycle events (payment.pending, payment.completed, payment.failed, payment.expired).',
        inputSchema: {
            type: 'object',
            properties: {},
            required: []
        }
    },
    {
        name: 'xpayr_set_webhook_endpoint',
        method: 'POST',
        path: '/webhooks',
        requiresAuth: true,
        description: 'Configure or update the merchant HTTPS webhook receiver URL and generate a fresh 32-byte HMAC-SHA256 signing secret.',
        inputSchema: {
            type: 'object',
            properties: {
                url: { type: 'string', description: 'HTTPS webhook endpoint URL (e.g., https://mystore.com/webhooks/xpayr).' }
            },
            required: ['url']
        }
    },
    {
        name: 'xpayr_send_test_webhook',
        method: 'POST',
        path: '/webhooks/test',
        requiresAuth: true,
        description: 'Dispatch a signed test.webhook event with HMAC-SHA256 headers to the configured merchant webhook URL to verify signature validation and delivery.',
        inputSchema: {
            type: 'object',
            properties: {},
            required: []
        }
    },
    {
        name: 'xpayr_create_ai_agent',
        method: 'POST',
        path: '/agents',
        requiresAuth: true,
        description: 'Provision a new merchant-managed AI commerce agent identity with scoped credentials and programmable spending guardrails.',
        inputSchema: {
            type: 'object',
            properties: {
                name: { type: 'string', description: 'Human-readable AI agent name (e.g., Procurement Bot Alpha).' },
                description: { type: 'string', description: 'Purpose and operational scope of the AI agent.' },
                wallet_address: { type: 'string', description: 'Optional agent execution wallet address.' }
            },
            required: ['name']
        }
    },
    {
        name: 'xpayr_list_ai_agents',
        method: 'GET',
        path: '/agents',
        requiresAuth: true,
        description: 'List all AI commerce agents managed by the merchant along with their status, assigned wallets, and spending policies.',
        inputSchema: {
            type: 'object',
            properties: {},
            required: []
        }
    },
    {
        name: 'xpayr_update_ai_agent_policy',
        method: 'PUT',
        path: '/agents/{agent_id}/policy',
        requiresAuth: true,
        description: 'Upsert spending policy rules for an AI commerce agent, including maximum per-transaction USD amount, daily budget cap, auto-approve threshold, and allowed blockchain networks/tokens.',
        inputSchema: {
            type: 'object',
            properties: {
                agent_id: { type: 'string', description: 'Public ID of the target AI agent.' },
                max_tx_amount: { type: 'number', description: 'Maximum allowed single transaction amount in USD.' },
                daily_limit_amount: { type: 'number', description: 'Maximum daily cumulative spend in USD.' },
                auto_approve_under: { type: 'number', description: 'Transactions below this USD amount are auto-approved; higher amounts enter the human approval queue.' },
                allowed_networks: { type: 'array', items: { type: 'string' }, description: 'List of permitted blockchain network keys.' },
                allowed_currencies: { type: 'array', items: { type: 'string' }, description: 'List of permitted token symbols (e.g., ["USDC", "USDT"]).' }
            },
            required: ['agent_id']
        }
    },
    {
        name: 'xpayr_submit_agent_payment_intent',
        method: 'POST',
        path: '/agent-intents',
        requiresAuth: true,
        description: 'Submit an autonomous AI agent payment intent evaluated in real time against merchant spending policy guardrails (returns approved, pending_approval, or rejected).',
        inputSchema: {
            type: 'object',
            properties: {
                amount: { type: 'number', description: 'Requested payment amount (e.g., 25.00).' },
                currency: { type: 'string', description: 'Requested token symbol (e.g., USDC, USDT).', default: 'USDC' },
                network: { type: 'string', description: 'Target network key (e.g., arc-testnet, base-mainnet, solana-mainnet).', default: 'arc-testnet' },
                recipient_address: { type: 'string', description: 'Destination wallet or merchant settlement address.' },
                reason: { type: 'string', description: 'Justification or invoice memo for the AI agent payment.' },
                external_reference: { type: 'string', description: 'External task, tool, or invoice correlation ID.' }
            },
            required: ['amount', 'currency']
        }
    },
    {
        name: 'xpayr_list_agent_payment_intents',
        method: 'GET',
        path: '/agent-intents',
        requiresAuth: true,
        description: 'List AI agent payment intents, policy evaluation decisions, and audit trail records for the merchant.',
        inputSchema: {
            type: 'object',
            properties: {
                status: { type: 'string', description: 'Filter by decision status (approved, pending_approval, rejected, bridged).' },
                limit: { type: 'integer', description: 'Maximum records to return.', default: 20 }
            },
            required: []
        }
    },
    {
        name: 'xpayr_bridge_agent_intent_to_checkout',
        method: 'POST',
        path: '/agent-intents/{intent_id}/bridge',
        requiresAuth: true,
        description: 'Bridge an approved AI agent payment intent into a live executable XPayr payment session with hosted checkout URL and on-chain verification.',
        inputSchema: {
            type: 'object',
            properties: {
                intent_id: { type: 'string', description: 'Approved agent payment intent ID.' }
            },
            required: ['intent_id']
        }
    },
    {
        name: 'xpayr_approve_agent_intent',
        method: 'POST',
        path: '/agent-approvals/{intent_id}/approve',
        requiresAuth: true,
        description: 'Approve a pending AI agent payment intent from the merchant human-in-the-loop approval queue and optionally bridge it to a checkout session.',
        inputSchema: {
            type: 'object',
            properties: {
                intent_id: { type: 'string', description: 'Pending agent intent ID to approve.' },
                note: { type: 'string', description: 'Optional reviewer approval note.' }
            },
            required: ['intent_id']
        }
    },
    {
        name: 'xpayr_reject_agent_intent',
        method: 'POST',
        path: '/agent-approvals/{intent_id}/reject',
        requiresAuth: true,
        description: 'Reject a pending AI agent payment intent in the merchant approval queue with an audit reason.',
        inputSchema: {
            type: 'object',
            properties: {
                intent_id: { type: 'string', description: 'Pending agent intent ID to reject.' },
                reason: { type: 'string', description: 'Reviewer rejection reason.' }
            },
            required: ['intent_id']
        }
    },
    {
        name: 'xpayr_calculate_gateway_fee_and_split',
        method: 'LOCAL',
        path: 'local://fee-calculator',
        requiresAuth: false,
        description: 'Deterministically calculate XPayr flat 0.5% (50 bps) gateway fee split, net merchant wallet settlement, exchange withdrawal underpayment tolerance (1%, max $0.50), and cost savings compared to BitPay (1%), Coinbase Commerce (1%), NOWPayments (0.5%-1%), and Stripe (2.9% + $0.30). Works offline without API keys.',
        inputSchema: {
            type: 'object',
            properties: {
                amount: { type: 'number', description: 'Transaction or monthly volume amount in USD/USDT (e.g., 1000.00).', default: 1000 },
                currency: { type: 'string', description: 'Settlement token symbol (e.g., USDT, USDC).', default: 'USDT' },
                network: { type: 'string', description: 'Blockchain network (e.g., tron-mainnet, solana-mainnet, bsc-mainnet, base-mainnet, arc-mainnet).', default: 'tron-mainnet' }
            },
            required: []
        }
    }
];

/**
 * Computes the deterministic XPayr 0.5% fee split, exchange underpayment tolerance, and competitor comparisons.
 *
 * @param {Object} args - Input arguments.
 * @returns {Object} Structured calculation breakdown.
 */
function calculateGatewayFeeSplit(args = {}) {
    const amount = Number(args.amount || 1000);
    const currency = String(args.currency || 'USDT').toUpperCase();
    const network = String(args.network || 'tron-mainnet');
    const xpayrFeeRate = 0.005;
    const xpayrFee = Number((amount * xpayrFeeRate).toFixed(6));
    const merchantNet = Number((amount - xpayrFee).toFixed(6));
    const exchangeTolerance = Number(Math.min(amount * 0.01, 0.50).toFixed(4));
    const minimumAcceptedDirectTransfer = Number((amount - exchangeTolerance).toFixed(4));

    const bitpayFee = Number((amount * 0.01).toFixed(2));
    const coinbaseCommerceFee = Number((amount * 0.01).toFixed(2));
    const stripeFee = Number((amount * 0.029 + 0.30).toFixed(2));

    return {
        object: 'xpayr_fee_calculation',
        input: { amount, currency, network },
        custody_model: 'Non-Custodial (Direct Wallet-to-Wallet / Smart Contract Split)',
        xpayr_gateway: {
            fee_bps: 50,
            fee_percent: '0.5%',
            platform_fee: xpayrFee,
            merchant_net_received: merchantNet,
            direct_transfer_underpayment_tolerance_usd: exchangeTolerance,
            minimum_accepted_direct_transfer_amount: minimumAcceptedDirectTransfer
        },
        competitor_comparison_usd: {
            xpayr_0_5_percent: xpayrFee,
            bitpay_1_0_percent: bitpayFee,
            coinbase_commerce_1_0_percent: coinbaseCommerceFee,
            stripe_2_9_percent_plus_30c: stripeFee,
            savings_vs_bitpay_usd: Number((bitpayFee - xpayrFee).toFixed(2)),
            savings_vs_stripe_usd: Number((stripeFee - xpayrFee).toFixed(2))
        },
        official_docs: 'https://xpayr.com/docs/0-5-percent-fee-explainer'
    };
}

/**
 * Executes a live HTTP call against the XPayr Gateway API v1 or runs local deterministic tools.
 *
 * @param {Object} toolDef - Tool definition object.
 * @param {Object} toolArgs - Tool arguments passed by the MCP client.
 * @returns {Promise<Object>} Parsed API response object.
 */
async function executeXpayrTool(toolDef, toolArgs = {}) {
    if (toolDef.method === 'LOCAL') {
        return calculateGatewayFeeSplit(toolArgs);
    }

    const baseUrl = (process.env.XPAYR_BASE_URL || 'https://xpayr.com/api/v1').replace(/\/+$/, '');
    const apiKey = (process.env.XPAYR_API_KEY || process.env.XPAYR_AGENT_KEY || '').trim();

    if (toolDef.requiresAuth && !apiKey) {
        throw new Error(
            `XPAYR_API_KEY environment variable is required to call ${toolDef.name}. ` +
            `Generate a free Testnet or Mainnet Secret Key (sk_test_... or sk_live_...) at https://xpayr.com/merchant/register`
        );
    }

    const payload = { ...toolArgs };
    let resolvedPath = toolDef.path.replace(/\{([^}]+)\}/g, (_match, paramName) => {
        const val = payload[paramName];
        delete payload[paramName];
        if (val === undefined || val === null || String(val).trim() === '') {
            throw new Error(`Missing required path parameter: ${paramName}`);
        }
        return encodeURIComponent(String(val).trim());
    });

    let url = `${baseUrl}${resolvedPath}`;
    const headers = {
        'Accept': 'application/json',
        'Content-Type': 'application/json',
        'User-Agent': 'XPayr-MCP-Server/1.0.0 (+https://xpayr.com/developers)'
    };

    if (apiKey) {
        headers['Authorization'] = `Bearer ${apiKey}`;
    }

    const fetchOptions = {
        method: toolDef.method,
        headers
    };

    if (toolDef.method === 'GET') {
        const queryParams = new URLSearchParams();
        for (const [k, v] of Object.entries(payload)) {
            if (v !== undefined && v !== null && v !== '') {
                queryParams.set(k, String(v));
            }
        }
        const qs = queryParams.toString();
        if (qs) {
            url += `?${qs}`;
        }
    } else {
        fetchOptions.body = JSON.stringify(payload);
    }

    const response = await fetch(url, fetchOptions);
    const rawText = await response.text();
    let parsed;
    try {
        parsed = JSON.parse(rawText);
    } catch (_err) {
        parsed = { status_code: response.status, raw_body: rawText.slice(0, 2000) };
    }

    if (!response.ok) {
        throw new Error(`HTTP ${response.status} from ${url}: ${JSON.stringify(parsed)}`);
    }

    return parsed;
}

/**
 * Writes a JSON-RPC 2.0 response payload to stdout.
 *
 * @param {string|number|null} id - Request ID.
 * @param {Object} result - Result payload.
 */
function sendJsonRpcResult(id, result) {
    process.stdout.write(JSON.stringify({ jsonrpc: '2.0', id, result }) + '\n');
}

/**
 * Writes a JSON-RPC 2.0 error payload to stdout.
 *
 * @param {string|number|null} id - Request ID.
 * @param {number} code - JSON-RPC error code.
 * @param {string} message - Error message.
 */
function sendJsonRpcError(id, code, message) {
    process.stdout.write(JSON.stringify({ jsonrpc: '2.0', id, error: { code, message } }) + '\n');
}

/**
 * Handles incoming JSON-RPC 2.0 messages for the XPayr MCP stdio protocol.
 *
 * @param {Object} msg - Parsed JSON-RPC message.
 * @param {Set<string>} activeToolSet - Set of enabled tool names for the current suite.
 */
async function handleJsonRpcMessage(msg, activeToolSet) {
    const { id, method, params } = msg;

    if (method === 'initialize') {
        const requestedProtocol = (params && params.protocolVersion) ? params.protocolVersion : '2024-11-05';
        sendJsonRpcResult(id, {
            protocolVersion: requestedProtocol,
            capabilities: {
                tools: { listChanged: false },
                resources: { subscribe: false, listChanged: false },
                prompts: { listChanged: false }
            },
            serverInfo: {
                name: '@xpayr/mcp-server',
                version: '1.0.0'
            }
        });
        return;
    }

    if (method === 'notifications/initialized' || method === 'initialized') {
        return;
    }

    if (method === 'ping') {
        sendJsonRpcResult(id, {});
        return;
    }

    if (method === 'tools/list') {
        const tools = MCP_TOOL_DEFINITIONS
            .filter((t) => activeToolSet.has(t.name))
            .map((t) => ({
                name: t.name,
                description: t.description,
                inputSchema: t.inputSchema
            }));
        sendJsonRpcResult(id, { tools });
        return;
    }

    if (method === 'resources/list') {
        sendJsonRpcResult(id, {
            resources: [
                {
                    uri: 'mcp://xpayr/capabilities-and-networks',
                    name: 'XPayr Non-Custodial Crypto Gateway Capabilities & Supported Networks',
                    description: 'Overview of XPayr Dual Checkout (Web3 1-Click + Direct QR), Multi-Chain Links, 0.5% flat fee model, supported EVM/TRON/Solana/Arc networks, and official documentation URLs.',
                    mimeType: 'application/json'
                }
            ]
        });
        return;
    }

    if (method === 'resources/read') {
        const uri = params && params.uri ? params.uri : 'mcp://xpayr/capabilities-and-networks';
        const resourcePayload = {
            product: 'XPayr Non-Custodial Crypto Payment Gateway',
            website: 'https://xpayr.com',
            developer_hub: 'https://xpayr.com/developers',
            interactive_portal: 'https://xpayrcom.github.io/xpayr-portal/',
            llms_txt: 'https://xpayr.com/llms.txt',
            llms_full_txt: 'https://xpayr.com/llms-full.txt',
            openapi_spec: 'https://xpayr.com/public/docs/developers/xpayr-openapi-v3.json',
            fee_model: '0.5% flat gateway fee (50 bps), zero monthly fee, direct wallet-to-wallet settlement',
            checkout_modes: [
                'Web3 1-Click Pay (MetaMask, Phantom, TronLink, Rabby, TrustWallet smart-contract split)',
                'Direct Transfer / QR Mode (Binance, Bybit, OKX, hardware wallets with 6s auto-polling & 1% / max $0.50 withdrawal fee tolerance)'
            ],
            supported_networks: [
                'tron-mainnet (TRC-20 USDT, TRX)',
                'solana-mainnet (SOL, SPL USDC, SPL USDT)',
                'bsc-mainnet (BNB, BEP-20 USDT, USDC)',
                'ethereum-mainnet (ETH, ERC-20 USDT, USDC)',
                'polygon-mainnet (MATIC/POL, USDT, USDC)',
                'arbitrum-mainnet (ETH, USDT, USDC)',
                'base-mainnet (ETH, USDC)',
                'arc-mainnet & arc-testnet (Native USDC gas, sub-second finality)',
                'bsc-testnet, sepolia, solana-devnet, tron-shasta'
            ],
            suites: XPAYR_SUITES
        };
        sendJsonRpcResult(id, {
            contents: [
                {
                    uri,
                    mimeType: 'application/json',
                    text: JSON.stringify(resourcePayload, null, 2)
                }
            ]
        });
        return;
    }

    if (method === 'prompts/list') {
        sendJsonRpcResult(id, {
            prompts: [
                {
                    name: 'create_multichain_crypto_invoice',
                    description: 'Create a universal multi-chain crypto payment link with Dual Checkout (Web3 + Direct Exchange QR) and optional HTML email invoice push.',
                    arguments: [
                        { name: 'amount', description: 'Invoice amount (e.g., 99.00).', required: true },
                        { name: 'currency', description: 'Preferred base currency (e.g., USDT, USDC).', required: false },
                        { name: 'customerEmail', description: 'Optional buyer email for automated HTML invoice delivery.', required: false }
                    ]
                },
                {
                    name: 'autonomous_agent_payment_flow',
                    description: 'Submit an AI agent payment intent, evaluate merchant spending policy guardrails, and bridge approved intents to an XPayr checkout session.',
                    arguments: [
                        { name: 'amount', description: 'Payment amount in USDC/USDT.', required: true },
                        { name: 'reason', description: 'Reason or vendor invoice reference.', required: true }
                    ]
                }
            ]
        });
        return;
    }

    if (method === 'prompts/get') {
        const promptName = params && params.name ? params.name : 'create_multichain_crypto_invoice';
        const promptArgs = (params && params.arguments) || {};
        sendJsonRpcResult(id, {
            description: `XPayr automated workflow prompt for ${promptName}`,
            messages: [
                {
                    role: 'user',
                    content: {
                        type: 'text',
                        text: `Execute the XPayr MCP tools for workflow "${promptName}" with parameters: ${JSON.stringify(promptArgs)}`
                    }
                }
            ]
        });
        return;
    }

    if (method === 'tools/call') {
        const toolName = params && params.name;
        const toolArgs = (params && params.arguments) || {};
        const toolDef = MCP_TOOL_DEFINITIONS.find((t) => t.name === toolName);
        if (!toolDef) {
            sendJsonRpcError(id, -32602, `Unknown XPayr MCP tool: ${toolName}`);
            return;
        }
        try {
            const result = await executeXpayrTool(toolDef, toolArgs);
            sendJsonRpcResult(id, {
                content: [
                    {
                        type: 'text',
                        text: JSON.stringify(result, null, 2)
                    }
                ],
                isError: false
            });
        } catch (err) {
            sendJsonRpcResult(id, {
                content: [
                    {
                        type: 'text',
                        text: `Error executing ${toolDef.name}: ${err.message}`
                    }
                ],
                isError: true
            });
        }
        return;
    }

    if (id !== undefined && id !== null) {
        sendJsonRpcError(id, -32601, `Method not found: ${method}`);
    }
}

/**
 * Parses CLI flags or starts the native JSON-RPC 2.0 MCP server over stdio.
 */
function main() {
    const argv = process.argv.slice(2);
    let suite = 'all';
    let listOnly = false;
    let printConfig = false;

    for (let i = 0; i < argv.length; i += 1) {
        const arg = argv[i];
        if (arg === '--suite' && argv[i + 1]) {
            suite = argv[i + 1];
            i += 1;
        } else if (arg === '--list') {
            listOnly = true;
        } else if (arg === '--print-config') {
            printConfig = true;
        }
    }

    if (listOnly) {
        console.log('XPayr 21-Tool Non-Custodial Crypto Gateway MCP Suites (https://xpayr.com/developers):');
        for (const [suiteKey, toolList] of Object.entries(XPAYR_SUITES)) {
            console.log(`\n[${suiteKey.toUpperCase()}] (${toolList.length} Tools):`);
            for (const name of toolList) {
                console.log(`  - ${name}`);
            }
        }
        return;
    }

    if (printConfig) {
        const configObj = buildMcpServerConfig(suite);
        console.log(JSON.stringify(configObj, null, 2));
        return;
    }

    const activeToolSet = new Set(resolveToolsForSuite(suite));

    const rl = readline.createInterface({
        input: process.stdin,
        terminal: false
    });

    rl.on('line', (line) => {
        const trimmed = line.trim();
        if (!trimmed) return;
        try {
            const parsed = JSON.parse(trimmed);
            handleJsonRpcMessage(parsed, activeToolSet).catch((err) => {
                if (parsed && parsed.id !== undefined) {
                    sendJsonRpcError(parsed.id, -32603, err.message);
                }
            });
        } catch (_err) {
            sendJsonRpcError(null, -32700, 'Parse error');
        }
    });
}

main();
