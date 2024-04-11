import { Button, Card, Stack, Typography } from '@mui/material';
import OpenInNewIcon from '@mui/icons-material/OpenInNew';
import { useCallback, useState } from 'react';
import { useNavigate } from 'react-router-dom';

import { SearchBar } from '@/components/dolma/SearchBar';
import { search } from '@/api/dolma/search';

export const SearchDatasetCard = (): JSX.Element => {
    const nav = useNavigate();
    const [searchText, setSearchText] = useState<string>('');

    const onSearchBarChange = useCallback((value: string) => {
        setSearchText(value);
    }, []);

    const onSubmit = () => {
        if (searchText.length > 0) {
            nav(`/search?${search.toQueryString({ query: searchText })}`);
        }
    };

    return (
        <Card
            sx={() => ({
                backgroundColor: (theme) => theme.color.B10.hex,
                border: 0,
                padding: 4,
            })}>
            <Stack gap={1.5} alignItems="flex-start">
                <Typography
                    variant="h5"
                    component="h2"
                    margin={0}
                    color={(theme) => theme.palette.primary.contrastText}>
                    Search Training Data
                </Typography>
                <SearchBar onChange={onSearchBarChange} />
                <Button
                    variant="contained"
                    onClick={onSubmit}
                    sx={{ height: 'fit-content', paddingBlock: 1, paddingInline: 2 }}
                    endIcon={<OpenInNewIcon />}>
                    Submit
                </Button>
            </Stack>
        </Card>
    );
};
