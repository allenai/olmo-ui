import React, { useCallback, useState } from 'react';
import { MentionData, defaultSuggestionsFilter } from '@draft-js-plugins/mention';
import { EditorPlugin } from '@draft-js-plugins/editor';
import { MentionSuggestionsPubProps } from '@draft-js-plugins/mention/lib/MentionSuggestions/MentionSuggestions';

interface Props {
    mentionPlugin: EditorPlugin & {
        MentionSuggestions: React.ComponentType<MentionSuggestionsPubProps>;
    };
    chips: MentionData[];
}

export const ChipSuggestions = ({ mentionPlugin, chips }: Props) => {
    const [open, setOpen] = useState(false);
    const [suggestions, setSuggestions] = useState(chips);

    const onOpenChange = useCallback((open: boolean) => {
        setOpen(open);
    }, []);

    const onSearchChange = useCallback(({ trigger, value }: { trigger: string; value: string }) => {
        setSuggestions(defaultSuggestionsFilter(value, chips, trigger));
    }, []);

    return (
        <mentionPlugin.MentionSuggestions
            open={open}
            onOpenChange={onOpenChange}
            suggestions={suggestions}
            onSearchChange={onSearchChange}
        />
    );
};
