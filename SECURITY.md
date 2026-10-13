# Systematic Security Architecture & Workflow Protocol — Noor Kids

This document establishes the mandatory security development lifecycle and architectural rules for all engineers and AI agents contributing to the **Noor Kids** codebase.

---

## 1. Systematic Security Workflow

### Phase 1: Define Constraints (Pre-Code Threat Model)
> **Directive:** *"Act as a security-focused software architect. Before writing any code, perform a threat model for [feature/endpoint/component]. Consider access control, input validation, and potential data leaks."*

Before writing implementation code:
1. **Identify Data Flows & Trust Boundaries:**
   - Where does untrusted user input enter? (HTTP body, query parameters, URL path, route params, local storage).
   - What boundary does it cross? (Client $\rightarrow$ Server, Server $\rightarrow$ 3rd-party API/Database).
2. **Access Control Analysis:**
   - Who is authorized to invoke this action? (Anonymous visitor, child profile, authenticated parent session, internal server only).
   - Can an authenticated user tamper with IDs to access another tenant's records (IDOR / BOLA)?
3. **Data Leakage & COPPA Compliance:**
   - Does this feature touch children's data? (Names, voice recordings, progress, notes).
   - All child-specific data must remain offline-first on the device (AsyncStorage) unless explicitly authorized by parental consent.
4. **Denial-of-Wallet & Cost Boundaries:**
   - Does this feature trigger external billable APIs (AI LLMs, speech-to-text, cloud storage, paid proxies)?
   - What prevents an adversary from draining budgets?

---

### Phase 2: Explicit Security Requirements (Implementation)
> **Directive:** *"For this new endpoint or feature, ensure implementation of [specific auth method], rate limiting to prevent 'denial-of-wallet' attacks, and strict input sanitization."*

During code generation:
1. **Strict Input Allowlisting (Mass Assignment Protection):**
   - Never accept arbitrary JSON objects into models or database operations.
   - Use `validateStrict(data, allowedFields, requiredFields)` to reject unknown attributes (`isAdmin`, `role`, `ownerId`).
2. **Denial-of-Wallet Rate Limiting:**
   - Every public or semi-public endpoint must belong to a defined rate limit rule in `RATE_LIMIT_RULES`.
   - Expensive endpoints (TTS, AI, payment session creation) must have tight quotas with `HTTP 429 Too Many Requests` and standard `Retry-After` headers.
3. **Server-Authoritative Business Logic:**
   - Financial amounts, product pricing, subscription tiers, and user roles must be determined exclusively by server catalogs (`SERVER_PRICES`), never trusted from client payloads.
4. **Cryptographic Webhook Verification:**
   - External webhooks (Stripe, payment gateways) must verify raw payload HMAC signatures before processing.

---

### Phase 3: Iterative Review (Post-Implementation Audit)
> **Directive:** *"Review the code just generated. Specifically check for authorization gaps, insecure secret storage, and potential dependency bloat. Suggest improvements to align with OWASP ASVS standards."*

Before declaring any feature complete:
1. **Authorization Gap Audit (OWASP ASVS V4):**
   - Verify that resource lookup handlers verify `resource.ownerId === session.userId`.
   - Ensure unauthenticated calls return `HTTP 401 Unauthorized` and cross-tenant access returns `HTTP 403 Forbidden`.
2. **Secret Storage Audit:**
   - Scan for hardcoded keys, access tokens, credentials, or private keys.
   - Ensure `.env` is uncommitted and client bundles contain zero private strings.
3. **Dependency Bloat & Supply Chain (OWASP ASVS V14):**
   - Check if new npm packages were added unnecessarily.
   - Prefer zero-dependency native Node.js APIs (`crypto`, `http`, `zlib`, `path`) over heavy 3rd-party libraries.
4. **Automated Security Verification:**
   - Run `node scripts/test-security.js` to prove security guarantees hold under test.

---

## 2. Core Security Practices for Pair Programming

1. **Stay Small (Context Window Hygiene):**
   - Keep pull requests, prompts, and code edits focused on small, incremental steps.
   - Avoid massive multi-thousand-line monolithic rewrites where subtle authorization bypasses or unescaped inputs go unnoticed.
2. **Don't Outsource Thinking (Critical Verification):**
   - Treat AI-generated code as a first draft or scaffolding that must be actively scrutinized.
   - Verify edge cases: Null inputs, unexpected types, boundary conditions, malformed JSON, and network interruptions.
3. **Use Git Discipline (Revertible Checkpoints):**
   - Branch and commit clean milestones frequently (`git status`, `git commit`).
   - If an issue or security regression appears, instantly revert to a known-secure commit.
