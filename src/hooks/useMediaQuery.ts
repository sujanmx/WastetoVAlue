import { useEffect, useState } from 'react';

/**
 * Universal responsive breakpoint detector and media query listener.
 * Follows target breakpoints established in design specifications.
 */
export function useMediaQuery(query: string): boolean {
  const [matches, setMatches] = useState<boolean>(() => {
    if (typeof window !== 'undefined') {
      return window.matchMedia(query).matches;
    }
    return false;
  });

  useEffect(() => {
    if (typeof window === 'undefined') return;

    const mediaQueryList = window.matchMedia(query);
    const listener = (event: MediaQueryListEvent) => {
      setMatches(event.matches);
    };

    setMatches(mediaQueryList.matches);

    if (mediaQueryList.addEventListener) {
      mediaQueryList.addEventListener('change', listener);
      return () => mediaQueryList.removeEventListener('change', listener);
    } else {
      // Compatibility fallback
      mediaQueryList.addListener(listener);
      return () => mediaQueryList.removeListener(listener);
    }
  }, [query]);

  return matches;
}

export function useResponsive() {
  const isMobile = useMediaQuery('(max-width: 767px)');
  const isTablet = useMediaQuery('(min-width: 768px) and (max-width: 1023px)');
  const isDesktop = useMediaQuery('(min-width: 1024px)');
  const isWideDesktop = useMediaQuery('(min-width: 1440px)');
  const prefersReducedMotion = useMediaQuery('(prefers-reduced-motion: reduce)');

  return {
    isMobile,
    isTablet,
    isDesktop,
    isWideDesktop,
    prefersReducedMotion,
  };
}
