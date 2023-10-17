import { useLexicalComposerContext } from '@lexical/react/LexicalComposerContext';
import { useEffect, useLayoutEffect, useRef } from 'react';

interface Props {
    onKeyDown: (e: KeyboardEvent) => void;
}

// allows hooking up tp keydown event on editor
export const OnKeyDownPlugin = ({ onKeyDown }: Props) => {
    const [editor] = useLexicalComposerContext();
    const onKeyDownRef = useRef<typeof onKeyDown>(onKeyDown);

    // need to update callback ref because we are breaking out od react and into dom events
    useEffect(() => {
        onKeyDownRef.current = onKeyDown;
    }, [onKeyDown]);

    useLayoutEffect(() => {
        return editor.registerRootListener(
            (rootElement: HTMLElement | null, prevRootElement: HTMLElement | null) => {
                const eventListener = (event: KeyboardEvent) => onKeyDownRef.current(event);
                if (prevRootElement !== null) {
                    prevRootElement.removeEventListener('keydown', eventListener);
                }
                if (rootElement !== null) {
                    rootElement.addEventListener('keydown', eventListener);
                }
            }
        );
    }, [editor]);

    return null;
};
