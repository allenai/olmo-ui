import { EffectCallback, useEffect, useRef } from 'react';

export const useEffectOnce = (effect: EffectCallback) => {
    const hasTriggered = useRef(false);

    useEffect(() => {
        if (!hasTriggered.current) {
            return effect();
        }
    });
};
