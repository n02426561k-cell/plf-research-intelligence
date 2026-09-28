import time
import asyncio
from collections import defaultdict
from typing import Dict

class DomainRateLimiter:
    """Token bucket rate limiter per domain to guarantee polite crawling."""
    def __init__(self, default_rate_per_sec: float = 2.0):
        self.default_delay = 1.0 / max(default_rate_per_sec, 0.1)
        self.last_accessed: Dict[str, float] = defaultdict(float)
        self.lock = asyncio.Lock()

    async def wait_for_domain(self, domain: str, min_delay: float = None):
        delay = min_delay if min_delay is not None else self.default_delay
        async with self.lock:
            now = time.time()
            elapsed = now - self.last_accessed[domain]
            if elapsed < delay:
                wait_time = delay - elapsed
                await asyncio.sleep(wait_time)
            self.last_accessed[domain] = time.time()

rate_limiter = DomainRateLimiter()
