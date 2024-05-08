import {
    Autocomplete,
    AutocompleteProps,
    Box,
    Chip,
    FormControlLabel,
    FormLabel,
    InputLabel,
    TextField,
    Typography,
} from '@mui/material';
import { Stack } from '@mui/system';

import { InfoButton } from './InfoButton';

interface StopWordsInputProps {
    value?: string[];
    onChange: AutocompleteProps<string, true, false, true>['onChange'];
}
export const StopWordsInput = ({ value = [], onChange }: StopWordsInputProps) => {
    return (
        <Box width={1}>
            <Stack direction="row" alignItems="center" paddingBlockEnd={2}>
                <Typography variant="body1" component="label" htmlFor="stop-words-input">
                    Stop Words
                </Typography>
                <InfoButton
                    onClick={() => {
                        console.log('click');
                    }}
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
