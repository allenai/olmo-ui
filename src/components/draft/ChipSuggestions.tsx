import React, { useCallback, useState } from 'react';
import { MentionData, defaultSuggestionsFilter } from '@draft-js-plugins/mention';
import { EditorPlugin } from '@draft-js-plugins/editor';
import { MentionSuggestionsPubProps } from '@draft-js-plugins/mention/lib/MentionSuggestions/MentionSuggestions';

import { DataChip } from '../../api/DataChip';

interface Props {
    mentionPlugin: EditorPlugin & {
        MentionSuggestions: React.ComponentType<MentionSuggestionsPubProps>;
    };
    chips: DataChip[];
}

export const ChipSuggestions = ({ mentionPlugin, chips }: Props) => {
    const [open, setOpen] = useState(false);
    const [suggestions, setSuggestions] = useState(chips);

    const onOpenChange = useCallback((open: boolean) => {
        setOpen(open);
    }, []);

    const onSearchChange = useCallback(({ trigger, value }: { trigger: string; value: string }) => {
        setSuggestions(
            // We are converting into and out of MentionData. DaaChip is a MentionData, but I had
            // trouble making Typescript agree because MentionData interface is defined as a
            // dictionary.
            defaultSuggestionsFilter(value, chips as MentionData[], trigger) as DataChip[]
        );
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
