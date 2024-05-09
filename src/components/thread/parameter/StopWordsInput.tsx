import { Autocomplete, AutocompleteProps, Box, Chip, TextField, Typography } from '@mui/material';
import { Stack } from '@mui/system';
import { useRef } from 'react';

import { ParameterInfoButton } from './ParameterInfoButton';

const STOP_WORDS_TOOLTIP_CONTENT =
    'Stop words are a set of character sequences that stop the model from generating additional text. The output will not contain the stop word. Press Tab to add a new word.';

interface StopWordsInputProps {
    value?: string[];
    onChange: AutocompleteProps<string, true, false, true>['onChange'];
}

export const StopWordsInput = ({ value = [], onChange }: StopWordsInputProps) => {
    const boxRef = useRef<HTMLElement>();

    return (
        <Box width={1} ref={boxRef}>
            <Stack direction="row" alignItems="center" paddingBlockEnd={2}>
                <Typography variant="body1" component="label" htmlFor="stop-words-input">
                    Stop Words
                </Typography>
                <ParameterInfoButton
                    anchorElement={boxRef.current}
                    tooltipTitle="Stop Words"
                    tooltipContent={STOP_WORDS_TOOLTIP_CONTENT}
                />
            </Stack>
            <Autocomplete
                id="stop-words-input"
                fullWidth
                multiple
                value={value}
                freeSolo
                options={value}
                onChange={onChange}
                renderTags={(stopWords: readonly string[], getTagProps) =>
                    stopWords.map((option: string, index: number) => {
                        // It's encouraged to use a static key prop so we pull it out here
                        const { key, ...tagProps } = getTagProps({ index });

                        return <Chip label={option} key={key} {...tagProps} />;
                    })
                }
                renderInput={(params) => (
                    <TextField
                        {...params}
                        hiddenLabel
                        placeholder="Enter Stop Word"
                        helperText={
                            <Typography variant="caption">
                                Press &quot;Enter&quot; to add a new word.
                            </Typography>
                        }
                    />
                )}
            />
        </Box>
    );
};
