import { Card } from '@mui/material';

import { SearchBar } from './SearchBar';

export const SearchForm = ({
    defaultValue,
    disabled,
}: {
    defaultValue?: string;
    disabled?: boolean;
}) => {
    return (
        <Card
            variant="elevation"
            elevation={1}
            sx={{
                padding: (theme) => theme.spacing(2.25),
                backgroundColor: (theme) => theme.palette.background.default,
            }}>
            <SearchBar defaultValue={defaultValue} disabled={disabled} />
        </Card>
    );
};
