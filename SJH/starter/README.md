# Starter code notes — audited v2

These files are an integration scaffold, **not a drop-in replacement for the current app**.

Antigravity must:
- adapt imports and routing to the real repo;
- reuse the existing menu/drawer callback and expanded state;
- reuse the existing enquiry/planning action;
- use the project’s existing Link/router component for the logo if applicable;
- flatten or remap asset paths to the repo’s public/static convention;
- use the existing font loader;
- compare actual screenshots to Tier-1 exact references;
- tune only the door xPercent / background object-position when necessary;
- not add a second CSS framework.

If GSAP is not already present:
```bash
npm install gsap
```
If `@gsap/react` is already used, prefer its `useGSAP()` hook.
