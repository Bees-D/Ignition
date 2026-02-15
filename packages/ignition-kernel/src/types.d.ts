declare module '@mercuryworkshop/epoxy-transport' {
    export class EpoxyClient {
        constructor(serverUrl: string, config: any);
        connect(): Promise<void>;
        send(data: Uint8Array): void;
        fetch(request: Request): Promise<Response>;
    }
}
