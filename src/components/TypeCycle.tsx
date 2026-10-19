import { useEffect, useState, type ElementType } from 'react';
import { useMediaQuery } from '../hooks/useMediaQuery';

interface Options {
  typeMs?: number;
  deleteMs?: number;
  holdMs?: number;
}

type Phase = 'typing' | 'holding' | 'deleting';

/**
 * Types several lines in lockstep: pair N of every list ("Hi, my name is:" +
 * "Dat Lam") starts and finishes typing together, holds, then erases together
 * before the next pair ("Or you can call me" + "David Lam").
 */
export function useSyncedTyping(lists: string[][], { typeMs = 70, deleteMs = 40, holdMs = 2200 }: Options = {}): string[] {
  const clean = lists.map((l) => l.map((p) => p.trim()).filter(Boolean));
  const pairCount = Math.max(0, ...clean.map((l) => l.length));
  const key = JSON.stringify(clean);
  const reduceMotion = useMediaQuery('(prefers-reduced-motion: reduce)');

  const [index, setIndex] = useState(0);
  const [step, setStep] = useState(0);
  const [phase, setPhase] = useState<Phase>('typing');

  useEffect(() => {
    setIndex(0);
    setStep(0);
    setPhase('typing');
  }, [key]);

  const current = clean.map((l) => (l.length ? l[index % l.length] : ''));
  // Every line advances in proportion, so they all finish on the same tick.
  const total = Math.max(1, ...current.map((p) => p.length));

  useEffect(() => {
    if (pairCount === 0) return;
    if (reduceMotion) {
      if (pairCount < 2) return;
      const t = setTimeout(() => setIndex((i) => (i + 1) % pairCount), holdMs + 1200);
      return () => clearTimeout(t);
    }

    let delay: number;
    let next: () => void;
    if (phase === 'typing') {
      if (step >= total) {
        delay = 0;
        next = () => setPhase('holding');
      } else {
        delay = typeMs;
        next = () => setStep(step + 1);
      }
    } else if (phase === 'holding') {
      if (pairCount < 2) return; // nothing to switch to — leave it typed
      delay = holdMs;
      next = () => setPhase('deleting');
    } else if (step > 0) {
      delay = deleteMs;
      next = () => setStep(step - 1);
    } else {
      delay = 300;
      next = () => {
        setIndex((i) => (i + 1) % pairCount);
        setPhase('typing');
      };
    }
    const t = setTimeout(next, delay);
    return () => clearTimeout(t);
  }, [phase, step, total, pairCount, key, reduceMotion, typeMs, deleteMs, holdMs]);

  if (reduceMotion) return current;
  return current.map((p) => p.slice(0, Math.ceil((p.length * Math.min(step, total)) / total)));
}

export function TypedText({
  text,
  label,
  as: Tag = 'span',
  className,
}: {
  text: string;
  /** Accessible text, since the visible text changes every few frames. */
  label: string;
  as?: ElementType;
  className?: string;
}) {
  return (
    <Tag className={className} aria-label={label}>
      <span aria-hidden="true">{text}</span>
      <span className="type-cursor" aria-hidden="true" />
    </Tag>
  );
}
