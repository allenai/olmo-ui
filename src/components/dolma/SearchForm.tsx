import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { Button, Card, IconButton, Stack, TextField, Tooltip, styled } from '@mui/material';

import InfoOutlinedIcon from '@mui/icons-material/InfoOutlined';

import { DESKTOP_LAYOUT_BREAKPOINT } from '@/constants';
import { search } from '../../api/dolma/search';
import { useAppContext } from '../../AppContext';
import { links } from '../../Links';

// test
const SearchTextField = styled(TextField)`
    background-color: ${({ theme }) => theme.palette.background.default};
    fieldset {
        border-color: ${({ theme }) => theme.color.N5.hex};
    }
    input::placeholder {
        opacity: 1;
    }
`;

export const SearchForm = ({
    defaultValue,
    disabled,
}: {
    defaultValue?: string;
    disabled?: boolean;
}) => {
    const [queryText, setQueryText] = useState<string>(defaultValue ?? '');

    const getMeta = useAppContext((state) => state.getMeta);
    const meta = useAppContext((state) => state.meta);
    useEffect(() => {
        getMeta();
    }, []);
    const placeholder = meta?.count
        ? `Search ${meta.count.toLocaleString()} pretraining documents…`
        : 'Search pretraining documents…';

    const nav = useNavigate();
    const submitSearch = (e?: React.KeyboardEvent) => {
        if ((e && e.key !== 'Enter') || queryText.trim().length === 0) {
            return;
        }
        nav(`/search?${search.toQueryString({ query: queryText })}`);
    };
    return (
        <Card
            variant="elevation"
            elevation={1}
            sx={{
                padding: (theme) => theme.spacing(2.25),
                backgroundColor: (theme) => theme.palette.background.default,
            }}>
            <Stack gap={1.5} alignItems="flex-start">
                <SearchTextField
                    fullWidth
                    multiline
                    value={queryText}
                    placeholder={placeholder}
                    onChange={(e) => setQueryText(e.currentTarget.value)}
                    onKeyDown={(e) => submitSearch(e)}
                    disabled={disabled}
                />
                <Stack direction="row" justifyContent="space-between" width="100%">
                    <Button
                        variant="contained"
                        onClick={() => submitSearch()}
                        sx={{ height: 'fit-content', paddingBlock: 1, paddingInline: 2 }}
                        disabled={disabled}>
                        Submit
                    </Button>
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
                </Stack>
            </Stack>
        </Card>
    );
};
