"""
XPayr Non-Custodial Crypto Payment Gateway — Python Quickstart
Creates a multi-chain crypto checkout session (Web3 1-Click + Direct Exchange QR)
and queries public on-chain transaction status using standard library urllib.
"""

import json
import os
import urllib.request

XPAYR_API_KEY = os.environ.get("XPAYR_API_KEY", "sk_test_replace_with_your_key")
BASE_URL = "https://xpayr.com/api/v1"


def create_payment_session():
    payload = {
        "amount": 49.90,
        "currency": "USDT",
        "network": "tron-mainnet",
        "order_id": "ORD-PY-1001",
        "description": "XPayr Python SDK Subscription",
        "is_multi_chain": True,
        "is_reusable": False,
    }
    req = urllib.request.Request(
        f"{BASE_URL}/payments",
        data=json.dumps(payload).encode("utf-8"),
        headers={
            "Authorization": f"Bearer {XPAYR_API_KEY}",
            "Content-Type": "application/json",
            "Accept": "application/json",
        },
        method="POST",
    )
    with urllib.request.urlopen(req, timeout=30) as resp:
        return json.loads(resp.read().decode("utf-8"))


if __name__ == "__main__":
    health_req = urllib.request.Request(f"{BASE_URL}/health", headers={"Accept": "application/json"})
    with urllib.request.urlopen(health_req, timeout=15) as r:
        print("XPayr Gateway Health:", json.loads(r.read().decode("utf-8")))
