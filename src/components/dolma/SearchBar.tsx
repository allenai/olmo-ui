import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { TextField, styled } from '@mui/material';

import { search } from '@/api/dolma/search';
import { useAppContext } from '@/AppContext';

interface SearchBarProps {
    defaultValue?: string;
    disabled?: boolean;
    onChange?: (value: string) => void;
    onSubmit?: (value: string) => void;
}

export const SearchBar = ({ defaultValue = '', disabled, onChange, onSubmit }: SearchBarProps) => {
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
    }, []);

    const onTextFieldChange = (e: React.ChangeEvent<HTMLTextAreaElement | HTMLInputElement>) => {
        setQueryText(e.currentTarget.value);
        if (onChange !== undefined) {
            onChange(e.currentTarget.value);
        }
    };

    const onKeyDown = (e: React.KeyboardEvent<HTMLDivElement>) => {
        if (e.key !== 'Enter' || queryText.trim().length === 0) {
            return;
        }

        if (onSubmit === undefined) {
            nav(`/search?${search.toQueryString({ query: queryText })}`);
        } else {
            onSubmit(queryText);
        }
    };

    return (
        <SearchTextField
            fullWidth
            multiline
            value={queryText}
            placeholder={placeholder}
            onChange={onTextFieldChange}
            onKeyDown={onKeyDown}
            disabled={disabled}
        />
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
