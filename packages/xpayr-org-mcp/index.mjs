/**
 * @file index.mjs
 * @description Core suite definitions, tool registry metadata, and configuration helpers
 * for the Official XPayr Model Context Protocol (MCP) Server (@xpayr/mcp-server & xpayr-mcp).
 * @package @xpayr/mcp-server
 * @license MIT
 */

/**
 * Grouped suites of XPayr MCP tools for targeted AI agent workflows.
 * @type {Record<string, Array<string>>}
 */
export const XPAYR_SUITES = {
    flagship: [
        'xpayr_health_check',
        'xpayr_create_payment_session',
        'xpayr_get_public_payment_status',
        'xpayr_get_supported_networks',
        'xpayr_get_merchant_balance',
        'xpayr_send_test_webhook',
        'xpayr_submit_agent_payment_intent',
        'xpayr_bridge_agent_intent_to_checkout',
        'xpayr_calculate_gateway_fee_and_split'
    ],
    checkout: [
        'xpayr_create_payment_session',
        'xpayr_get_payment_session',
        'xpayr_list_payment_sessions',
        'xpayr_get_public_payment_status',
        'xpayr_apply_payment_coupon',
        'xpayr_calculate_gateway_fee_and_split'
    ],
    webhooks: [
        'xpayr_get_webhook_config',
        'xpayr_set_webhook_endpoint',
        'xpayr_send_test_webhook'
    ],
    agents: [
        'xpayr_create_ai_agent',
        'xpayr_list_ai_agents',
        'xpayr_update_ai_agent_policy',
        'xpayr_submit_agent_payment_intent',
        'xpayr_list_agent_payment_intents',
        'xpayr_bridge_agent_intent_to_checkout',
        'xpayr_approve_agent_intent',
        'xpayr_reject_agent_intent'
    ],
    merchant: [
        'xpayr_health_check',
        'xpayr_get_merchant_profile',
        'xpayr_get_merchant_balance',
        'xpayr_get_supported_networks',
        'xpayr_calculate_gateway_fee_and_split'
    ],
    all: [
        'xpayr_health_check',
        'xpayr_create_payment_session',
        'xpayr_get_payment_session',
        'xpayr_list_payment_sessions',
        'xpayr_get_public_payment_status',
        'xpayr_apply_payment_coupon',
        'xpayr_get_merchant_profile',
        'xpayr_get_merchant_balance',
        'xpayr_get_supported_networks',
        'xpayr_get_webhook_config',
        'xpayr_set_webhook_endpoint',
        'xpayr_send_test_webhook',
        'xpayr_create_ai_agent',
        'xpayr_list_ai_agents',
        'xpayr_update_ai_agent_policy',
        'xpayr_submit_agent_payment_intent',
        'xpayr_list_agent_payment_intents',
        'xpayr_bridge_agent_intent_to_checkout',
        'xpayr_approve_agent_intent',
        'xpayr_reject_agent_intent',
        'xpayr_calculate_gateway_fee_and_split'
    ]
};

/**
 * Resolves the list of XPayr MCP tool names for a requested suite preset.
 *
 * @param {string} [suite='all'] - Suite name ('flagship', 'checkout', 'webhooks', 'agents', 'merchant', 'all').
 * @returns {Array<string>} Array of resolved tool identifiers.
 */
export function resolveToolsForSuite(suite = 'all') {
    const key = String(suite || 'all').toLowerCase().trim();
    return XPAYR_SUITES[key] || XPAYR_SUITES.all;
}

/**
 * Builds a ready-to-paste Claude Desktop / Cursor / VS Code MCP JSON configuration object.
 *
 * @param {string} [suite='all'] - Suite preset name.
 * @returns {Object} Standard mcpServers configuration object.
 */
export function buildMcpServerConfig(suite = 'all') {
    return {
        mcpServers: {
            xpayr: {
                command: 'npx',
                args: ['-y', '@xpayr/mcp-server', '--suite', suite],
                env: {
                    XPAYR_API_KEY: 'sk_test_your_xpayr_secret_key',
                    XPAYR_BASE_URL: 'https://xpayr.com/api/v1'
                }
            }
        }
    };
}
