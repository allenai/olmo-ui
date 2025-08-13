/**
 * Shows a UI hint or tooltip only once per user, persisted via `localStorage`.
 *
 * @example
 * const { visible, dismiss } = useOneTimeHint('WELCOME_BANNER_SHOWN');
 * return visible ? <Banner onClose={dismiss} /> : null;
 *
 * @param {string} storageKey - Unique key for this hint in `localStorage`.
 * @param {boolean} [defaultVisible=true] - Initial visibility when no stored value exists.
 * @returns {UseOneTimeHintResult} Controls and state for the one-time hint.
 */

import { useCallback, useMemo, useState } from 'react';

/**
 * Result returned by {@link useOneTimeHint}.
 */
export interface UseOneTimeHintResult {
    /** Current visibility state. */
    visible: boolean;

    /** Hides the hint and persists dismissal in `localStorage`. */
    dismiss: () => void;

    /** Clears dismissal so the hint is shown again. */
    reset: () => void;
}

export function useOneTimeHint(
    storageKey: string,
    defaultVisible: boolean = true
): UseOneTimeHintResult {
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
