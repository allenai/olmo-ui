import {
    Box,
    FormControl,
    FormHelperText,
    formHelperTextClasses,
    SxProps,
    Theme,
} from '@mui/material';
import { ChangeEventHandler, forwardRef, KeyboardEventHandler, ReactNode } from 'react';

// The textarea and div that holds the contents need to have the same styles so they don't get out of sync
const textareaStyles: SxProps<Theme> = {
    gridArea: 'prompt',
    alignSelf: 'stretch',
    height: 'unset',
    resize: 'none',
    maxWidth: '100%',
    overflowWrap: 'anywhere',
    // We want the max height to be the same as about X lines, the lh unit does that for us
    maxHeight: '5lh',
    lineHeight: 'inherit',
    fontSize: 'inherit',
    fontFamily: 'inherit',
    whiteSpace: 'pre-wrap',
    outline: 'none',
    border: 'none',
    paddingInline: 1,
    paddingBlock: '4px',

    background: 'none',

    ':focus, :focus-visible': {
        outline: 'none',
        border: 'none',
    },
};

const AUTO_SIZED_INPUT_CLASSNAME = 'auto-sized-input';

interface AutoSizedInputProps {
    placeholder: string;
    'aria-label': string;
    onChange: ChangeEventHandler<HTMLTextAreaElement>;
    name: string;
    value: string;
    errorMessage?: ReactNode;
    onKeyDown?: KeyboardEventHandler<HTMLTextAreaElement>;
    startAdornment?: ReactNode;
    endAdornment?: ReactNode;
}

// taken from https://css-tricks.com/the-cleanest-trick-for-autogrowing-textareas/
export const PromptInput = forwardRef<HTMLTextAreaElement, AutoSizedInputProps>(
    function PromptInput(
        {
            placeholder,
            onChange,
            'aria-label': ariaLabel,
            value = '',
            onKeyDown,
            name,
            errorMessage,
            startAdornment,
            endAdornment,
        },
        ref
    ) {
        return (
            <FormControl fullWidth error={errorMessage != null}>
                <Box
                    data-text-value={value}
                    sx={(theme) => ({
                        // start styles stolen from MUI https://github.com/mui/material-ui/blob/e0894407dd8c564f853452dbed278f3fa7c04933/packages/mui-material/src/InputBase/InputBase.js#L109
                        ...theme.typography.body1,
                        cursor: 'text',
                        lineHeight: '1.4375em',

                        // end styles stolen from MUI

                        display: 'grid',
                        gridTemplateColumns: 'auto 1fr auto',
                        gridTemplateAreas: '"start-adornment prompt end-adornment"',
                        alignItems: 'center',
                        columnGap: theme.spacing(1),

                        borderRadius: theme.spacing(3.5),
                        paddingBlock: 1,
                        paddingInline: 2,
                        background: theme.palette.background.drawer.secondary,
                        border: '2px solid transparent',

                        [`&:has(:focus-visible)`]: {
                            border: (theme) => `2px solid ${theme.palette.secondary.main}`,
                        },

                        '@supports not (selector(:focus-visible)) or (selector(:has(*))': {
                            ':focus-within': {
                                border: (theme) => `2px solid ${theme.palette.secondary.main}`,
                            },
                        },
                    })}>
                    {startAdornment != null && (
                        <Box sx={{ gridArea: 'start-adornment' }}>{startAdornment}</Box>
                    )}
                    <Box
                        component="textarea"
                        ref={ref}
                        placeholder={placeholder}
                        onKeyDown={onKeyDown}
                        name={name}
                        rows={1}
                        className={AUTO_SIZED_INPUT_CLASSNAME}
                        aria-label={ariaLabel}
                        sx={(theme) => {
                            // start styles stolen from MUI https://github.com/mui/material-ui/blob/e0894407dd8c564f853452dbed278f3fa7c04933/packages/mui-material/src/InputBase/InputBase.js#L109
                            const placeholderStyles = {
                                color: 'currentColor',
                                opacity: theme.palette.mode === 'light' ? 0.42 : 0.5,
                                transition: theme.transitions.create('opacity', {
                                    duration: theme.transitions.duration.shorter,
                                }),
                            };
                            // end styles stolen from MUI

                            return {
                                ...textareaStyles,
                                color: theme.palette.text.primary,
                                caretColor: theme.palette.secondary.main,

                                // start styles stolen from MUI https://github.com/mui/material-ui/blob/e0894407dd8c564f853452dbed278f3fa7c04933/packages/mui-material/src/InputBase/InputBase.js#L109
                                '&::-webkit-input-placeholder': placeholderStyles,
                                '&::-moz-placeholder': placeholderStyles, // Firefox 19+
                                '&::-ms-input-placeholder': placeholderStyles, // Edge
                                // end styles stolen from MUI
                            };
                        }}
                        value={value}
                        onChange={(e) => {
                            onChange(e);
                        }}
                    />
                    {/* 
                        This div keeps the same contents as the input so it resizes whenever it changes
                        whenever it resizes it'll expand the parent, which also expands the input
                    */}
                    <Box
                        aria-hidden
                        sx={{
                            ...textareaStyles,
                            visibility: 'hidden',
                        }}>
                        {/* This intentionally has a space at the end, the css-tricks article says it helps it be smoother */}
                        {value}{' '}
                    </Box>
                    <Box sx={{ gridArea: 'end-adornment', alignSelf: 'end' }}>{endAdornment}</Box>
                </Box>
                <FormHelperText
                    sx={{
                        [formHelperTextClasses.error]: {},
                    }}>
                    {errorMessage}
                </FormHelperText>
            </FormControl>
        );
    }
);
