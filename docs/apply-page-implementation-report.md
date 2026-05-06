# Technical Implementation Report: `/apply` Driver Application Page

## Overview

This document summarizes all work completed to implement the new standalone driver application page based on the provided technical specification.

Goal: improve conversion rate from Google Ads traffic by replacing the old popup-heavy flow with a mobile-first, low-friction, two-step application experience.

## What Was Implemented

## 1) New Dedicated Page: `/apply`

- Added a brand-new page component: `src/pages/Apply.tsx`
- Added router entry for `/apply` in `src/App.tsx`
- Page title is set to:
  - `Apply to Drive with Delo Trans`
- Form is embedded directly in the page (no popup, no modal, no click required to reveal form)

## 2) No-Distraction Landing Behavior

For the `/apply` route:

- Hidden:
  - Global `Header`
  - Global `Footer`
  - `DriverApplicationModal`
  - `QuickMessagePopup`
- Result: user stays focused on the form with minimal navigation distractions.

Implemented in: `src/App.tsx`

## 3) Two-Step Form Flow

Implemented in: `src/pages/Apply.tsx`

### Step 1 (Basic Info)
Fields:
- Full Name
- Phone Number
- CDL Class (`Class A`, `Class B`, `No CDL`)
- Driver Type (`Company Driver`, `Owner Operator`)

Button text:
- `Continue`

Behavior:
- Step 1 is validated in real time.
- On successful submit, data is sent to server immediately.
- Only after server success response does UI continue to Step 2.

### Step 2 (Additional Info)
Fields:
- Years of Experience (`Less than 1 year`, `1-2 years`, `2-5 years`, `5+ years`)
- State (all US states, alphabetical)
- SAP Program (`No`, `Yes`)
- DUI or DWI in last 3 years (`No`, `Yes`)
- Comments / Questions (optional, max 500 chars)

Button text:
- `Finish Application`

Additional option:
- `Skip this step` (Step 2 is optional by design)

Behavior:
- Step 2 appears on the same page after Step 1 success.
- Includes confirmation text above Step 2:
  - `Got it! One more step and you are done.`
- No page reload, no redirect.

## 4) Real-Time Validation Rules

Implemented in: `src/pages/Apply.tsx`

### Required field handling
- Empty required fields show:
  - `This field is required`
- Input border changes to red when invalid.

### Name validation
- Must contain at least 2 words.
- Must not contain numbers.
- Error messages:
  - `Please enter your first and last name`
  - `Name cannot contain numbers`

### Phone validation + formatting
- Phone input auto-formats while typing to:
  - `(XXX) XXX-XXXX`
- Validation messages:
  - `Please enter a valid US phone number`
  - `Phone number must be 10 digits`

## 5) Non-Blocking Qualification Warnings

Implemented in: `src/pages/Apply.tsx`

The following warnings are shown but do **not** block submit:

- If `CDL Class = No CDL`:
  - `CDL-A is required to apply. If you are currently in training, you may still apply.`
- If `SAP Program = Yes`:
  - `We currently do not accept drivers in the SAP program.`
- If `DUI/DWI = Yes`:
  - `A DUI or DWI in the last 3 years may affect eligibility. Our team will review your application.`

## 6) Submission Lifecycle and Success State

Implemented in: `src/pages/Apply.tsx`

### After Step 1 submit success
- Step 2 is revealed immediately.
- Smooth scroll moves user to the new section.
- Lead identifier is preserved for Step 2 linkage.

### After Step 2 submit (or skip)
- Form is replaced with success message:
  - `Thanks! Your application was received.`
- No redirect.
- No full-page reload.

## 7) GTM / dataLayer Tracking Events

### New helpers added
File: `src/lib/gtmDataLayer.ts`

- `pushApplyStep1Submit(formLocation, driverType)`
- `pushApplyStep2Submit(formLocation, driverType)`

### Event behavior
- Events are fired **only after server returns success**.
- Not fired on button click.

Current event names:
- `apply_step1_submit`
- `apply_step2_submit`

Payload includes:
- `form_name`
- `form_location`
- `driver_type`

## 8) Backend Data Capture for Step 1 and Step 2

File updated: `api/applications.ts`

Added support for flow-based payloads:
- `flow: "apply_step1"`
- `flow: "apply_step2"`
- `flow: "apply_step2_skipped"`

Included metadata:
- `leadId`
- `sourceUrl`
- `submittedAt`

Validation added per flow:
- Step 1 requires: `leadId`, `name`, `phone`, `cdlClass`, `driverType`
- Step 2 requires: `leadId`, `yearsExperience`, `state`, `sapProgram`, `duiDwi`
- Step 2 skipped requires: `leadId`

Server response now returns:
- `success`
- `leadId` (when available)

Backward compatibility preserved:
- Existing legacy `/api/applications` payloads still work.

## 9) WhatsApp Fixed Button

Implemented in: `src/pages/Apply.tsx`

- Fixed position: bottom-right
- Visible on mobile and desktop
- Link:
  - `https://wa.me/13262207171`
- Designed as always-visible CTA to reduce drop-off.

## 10) Explicitly Excluded From New Form

Per specification, these were not added to `/apply`:

- SSN field
- Driver license uploads
- Truck photo uploads
- Engine/equipment documents
- Any document upload controls

## Files Changed

- `src/pages/Apply.tsx` (new)
- `src/App.tsx`
- `src/lib/gtmDataLayer.ts`
- `api/applications.ts`

## Verification Performed

- Lint check on edited files: passed (no lint errors introduced)
- Production build (`npm run build`): passed

## Notes / Follow-Up

1. If your GTM container expects specific event names/parameters beyond current implementation, mapping can be adjusted quickly.
2. If CRM requires a dedicated table/schema instead of message-based integration, backend can be extended with a persistent datastore endpoint.
3. If required, a dedicated CTA button from `/drivers` to `/apply` can be added as a next optimization step for paid traffic funneling.

