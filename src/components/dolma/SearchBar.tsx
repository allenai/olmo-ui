import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { TextField, styled } from '@mui/material';

import { search } from '@/api/dolma/search';
import { useAppContext } from '@/AppContext';

export const SearchBar = ({
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
        <SearchTextField
            fullWidth
            multiline
            value={queryText}
            placeholder={placeholder}
            onChange={(e) => setQueryText(e.currentTarget.value)}
            onKeyDown={(e) => submitSearch(e)}
            disabled={disabled}
        />
    );
};

const SearchTextField = styled(TextField)`
    background-color: ${({ theme }) => theme.palette.background.default};
    fieldset {
        border-color: ${({ theme }) => theme.color.N5.hex};
    }
    input::placeholder {
        opacity: 1;
    }
`;
