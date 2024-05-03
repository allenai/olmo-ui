import { useEffect } from 'react';

interface UseKeyboardShortCutProps {
    key: string;
    onKeyPressed: () => void;
}

export const KeyBoardKey = {
    ESC: 'Escape',
} as const;

export const useKeyboardShortCut = ({ key, onKeyPressed }: UseKeyboardShortCutProps) => {
    useEffect(() => {
        const onKeyDownHandler = (event: KeyboardEvent) => {
            if (event.key === key) {
                event.preventDefault();
                onKeyPressed();
            }
        };

        window.addEventListener('keydown', onKeyDownHandler);

        return () => {
            window.removeEventListener('keydown', onKeyDownHandler);
        };
    }, []);
};
