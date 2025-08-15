import { Autocomplete, AutocompleteProps, Chip, TextField } from '@mui/material';

import { ParameterDrawerInputWrapper } from './ParameterDrawerInputWrapper';

const STOP_WORDS_TOOLTIP_CONTENT =
    'Stop words are a set of character sequences that stop the model from generating additional text. The output will not contain the stop word. Press Tab to add a new word.';

interface StopWordsInputProps {
    value?: string[];
    onChange: AutocompleteProps<string, true, false, true>['onChange'];
    id: string;
}

export const StopWordsInput = ({ value = [], onChange }: StopWordsInputProps) => {
    return (
        <ParameterDrawerInputWrapper
            inputId="stop-words-input"
            label="Stop Words"
            tooltipContent={STOP_WORDS_TOOLTIP_CONTENT}
            aria-label="Show description for Stop Words"
            tooltipTitle="Stop Words">
            <Autocomplete
                id="stop-words-input"
                fullWidth
                multiple
                value={value}
                freeSolo
                options={[]}
                onChange={onChange}
                renderTags={(stopWords: readonly string[], getTagProps) =>
                    stopWords.map((word: string, index: number) => {
                        // Show special characters '\n' & '\t' in text on UI
                        const visibleWords = word.replace(/\n/g, '\\n').replace(/\t/g, '\\t');

                        // It's encouraged to use a static key prop so we pull it out here
                        const { key, ...tagProps } = getTagProps({ index });

                        return <Chip label={visibleWords} key={key} {...tagProps} />;
                    })
                }
                renderInput={(params) => (
                    <TextField
                        {...params}
                        hiddenLabel
                        helperText='Press "Enter" to add a new word.'
                    />
                )}
            />
        </ParameterDrawerInputWrapper>
    );
};
