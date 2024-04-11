import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { Button, ButtonProps, IconButton, Stack, TextField, Tooltip, styled } from '@mui/material';

import InfoOutlinedIcon from '@mui/icons-material/InfoOutlined';

import { search } from '@/api/dolma/search';
import { useAppContext } from '@/AppContext';
import { DESKTOP_LAYOUT_BREAKPOINT } from '@/constants';
import { links } from '@/Links';

interface SearchBarProps {
    defaultValue?: string;
    disabled?: boolean;
    showTooltip?: boolean;
    title?: React.ReactNode;
    submitButtonProps?: ButtonProps;
}

export const SearchBar = ({
    defaultValue = '',
    disabled,
    showTooltip = true,
    title,
    submitButtonProps,
}: SearchBarProps) => {
    const [queryText, setQueryText] = useState<string>(defaultValue);
    const nav = useNavigate();
    const getMeta = useAppContext((state) => state.getMeta);
    const meta = useAppContext((state) => state.meta);
    const placeholder = meta?.count
        ? `Search ${meta.count.toLocaleString()} pretraining documents…`
        : 'Search pretraining documents…';

    useEffect(() => {
        if (meta === undefined) {
            getMeta();
        }
    }, [meta]);

    const onTextFieldChange = (e: React.ChangeEvent<HTMLTextAreaElement | HTMLInputElement>) => {
        setQueryText(e.currentTarget.value);
    };

    const submitSearch = () => {
        nav(`/search?${search.toQueryString({ query: queryText })}`);
    };

    const onKeyDown = (e: React.KeyboardEvent<HTMLDivElement>) => {
        if (e.key !== 'Enter' || queryText.trim().length === 0) {
            return;
        }
        submitSearch();
    };

    return (
        <Stack gap={1.5} alignItems="flex-start">
            {title}
            <SearchTextField
                fullWidth
                multiline
                value={queryText}
                placeholder={placeholder}
                onChange={onTextFieldChange}
                onKeyDown={onKeyDown}
                disabled={disabled}
            />
            <Stack direction="row" justifyContent="space-between" width="100%">
                <Button
                    variant="contained"
                    onClick={submitSearch}
                    sx={{ height: 'fit-content', paddingBlock: 1, paddingInline: 2 }}
                    disabled={disabled}
                    {...submitButtonProps}>
                    Submit
                </Button>
                {showTooltip && (
                    <Tooltip
                        title="About Dataset Explorer"
                        sx={{ color: (theme) => theme.palette.text.primary }}>
                        <IconButton
                            aria-label="About Dataset Explorer"
                            size="large"
                            href={links.faqs}
                            sx={{
                                color: (theme) => theme.color.N9.hex,
                                padding: 0,
                                display: { xs: 'none', [DESKTOP_LAYOUT_BREAKPOINT]: 'block' },
                            }}>
                            <InfoOutlinedIcon />
                        </IconButton>
                    </Tooltip>
                )}
            </Stack>
        </Stack>
    );
};

const SearchTextField = styled(TextField)`
    background-color: ${({ theme }) => theme.palette.background.default};
    border-radius: 4px;
    fieldset {
        border-color: ${({ theme }) => theme.color.N5.hex};
    }
    input::placeholder {
        opacity: 1;
    }
`;
