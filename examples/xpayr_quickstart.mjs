/**
 * @file xpayr_quickstart.mjs
 * @description Zero-dependency Node.js ESM example for creating a multi-chain XPayr payment session
 * with Dual Checkout (Web3 1-Click Pay + Direct Exchange QR) and polling on-chain status.
 */

const XPAYR_API_KEY = process.env.XPAYR_API_KEY || 'sk_test_replace_with_your_key';
const BASE_URL = 'https://xpayr.com/api/v1';

async function runXpayrDemo() {
    const healthRes = await fetch(`${BASE_URL}/health`);
    console.log('1. Gateway Health:', await healthRes.json());

    const createRes = await fetch(`${BASE_URL}/payments`, {
        method: 'POST',
        headers: {
            'Authorization': `Bearer ${XPAYR_API_KEY}`,
            'Content-Type': 'application/json'
        },
        body: JSON.stringify({
            amount: 49.90,
            currency: 'USDT',
            network: 'tron-mainnet',
            order_id: 'ORD-DEMO-1001',
            description: 'XPayr Multi-Chain Pro Subscription',
            is_multi_chain: true,
            is_reusable: false,
            send_invoice_email: false
        })
    });

    const session = await createRes.json();
    console.log('2. Payment Session Response:', session);
}

runXpayrDemo().catch(console.error);
