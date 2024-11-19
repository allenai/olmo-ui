import { Box, Input, useTheme } from '@mui/material';
import clsx from 'clsx';
import { useState } from 'react';

// taken from https://css-tricks.com/the-cleanest-trick-for-autogrowing-textareas/
export const AutoSizedInput = () => {
    const [value, setValue] = useState('');
    const theme = useTheme();

    return (
        <Box
            data-text-value={value}
            sx={{
                display: 'grid',
            }}>
            <textarea
                style={{
                    gridArea: '1 / 1 / 2 / 2',
                    height: 'unset',
                    resize: 'none',
                    maxWidth: '100%',
                    maxHeight: '6lh',
                }}
                value={value}
                onChange={(e) => {
                    setValue(e.target.value);
                }}
            />
            <Box
                className={clsx('MuiInput-input', 'MuiInput-multiline')}
                sx={{
                    gridArea: '1 / 1 / 2 / 2',
                    whiteSpace: 'pre-wrap',
                    visibility: 'hidden',
                    maxWidth: '100%',
                    maxHeight: '6lh',
                }}>
                {value}
            </Box>
        </Box>
    );
};
