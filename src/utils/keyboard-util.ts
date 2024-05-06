import { useEffect } from 'react';

interface UseKeyboardShortCutProps {
    key: string;
    onKeyPressed: () => void;
    ref: React.RefObject<HTMLDivElement>;
    isDrawerOpen: boolean;
}

export const KeyBoardKey = {
    ESC: 'Escape',
} as const;

export const useKeyboardShortCut = ({
    key,
    onKeyPressed,
    ref,
    isDrawerOpen,
}: UseKeyboardShortCutProps) => {
    useEffect(() => {
        const onKeyDownHandler = (event: KeyboardEvent) => {
            console.log('are you triggering?');
            if (event.key === key && ref.current) {
                onKeyPressed();
            }
        };

        if (!isDrawerOpen && ref.current) {
            ref.current.blur();
        }

        if (ref.current && isDrawerOpen) {
            ref.current.focus();
            ref.current.addEventListener('keydown', onKeyDownHandler);
        }

        return () => {
            ref.current?.removeEventListener('keydown', onKeyDownHandler);
        };
    }, [onKeyPressed, ref, isDrawerOpen]);
};
