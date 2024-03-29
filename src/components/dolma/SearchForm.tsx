import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { Button, Stack } from '@mui/material';

import { search } from '../../api/dolma/search';
import { PartialWidthTextField, Section } from '../../components/dolma/shared';
import { useAppContext } from '../../AppContext';

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
        if (e && e.key !== 'Enter') {
            return;
        }
        nav(`/search?${search.toQueryString({ query: queryText })}`);
    };

    return (
        <Section>
            <Stack direction={'row'} spacing={2}>
                <PartialWidthTextField
                    value={queryText}
                    placeholder={placeholder}
                    onChange={(e) => setQueryText(e.currentTarget.value)}
                    onKeyDown={(e) => submitSearch(e)}
                    disabled={disabled}
                />
                <Button variant="contained" onClick={() => submitSearch()} disabled={disabled}>
                    Search
                </Button>
            </Stack>
        </Section>
    );
};
