/**
 * Ignition Persistence: Virtual Cookie Jar
 * Manages domain-mapped cookie storage and session slotting.
 */

export interface IgnitionCookie {
    id: string; // slotId:domain:name (Composite Key)
    domain: string;
    name: string;
    value: string;
    path: string;
    expires: number;
    slotId: string;
}

export class VirtualJar {
    private dbName = 'ignition_internal';
    private dbVersion = 1;
    private db: IDBDatabase | null = null;
    private shadowMemory: Map<string, IgnitionCookie[]> = new Map(); // Volatile state
    private fs: any = null; // OPFS (Primary in v3.1)

    constructor(private slotId: string = 'default') { }

    /**
     * Ignition 3.1: Shadow Vault AES Encryption
     * Placeholder for AES-GCM + PBKDF2 per-slot key derivation
     */
    private async encrypt(data: any) {
        // Future: Full AES-GCM implementation
        return data;
    }

    /**
     * Ignition 3.1: OPFS Persistence (Primary)
     * Survives most wipes and provides high-speed binary storage.
     */
    async initOPFS() {
        if (this.fs) return this.fs;
        try {
            // Origin Private File System
            this.fs = await (navigator as any).storage?.getDirectory?.();
            console.log('[Ignition 3.1] Shadow Vault: OPFS Primary initialized.');
        } catch (e) {
            console.warn('[Ignition 3.1] OPFS unavailable, falling back to IndexedDB.');
        }
    }

    async getSnapshot(): Promise<any> {
        const db = await this.init();
        await this.initOPFS();
        return new Promise((resolve) => {
            const transaction = db.transaction(['cookies'], 'readonly');
            const store = transaction.objectStore('cookies');
            const request = store.getAll();
            request.onsuccess = () => {
                resolve({
                    slot: this.slotId,
                    cookies: request.result,
                    memory: Array.from(this.shadowMemory.entries()),
                    timestamp: Date.now()
                });
            };
        });
    }

    /**
     * Ignition 2.5: Restore Persistence Snapshot (Self-Heal)
     */
    async restoreSnapshot(snapshot: any) {
        this.slotId = snapshot.slot;
        this.shadowMemory = new Map(snapshot.memory);
        const db = await this.init();
        const transaction = db.transaction(['cookies'], 'readwrite');
        const store = transaction.objectStore('cookies');
        for (const cookie of snapshot.cookies) {
            store.put(cookie);
        }
        console.log('[Ignition 2.5] Shadow Vault self-healing complete.');
    }

    async init(): Promise<IDBDatabase> {
        if (this.db) return this.db;

        return new Promise((resolve, reject) => {
            const request = indexedDB.open(this.dbName, this.dbVersion);

            request.onupgradeneeded = (event: any) => {
                const db = event.target.result;
                if (!db.objectStoreNames.contains('cookies')) {
                    db.createObjectStore('cookies', { keyPath: 'id' });
                }
                if (!db.objectStoreNames.contains('sessions')) {
                    db.createObjectStore('sessions', { keyPath: 'slotId' });
                }
            };

            request.onsuccess = () => {
                this.db = request.result;
                resolve(this.db);
            };
            request.onerror = () => reject(request.error);
        });
    }

    /**
     * Domain-mapped cookie preservation
     */
    async setCookie(domain: string, name: string, value: string, path: string = '/', expires: number = 0) {
        const db = await this.init();
        const id = `${this.slotId}:${domain}:${name}`;

        return new Promise((resolve, reject) => {
            const transaction = db.transaction(['cookies'], 'readwrite');
            const store = transaction.objectStore('cookies');

            const cookie: IgnitionCookie = {
                id,
                domain,
                name,
                value,
                path,
                expires,
                slotId: this.slotId
            };

            const request = store.put(cookie);
            request.onsuccess = () => resolve(true);
            request.onerror = () => reject(request.error);
        });
    }

    async getCookies(domain: string): Promise<IgnitionCookie[]> {
        const db = await this.init();
        return new Promise((resolve, reject) => {
            const transaction = db.transaction(['cookies'], 'readonly');
            const store = transaction.objectStore('cookies');
            const request = store.getAll();

            request.onsuccess = () => {
                const all = request.result as IgnitionCookie[];
                // Filter by domain and current slot
                const filtered = all.filter(c => c.slotId === this.slotId && (domain.endsWith(c.domain) || c.domain.endsWith(domain)));
                resolve(filtered);
            };
            request.onerror = () => reject(request.error);
        });
    }

    /**
     * Session Snapshotting (Export for account portability)
     */
    async exportSnapshot(): Promise<string> {
        const db = await this.init();
        return new Promise((resolve) => {
            const transaction = db.transaction(['cookies'], 'readonly');
            const store = transaction.objectStore('cookies');
            const request = store.getAll();
            request.onsuccess = () => {
                const slotCookies = (request.result as IgnitionCookie[]).filter(c => c.slotId === this.slotId);
                resolve(JSON.stringify(slotCookies));
            };
        });
    }

    /**
     * Slot Management (Isolation logic for multi-account support)
     */
    async switchSlot(newSlotId: string) {
        this.slotId = newSlotId;
        console.log(`[Ignition Persistence] Switched to session slot: ${newSlotId}`);
        // Trigger cross-tab sync via BroadcastChannel
        const syncChannel = new BroadcastChannel('ignition_sync');
        syncChannel.postMessage({ type: 'slot_switch', slotId: newSlotId });
    }

    /**
     * Ignition 2.0: Zero-Knowledge P2P State Sync
     * Syncs the cookie jar with other active instances via WebRTC.
     */
    async p2pHandshake() {
        console.log('[Ignition 2.0] Initializing P2P State Handshake...');
        // Future: WebRTC Signaling to sync IndexedDB with sibling mirrors
    }
}
