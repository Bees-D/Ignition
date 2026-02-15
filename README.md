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

## 🛠️ Technology Stack

- **Kernel**: TypeScript (Service Worker based)
- **Rewriter**: Rust / WASM (SIMD optimized)
- **Networking**: Wisp over WSS
- **Persistence**: IndexedDB (Virtual Cookie Jar)

## 🏗️ Getting Started (The Universal SDK)

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
