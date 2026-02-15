# Ignition Virtual Browser Engine

[![License: AGPL v3](https://img.shields.io/badge/License-AGPL_v3-blue.svg)](LICENSE)
![Status: Production](https://img.shields.io/badge/Status-Production-green)

**Ignition** is a high-fidelity, steganographic virtual browser environment engineered for evasion and privacy. It is open-source software (AGPL-3.0), designed to be deployed and modified freely like Ultraviolet or Scramjet.

Ignition provides the core infrastructure for high-fidelity media streaming, cloud gaming, and advanced stealth browsing on managed networks.

## 🚀 Key Features

- **High-Performance Core**: Rust-based rewriter compiled to WASM with SIMD acceleration.
- **Wisp Protocol Kernel**: Multi-hop, binary-safe networking designed to evade DPI.
- **Advanced Evasion**: High-fidelity spoofing of browser hardware, timezone, and canvas/WebGL noise.
- **GoGuardian Bypass**: Specialized strategies to defeat educational filtering, including screenshot blackouts and scene redirection.
- **Developer-First API**: Granular hooks and toggles for frontend developers to build custom experiences.
- **Multi-Platform Support**: Optimized for deployment on Vercel, Netlify, Cloudflare, and Replit.

## 🏗️ Building from Source (Local Development)

Ignition is a monorepo consisting of the Kernel (Service Worker), Core (Rust/WASM), and Sandbox (Injection Script). To build the engine locally and integrate it into your own frontend:

1. **Clone the Repository:**
```bash
git clone https://github.com/Bees-D/Ignition.git
cd Ignition/Ignition
```

2. **Install Dependencies:**
```bash
npm install
```

3. **Build the Engine:**
This compiles the Rust core to WASM and bundles the TypeScript kernel/sandbox. The project uses a cross-platform build orchestrator (`scripts/build.js`).
```bash
npm run build
```

4. **Integration (Copying Artifacts):**
The build process automatically generates a `dist/` folder in the root. Copy these files to your own frontend project's `public/` directory:
- `ignition.bundle.js` (The Universal SDK/Sandbox)
- `ignition.sw.js` (The Service Worker Kernel)
- `ignition_core_bg.wasm` (The Rust/WASM Binary)
- `index.html` (A basic demo/test page)

---

## 🚀 Deployment (Cloud & Edge)

Ignition is optimized for edge deployment on Vercel and Cloudflare.

### ▲ Vercel Deployment
A `vercel.json` is included for zero-config deployment with required COOP/COEP headers (essential for `SharedArrayBuffer` support).

1. **Push to GitHub.**
2. **Import Project to Vercel.**
3. **Add Environment Variable:** `RUST_VERSION=stable` (if needed for custom builds, though pre-compiled WASM is recommended).
4. **Deploy.**

### ☁️ Cloudflare Workers / Pages
A `wrangler.toml` is included for deployment on Cloudflare's edge network.

1. **Install Wrangler:** `npm install -g wrangler`
2. **Login:** `wrangler login`
3. **Publish:**
```bash
wrangler publish
```
*Note: Ensure your Cloudflare account has Workers Paid plan if high-CPU usage is expected, though free tier supports basic Wisp traffic.*

---

## ⚡ Frontend Integration (Quick Start)

Ignition v3.0 features a "One-Step" interface designed to handle navigation, search, and stealth with zero developer overhead.

### 1. Installation
Include the bundle in your frontend:
```html
<script src="/ignition.bundle.js"></script>
```

### 2. Fuel the Engine (Setup)
Configure your engine settings once at the start:
```javascript
Ignition.Fuel({
  engine: 'duckduckgo', // default search engine
  cloak: true,          // about:blank cloaking
  stealth: true,        // hardware hallucination & integrity hooks
  steganography: false  // encapsulate traffic in image pixels
});
```

### 3. Ignite the Spark (Launch)
The `Ignite` method handles both URLs and generic search queries automatically:

```javascript
// Navigates directly to Discord inside an about:blank window
Ignition.Ignite('discord.com');

// Routes through DuckDuckGo due to Smart Search
Ignition.Ignite('how to center a div');
```

## 🌑 The Invisibility Protocol
Ignition 3.0 is built on the **"Infinite"** architecture:
- **LSB Smuggling**: Smuggles Wisp traffic inside 1px image noise.
- **Recursive Lying**: Halucinates native browser code to fool inspectors.
- **Lazarus Protocol**: SW heartbeats that re-register if killed by admins.
- **Hardware Hallucination**: Reports as a high-end Windows machine (RTX 4070).

## 🛠️ Performance & Security
Ignition uses **WASM-SIMD** for rewriting, meaning it runs with near-native performance. It is pre-hardened against:
- **GoGuardian/Securly**: Built-in screenshot blackouts and scene bypassing.
- **DPI**: Custom binary handshake for Wisp traffic.
- **Fingerprinting**: Canvas/WebGL noise and hardware spoofing.

---
*Built with ❤️ for performance and privacy.*
