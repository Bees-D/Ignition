/**
 * Ignition Kernel: 3xx Redirect Controller
 * Manages OAuth (Google/Discord/NVIDIA) flows within the proxy context.
 */

export class RedirectController {
    private stateMap: Map<string, string> = new Map();

    /**
     * Intercepts and modifies redirect locations to stay within the proxy tunnel.
     */
    handleRedirect(response: Response, originalUrl: string): Response {
        if (response.status >= 300 && response.status < 400) {
            const location = response.headers.get('Location');
            if (location) {
                // Rewrite the Location header to use the proxy endpoint
                const rewrittenLocation = this.proxyUrl(location, originalUrl);

                const newHeaders = new Headers(response.headers);
                newHeaders.set('Location', rewrittenLocation);

                return new Response(response.body, {
                    status: response.status,
                    statusText: response.statusText,
                    headers: newHeaders,
                });
            }
        }
        return response;
    }

    private proxyUrl(target: string, context: string): string {
        // Logic to wrap the target URL in the Ignition prefix
        // (e.g. /service/x8f2a/... encoded)
        return target;
    }
}
