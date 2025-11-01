'use client';

import { useEffect } from 'react';
export default function DevtoolsBlocker() {
  useEffect(() => {
    // Disable React DevTools
    try {
      // @ts-expect-error - global hook injected by devtools
      window.__REACT_DEVTOOLS_GLOBAL_HOOK__ = {
        isDisabled: true,
        inject: () => {},
        onCommitFiberRoot: () => {},
        onCommitFiberUnmount: () => {}
      };
    } catch {}

    // Block common shortcuts (not bulletproof)
    const onKey = e => {
      // Guard against events that don't have a .key (some browser/composed events)
      const key = e && e.key ? String(e.key).toLowerCase() : '';
      if (e && (e.ctrlKey && key === 'u' ||
      // View source
      e.ctrlKey && e.shiftKey && (key === 'i' || key === 'j' || key === 'c') ||
      // DevTools
      key === 'f12')) {
        e.preventDefault();
        e.stopPropagation();
      }
    };
    const onContext = e => e.preventDefault();
    window.addEventListener('keydown', onKey, {
      capture: true
    });
    window.addEventListener('contextmenu', onContext);
    return () => {
      window.removeEventListener('keydown', onKey, {
        capture: true
      });
      window.removeEventListener('contextmenu', onContext);
    };
  }, []);
  return null;
}
