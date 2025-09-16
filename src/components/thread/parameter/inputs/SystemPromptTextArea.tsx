import { TextField, Theme } from '@mui/material';
import { ChangeEvent } from 'react';

import { ParameterDrawerInputWrapper } from './ParameterDrawerInputWrapper';

const SYSTEM_PROMPT_TOOLTIP_CONTENT =
    'The system prompt provides instructions to the model about how it should behave throughout the conversation. This can only be set before sending the first message in a thread.';

interface SystemPromptTextAreaProps {
    value?: string | null;
    onChange: (value: string) => void;
    id: string;
    readOnly?: boolean;
}

export const SystemPromptTextArea = ({
    value = '',
    onChange,
    id,
    readOnly = false,
}: SystemPromptTextAreaProps) => {
    const handleChange = (event: ChangeEvent<HTMLTextAreaElement>) => {
        onChange(event.target.value);
    };

    // Simple placeholder text for when textarea is empty
    const placeholderText = readOnly
        ? 'There is no System Prompt'
        : 'Enter system prompt instructions...';

    const helperText = readOnly ? 'Read-only: Start a new thread to edit' : '';

    return (
        <ParameterDrawerInputWrapper
            inputId={`${id}-input`}
            label="System Prompt"
            tooltipContent={SYSTEM_PROMPT_TOOLTIP_CONTENT}
            aria-label="Show description for System Prompt"
            tooltipTitle="System Prompt">
            <TextField
                inputProps={{
                    disabled: readOnly,
                    sx: (theme: Theme) => {
                        return { color: readOnly ? theme.palette.action.disabled : 'unset' };
                    },
                }}
                id={`${id}-input`}
                fullWidth
                multiline
                minRows={3}
                maxRows={8}
                value={value || ''}
                onChange={handleChange}
                placeholder={placeholderText}
                helperText={helperText}
            />
        </ParameterDrawerInputWrapper>
    );
};
