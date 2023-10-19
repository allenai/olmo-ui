import { useLexicalComposerContext } from '@lexical/react/LexicalComposerContext';
import { useEffect, useLayoutEffect, useRef } from 'react';

interface Props {
    onClick: (e: MouseEvent) => void;
}

// allows hooking up to onclick event on editor
export const OnClickPlugin = ({ onClick }: Props) => {
    const [editor] = useLexicalComposerContext();
    const onClickRef = useRef<typeof onClick>(onClick);

    // need to update callback ref because we are breaking out od react and into dom events
    useEffect(() => {
        onClickRef.current = onClick;
    }, [onClick]);

    useLayoutEffect(() => {
        return editor.registerRootListener(
            (rootElement: HTMLElement | null, prevRootElement: HTMLElement | null) => {
                const eventListener = (event: MouseEvent) => onClickRef.current(event);
                if (prevRootElement !== null) {
                    prevRootElement.removeEventListener('click', eventListener);
                }
                if (rootElement !== null) {
                    rootElement.addEventListener('click', eventListener);
                }
            }
        );
    }, [editor]);

    return null;
};
