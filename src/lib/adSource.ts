/** UTM / gclid capture — persist first-touch ad source for 30 days. */

export const AD_SOURCE_KEYS = ['utm_source', 'utm_medium', 'utm_campaign', 'gclid'] as const;

export type AdSourceKey = (typeof AD_SOURCE_KEYS)[number];

export type AdSourceValues = Record<AdSourceKey, string>;

const STORAGE_PREFIX = 'src_';
const TTL_MS = 30 * 24 * 60 * 60 * 1000; // 30 days

type StoredEntry = { value: string; expiresAt: number };

function storageKey(key: AdSourceKey): string {
  return `${STORAGE_PREFIX}${key}`;
}

function readEntry(key: AdSourceKey): string {
  try {
    const raw = localStorage.getItem(storageKey(key));
    if (!raw) return '';

    // Legacy plain-string values from the PixelCo snippet
    if (!raw.startsWith('{')) {
      return raw;
    }

    const parsed = JSON.parse(raw) as StoredEntry;
    if (!parsed?.value || typeof parsed.expiresAt !== 'number') return '';
    if (Date.now() > parsed.expiresAt) {
      localStorage.removeItem(storageKey(key));
      return '';
    }
    return String(parsed.value);
  } catch {
    return '';
  }
}

function writeEntry(key: AdSourceKey, value: string) {
  try {
    const entry: StoredEntry = { value, expiresAt: Date.now() + TTL_MS };
    localStorage.setItem(storageKey(key), JSON.stringify(entry));
  } catch {
    // ignore quota / private mode
  }
}

/** Save any utm_* / gclid present in the current URL (first-touch within TTL). */
export function captureAdSourceFromUrl(search: string = window.location.search): void {
  if (typeof window === 'undefined') return;
  try {
    const params = new URLSearchParams(search);
    for (const key of AD_SOURCE_KEYS) {
      const value = params.get(key);
      if (value) writeEntry(key, value);
    }
  } catch {
    // ignore
  }
}

/** Read persisted ad source values for form submit / hidden fields. */
export function getAdSourceValues(): AdSourceValues {
  const out = {} as AdSourceValues;
  for (const key of AD_SOURCE_KEYS) {
    out[key] = readEntry(key);
  }
  return out;
}

export const HEAR_ABOUT_OPTIONS = [
  'Google search',
  'Facebook',
  'Instagram',
  'YouTube',
  'TikTok',
  'Indeed or another job board',
  'Referral from a driver',
  'Other',
] as const;

export type HearAboutOption = (typeof HEAR_ABOUT_OPTIONS)[number];
