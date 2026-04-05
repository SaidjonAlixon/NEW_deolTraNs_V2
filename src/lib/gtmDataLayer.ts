/**
 * Google Tag Manager dataLayer pushes (spec: Delo Trans /drivers conversion tracking).
 */

declare global {
  interface Window {
    dataLayer?: Record<string, unknown>[];
  }
}

function ensureDataLayer(): Record<string, unknown>[] {
  window.dataLayer = window.dataLayer || [];
  return window.dataLayer;
}

export function pushToDataLayer(payload: Record<string, unknown>): void {
  ensureDataLayer().push(payload);
}

/** Maps React Router pathname to GTM form_location (spec uses drivers_page on /drivers). */
export function gtmFormLocationFromPathname(pathname: string): string {
  if (pathname === '/drivers') return 'drivers_page';
  const seg = pathname.replace(/^\//, '').replace(/\//g, '_');
  return seg || 'home';
}

/** click_location for phone_click — same rules as form for consistency. */
export function gtmClickLocationFromPathname(pathname: string): string {
  return gtmFormLocationFromPathname(pathname);
}

export function pushDriverFormOpen(formLocation: string): void {
  pushToDataLayer({
    event: 'form_open',
    form_name: 'driver_application',
    form_location: formLocation,
  });
}

const pushedFormOpenSessionIds = new Set<number>();

/** One form_open per modal open session (avoids duplicate under React StrictMode remounts). */
export function pushDriverFormOpenOnce(openSessionId: number, formLocation: string): void {
  if (pushedFormOpenSessionIds.has(openSessionId)) return;
  pushedFormOpenSessionIds.add(openSessionId);
  pushDriverFormOpen(formLocation);
}

export function pushDriverFormSubmit(formLocation: string, driverType: string): void {
  pushToDataLayer({
    event: 'form_submit',
    form_name: 'driver_application',
    form_location: formLocation,
    driver_type: driverType,
  });
}

export function pushPhoneClick(clickLocation: string, phoneNumber: string): void {
  pushToDataLayer({
    event: 'phone_click',
    click_location: clickLocation,
    phone_number: phoneNumber,
  });
}

/** Form position id → GTM driver_type snake_case */
export function gtmDriverTypeFromPosition(positionId: string): string {
  if (positionId === 'company-driver') return 'company_driver';
  if (positionId === 'owner-operator') return 'owner_operator';
  if (positionId === 'investor') return 'investor';
  return positionId ? positionId.replace(/-/g, '_') : 'unknown';
}
