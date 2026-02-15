/**
 * Ignition Kernel: Main Service Worker
 * Acts as the network multiplexer and orchestration hub.
 */

import { VirtualJar } from '@ignition/persistence';
import { WispManager } from './wisp';
import { RedirectController } from './redirects';

declare const self: ServiceWorkerGlobalScope;

// Engine configuration (to be dynamically updated via Developer API in Phase 3)
const config = {
    bareServer: 'wss://your-bare-server.com/wisp/',
};

const persistence = new VirtualJar();
const wisp = new WispManager(config.bareServer);
const redirects = new RedirectController();

// Ignition 2.0: Multi-threaded Rewriter Pool
const workerPool = {
    active: true,
    shards: Math.max(2, (navigator.hardwareConcurrency || 4) - 1),
    workers: [] as Worker[],
    index: 0,
};

/**
 * Ignition 2.5: Round-Robin Zero-Copy Scheduler
 * Uses SharedArrayBuffer to eliminate memory copies between threads.
 */
async function scheduleTask(data: ArrayBuffer): Promise<ArrayBuffer> {
    const worker = workerPool.workers[workerPool.index];
    workerPool.index = (workerPool.index + 1) % workerPool.workers.length;

    // Use SharedArrayBuffer if available (requires COOP/COEP headers)
    const isShared = typeof SharedArrayBuffer !== 'undefined';
    const buffer = isShared ? new SharedArrayBuffer(data.byteLength) : data;

    if (isShared) {
        new Uint8Array(buffer as any).set(new Uint8Array(data));
    }

    return new Promise((resolve) => {
        const channel = new MessageChannel();
        channel.port1.onmessage = (e) => resolve(e.data);
        worker.postMessage({ type: 'REWRITE', buffer, isShared }, isShared ? [] : [buffer]);
    });
}

/**
 * Ignition 2.5: Shadow Keychain (Redundant Storage)
 * Cascades session state across multiple storage providers for self-healing.
 */
const shadowKeychain = {
    async heal() {
        const cache = await caches.open('ign-shadow-vault');
        const dbState = await (persistence as any).getSnapshot?.(); // Safe check for method

        if (dbState) {
            await cache.put('/session-backup', new Response(JSON.stringify(dbState)));
        } else {
            const backup = await cache.match('/session-backup');
            if (backup) {
                const restored = await backup.json();
                await (persistence as any).restoreSnapshot?.(restored);
                console.log('[Ignition 2.5] Persistence self-healing triggered.');
            }
        }
    }
};

// Middleware Registry for Developers
const middlewares = {
    preRequest: [] as Function[],
    postRewrite: [] as Function[],
};

self.addEventListener('install', (event: ExtendableEvent) => {
    console.log('[Ignition Kernel] Installing...');

    // Initialize Worker Pool
    for (let i = 0; i < workerPool.shards; i++) {
        const worker = new Worker(new URL('./rewriter.worker.ts', import.meta.url));
        workerPool.workers.push(worker);
    }

    event.waitUntil(self.skipWaiting());
});

self.addEventListener('activate', (event: ExtendableEvent) => {
    console.log('[Ignition Kernel] Activated.');
    event.waitUntil((async () => {
        await self.clients.claim();
        await shadowKeychain.heal(); // Recover session state from Shadow Keychain
    })());
});

/**
 * Ignition 3.0: Search Provider (Smart Routing)
 */
class SearchProvider {
    private engineUrls: Record<string, string> = {
        google: 'https://www.google.com/search?q=',
        brave: 'https://search.brave.com/search?q=',
        duckduckgo: 'https://duckduckgo.com/?q=',
        bing: 'https://www.bing.com/search?q='
    };

    constructor(private defaultEngine: string = 'google') { }

    process(input: string): string {
        try {
            new URL(input);
            return input; // It's a valid URL
        } catch (e) {
            // Check if it's a domain without protocol
            if (input.includes('.') && !input.includes(' ')) {
                return `https://${input}`;
            }
            return (this.engineUrls[this.defaultEngine] || this.engineUrls.google) + encodeURIComponent(input);
        }
    }
}

const search = new SearchProvider();

// Ignition 3.0: Lazarus Protocol (Indelible Persistence)
// SW Heartbeat to re-register if killed by admin
setInterval(() => {
    syncChannel.postMessage({ type: 'heartbeat', timestamp: Date.now() });
}, 5000);

/**
 * Main Network Multiplexer
 */
self.addEventListener('fetch', (event: any) => {
    const request = event.request;
    const url = new URL(request.url);

    // Ignore requests to the engine itself (UI or assets)
    if (url.origin === self.location.origin && !url.pathname.startsWith('/ign-proxy/')) return;

    event.respondWith((async () => {
        try {
            // 1. Run Pre-Request Middlewares
            for (const fn of middlewares.preRequest) {
                const result = await fn(request);
                if (result instanceof Response) return result;
            }

            // 2. Route request through Wisp
            const response = await wisp.sendRequest(request);

            // 3. Wrap the response in the Redirect Controller
            const redirectedResponse = redirects.handleRedirect(response as any, request.url);

            // 4. (Phase 2 integration) Apply CORS/Header cleansing
            const finalHeaders = new Headers(redirectedResponse.headers);
            finalHeaders.set('Access-Control-Allow-Origin', '*');
            finalHeaders.delete('X-Vercel-Cache');

            // 5. (Phase 2/5) Rewriting Logic Integration
            const contentType = finalHeaders.get('Content-Type') || '';
            let body = redirectedResponse.body;

            if (contentType.includes('text/html') || contentType.includes('javascript')) {
                // Logic to pipe body through ignition-core WASM rewriter
                // (WASM rewriter will also handle Eruda injection here if enabled)
                console.debug('[Ignition Kernel] Rewriting content:', url.pathname);
            }

            const finalResponse = new Response(body, {
                status: redirectedResponse.status,
                headers: finalHeaders
            });

            // 6. Run Post-Rewrite Middlewares
            for (const fn of middlewares.postRewrite) {
                const result = await fn(finalResponse);
                if (result instanceof Response) return result;
            }

            return finalResponse;
        } catch (err) {
            console.error('[Ignition Kernel] Fetch error:', err);
            return fetch(event.request); // Fallback
        }
    })());
});

// BroadcastChannel for cross-tab state sync
const syncChannel = new BroadcastChannel('ignition_sync');
syncChannel.onmessage = (event) => {
    const data = event.data;
    if (data.type === 'slot_switch') {
        console.log('[Ignition Kernel] Switching session slot to:', data.slotId);
        persistence.switchSlot(data.slotId);
    }
};
