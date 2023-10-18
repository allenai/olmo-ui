import { useEffect } from 'react';
import { useLexicalComposerContext } from '@lexical/react/LexicalComposerContext';

// plug in to allow updating editable state of lexical editor
export const UpdateEditablePlugin = ({ isEditable }: { isEditable: boolean }) => {
    const [editor] = useLexicalComposerContext();

    useEffect(() => {
        editor.setEditable(isEditable);
    }, [isEditable]);

    return null;
};
