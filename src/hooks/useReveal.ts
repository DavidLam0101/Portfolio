import { useEffect, useRef } from 'react';

const THRESHOLDS = Array.from({ length: 11 }, (_, i) => i / 10);

/**
 * Fades an element up once `amount` of it has scrolled into view, and resets it
 * once it has fully left the screen so the animation replays on every visit.
 * Sections taller than the screen can't reach a high ratio, so those also count
 * once they fill `amount` of the viewport.
 */
export function useReveal<T extends HTMLElement>(amount = 0.8) {
  const ref = useRef<T>(null);

  useEffect(() => {
    const el = ref.current;
    if (!el) return;
    el.classList.add('reveal');
    const observer = new IntersectionObserver(
      ([entry]) => {
        const seen =
          entry.intersectionRatio >= amount ||
          entry.intersectionRect.height >= window.innerHeight * amount;
        if (seen) {
          el.classList.add('is-visible');
        } else if (!entry.isIntersecting) {
          // Only reset when completely off-screen, so a section never vanishes
          // while part of it is still visible.
          el.classList.remove('is-visible');
        }
      },
      { threshold: THRESHOLDS },
    );
    observer.observe(el);
    return () => observer.disconnect();
  }, [amount]);

  return ref;
}
