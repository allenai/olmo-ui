import React, { useCallback, useState } from 'react';
import { EditorState, convertFromRaw, convertToRaw } from 'draft-js';
import { MentionData, defaultSuggestionsFilter } from '@draft-js-plugins/mention';

import { EditorPlugin } from '@draft-js-plugins/editor';
import { MentionSuggestionsPubProps } from '@draft-js-plugins/mention/lib/MentionSuggestions/MentionSuggestions';

import { curRawData, mentions } from './mockData';

interface Props {
    mentionPlugin: EditorPlugin & {
        MentionSuggestions: React.ComponentType<MentionSuggestionsPubProps>;
    };
}

export const MentionSuggestions = ({ mentionPlugin }: Props) => {
    const [editorState] = useState(
        curRawData
            ? EditorState.createWithContent(convertFromRaw(curRawData))
            : () => EditorState.createEmpty()
    );
    const [open, setOpen] = useState(false);
    const [suggestions, setSuggestions] = useState(mentions);

    const onOpenChange = useCallback((open: boolean) => {
        setOpen(open);
    }, []);

    const onSearchChange = useCallback(({ trigger, value }: { trigger: string; value: string }) => {
        setSuggestions(defaultSuggestionsFilter(value, mentions, trigger));
    }, []);

    return (
        <mentionPlugin.MentionSuggestions
            open={open}
            onOpenChange={onOpenChange}
            suggestions={suggestions}
            onSearchChange={onSearchChange}
            onAddMention={(mention: MentionData) => {
                // todo: remove this. it is used to grab the raw for testing
                console.log(mention, JSON.stringify(convertToRaw(editorState.getCurrentContent())));
            }}
        />
    );
};
