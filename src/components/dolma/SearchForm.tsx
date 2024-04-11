import { useState, useCallback } from 'react';
import { useNavigate } from 'react-router-dom';
import { Button, Card, IconButton, Stack, Tooltip } from '@mui/material';

import InfoOutlinedIcon from '@mui/icons-material/InfoOutlined';

import { DESKTOP_LAYOUT_BREAKPOINT } from '@/constants';
import { search } from '../../api/dolma/search';
import { links } from '../../Links';
import { SearchBar } from './SearchBar';

export const SearchForm = ({
    defaultValue,
    disabled,
}: {
    defaultValue?: string;
    disabled?: boolean;
}) => {
    const nav = useNavigate();
    const [searchText, setSearchText] = useState<string>(defaultValue ?? '');
    const onSearchBarChange = useCallback((value: string) => {
        setSearchText(value);
    }, []);

    const submitSearch = () => {
        if (searchText.length > 0) {
            nav(`/search?${search.toQueryString({ query: searchText })}`);
        }
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
                <SearchBar
                    defaultValue={defaultValue}
                    disabled={disabled}
                    onChange={onSearchBarChange}
                    onSubmit={submitSearch}
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
