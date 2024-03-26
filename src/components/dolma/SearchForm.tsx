import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { Button, Stack } from '@mui/material';

import { useMetaStore } from '../../store/MetaStore';
import { search } from '../../api/dolma/search';
import { PartialWidthTextField, Section } from '../../components/dolma/shared';

export const SearchForm = ({
    defaultValue,
    disabled,
}: {
    defaultValue?: string;
    disabled?: boolean;
}) => {
    const [queryText, setQueryText] = useState<string>(defaultValue ?? '');

    const store = useMetaStore();
    useEffect(() => {
        store.getMeta();
    }, []);
    const placeholder = store.meta?.count
        ? `Search ${store.meta.count.toLocaleString()} pretraining documents…`
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
