import {
    Autocomplete,
    AutocompleteProps,
    Chip,
    FormControlLabel,
    InputLabel,
    TextField,
    Typography,
} from '@mui/material';

import { InfoButton } from './InfoButton';

interface StopWordsInputProps {
    value?: string[];
    onChange: AutocompleteProps<string, true, false, true>['onChange'];
}
export const StopWordsInput = ({ value = [], onChange }: StopWordsInputProps) => {
    return (
        <InputLabel sx={{ cursor: 'pointer', display: 'flex', flexDirection: 'column' }}>
            <Typography variant="body1" component="span" paddingBlockEnd={2}>
                Stop Words{' '}
                <InfoButton
                    onClick={() => {
                        console.log('click');
                    }}
                />
            </Typography>
            <Autocomplete
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
        </InputLabel>
    );
};
