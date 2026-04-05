import { useEffect } from 'react';
import { useLocation } from 'react-router-dom';
import { gtmClickLocationFromPathname, pushPhoneClick } from '../lib/gtmDataLayer';

/**
 * Delegated capture listener for tel: links — one phone_click per click, no duplicate handlers on elements.
 */
export default function TelLinkDataLayerTracking() {
  const { pathname } = useLocation();

  useEffect(() => {
    const clickLocation = gtmClickLocationFromPathname(pathname);

    const onClickCapture = (e: MouseEvent) => {
      const el = (e.target as HTMLElement | null)?.closest?.('a[href^="tel:"]');
      if (!el || !(el instanceof HTMLAnchorElement)) return;
      const href = el.getAttribute('href');
      if (!href) return;
      const phoneNumber = href.replace(/^tel:/i, '').trim();
      pushPhoneClick(clickLocation, phoneNumber);
    };

    document.addEventListener('click', onClickCapture, true);
    return () => document.removeEventListener('click', onClickCapture, true);
  }, [pathname]);

  return null;
}
