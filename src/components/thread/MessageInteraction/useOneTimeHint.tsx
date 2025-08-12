/**
 * React hook for showing a UI hint or tooltip only once per user, persisted via `localStorage`.
 *
 * - On first render, determines visibility by checking `localStorage`:
 *   - If the given `storageKey` exists, the hint is considered dismissed (`visible = false`).
 *   - Otherwise, uses `defaultVisible` (default `true`) to decide initial visibility.
 * - `dismiss()`: Marks the hint as dismissed by setting the key in `localStorage` and hides it.
 * - `reset()`: Removes the key from `localStorage` and makes the hint visible again.
 *
 * This hook is useful for onboarding tooltips, contextual UI hints, or any element
 * that should appear only until the user dismisses it once.
 *
 * Parameters:
 * - storageKey: A unique key for this hint in `localStorage`.
 * - defaultVisible (optional): Whether the hint is visible by default if no stored value exists.
 *
 * Returns:
 * {
 *   visible: boolean;   // Current visibility state
 *   dismiss: () => void; // Hides the hint and persists dismissal
 *   reset: () => void;   // Resets dismissal so the hint is shown again
 * }
 *
 * Common Usage:
 * const { visible, dismiss } = useOneTimeHint('WELCOME_BANNER_SHOWN');
 * return visible ? <Banner onClose={dismiss} /> : null;
 */

import { useCallback, useMemo, useState } from 'react';

export function useOneTimeHint(storageKey: string, defaultVisible: boolean = true) {
    const initial = useMemo(
        () => (localStorage.getItem(storageKey) ? false : defaultVisible),
        [storageKey, defaultVisible]
    );
    const [visible, setVisible] = useState(initial);

    const dismiss = useCallback(() => {
        localStorage.setItem(storageKey, 'true');
        setVisible(false);
    }, [storageKey]);

    const reset = useCallback(() => {
        localStorage.removeItem(storageKey);
        setVisible(true);
    }, [storageKey]);

    return { visible, dismiss, reset };
}
