
## GTM dataLayer — implementation summary

**Project:** Delo Trans Inc. website  
**Goal:** Measure Google Ads / GA4 conversions and events via Google Tag Manager (GTM)  
**Basis:** Technical specification by Gleb Baraniuk (`/drivers` page, `form_open`, `form_submit`, `phone_click`)

---

### 1. Executive summary

Three `dataLayer.push()` events are implemented:

| Event | When it fires | Key fields |
|-------|----------------|------------|
| `form_open` | **Once** each time the driver application modal opens | `form_name`, `form_location` |
| `form_submit` | After the server **successfully** accepts the application | `form_name`, `form_location`, `driver_type` |
| `phone_click` | When the user clicks a `tel:` link | `click_location`, `phone_number` |

GTM is already installed via `index.html` (`GTM-WT3ZWP8F`). The code only pushes objects to `window.dataLayer` — configuring tags in the GTM UI is handled by marketing / the GTM admin (e.g. Gleb).

---

### 2. How it works (technical flow)

#### 2.1. What is `dataLayer`?

- The GTM script creates or reuses the `window.dataLayer` array.
- When `dataLayer.push({ event: '...', ... })` runs, GTM reads the entry and can fire matching **triggers** and **tags** (e.g. GA4 Event, Google Ads Conversion).

#### 2.2. `form_open`

1. The user opens the **Driver Application** modal from anywhere on the site (`openDriverModal`).
2. `DriverApplicationContext` increments `openSessionId` on **each** open (1, 2, 3, …).
3. Inside `DriverApplicationModal`, a `useEffect` calls `pushDriverFormOpenOnce(openSessionId, formLocation)` when the modal opens.
4. For a given `openSessionId`, the push happens **only once** — a module-level `Set` plus the session id prevents **duplicate** events when React Strict Mode runs effects twice.
5. `form_location` is derived from the current URL: if path is `/drivers` → `drivers_page`; otherwise e.g. `home`, `about`, `contact`.

#### 2.3. `form_submit`

1. The user submits the application — `fetch('/api/applications', { method: 'POST', ... })`.
2. A push runs only when **all** of the following are true:
   - `response.ok` (successful HTTP),
   - JSON body has `success: true`.
3. The push is **not** on button click; it is **after server confirmation** (before `closeDriverModal()`).
4. On error, network failure, or `success: false` — **`form_submit` is not sent** (per spec).
5. `driver_type` reflects the selected role: `company_driver`, `owner_operator`, `investor`.

#### 2.4. `phone_click`

1. The `TelLinkDataLayerTracking` component listens for **capture-phase** clicks on `document`.
2. If the click target is inside `a[href^="tel:"]`, `phone_click` is pushed.
3. `phone_number` is the `href` with the `tel:` prefix removed.
4. `click_location` uses the same path rules as `form_location` (`/drivers` → `drivers_page`).

---

### 3. What was implemented (by file)

| File | Role |
|------|------|
| `src/lib/gtmDataLayer.ts` | Helpers: `pushToDataLayer`, `gtmFormLocationFromPathname`, `pushDriverFormOpen`, `pushDriverFormOpenOnce`, `pushDriverFormSubmit`, `pushPhoneClick`, `gtmDriverTypeFromPosition` |
| `src/context/DriverApplicationContext.tsx` | `openSessionId` increments on each modal open; prevents duplicate `form_open` |
| `src/components/DriverApplicationModal.tsx` | `form_open` on open; `form_submit` after successful submit |
| `src/components/TelLinkDataLayerTracking.tsx` | Global `tel:` clicks → `phone_click` |
| `src/App.tsx` | Renders `TelLinkDataLayerTracking` |
| `index.html` | Unchanged — GTM snippet already present |

---

### 4. Alignment with acceptance criteria

- **Opening the form / modal** → `form_open` visible in GTM Preview.
- **Successful submit** → `form_submit` visible.
- **Server error** → **no** `form_submit`.
- **Phone link** → `phone_click` visible.
- **One user action → one event** where intended (especially `form_open` via session id + `Set`).

---

### 5. QA and GTM setup (next steps)

1. **GTM** → Preview mode, site URL (production or staging).
2. On `/drivers`, click Apply → `form_open`, `form_location: drivers_page`.
3. Complete and submit the form → `form_submit`, verify `driver_type`.
4. Click a `tel:` link → `phone_click`.
5. In GTM, **Custom Event** triggers: `form_open`, `form_submit`, `phone_click`.
6. Tags: GA4 Event, Google Ads Conversion — per Gleb’s specification table.

---

### 6. Notes

- If the modal opens from **another page**, `form_location` will **not** be `drivers_page` (e.g. `home`) — useful for traffic source segmentation.
- Currently the main `tel:` link lives in the **Header**; any future `tel:` links are covered automatically by the delegated listener.
- This document describes the **code** implementation; tag and trigger names inside the GTM container are owned by marketing / the GTM administrator.

---

*This document matches the codebase at the time of writing; update it if the implementation changes.*

