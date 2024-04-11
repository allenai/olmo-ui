import { Card, Typography } from '@mui/material';
import OpenInNewIcon from '@mui/icons-material/OpenInNew';

import { SearchBar } from '@/components/dolma/SearchBar';

export const SearchDatasetCard = (): JSX.Element => {
    return (
        <Card
            sx={() => ({
                backgroundColor: (theme) => theme.color.B10.hex,
                border: 0,
                padding: 4,
            })}>
            <SearchBar
                title={
                    <Typography
                        variant="h5"
                        component="h2"
                        margin={0}
                        color={(theme) => theme.palette.primary.contrastText}>
                        Search Training Data
                    </Typography>
                }
                showTooltip={false}
                submitButtonProps={{
                    variant: 'contained',
                    sx: { height: 'fit-content', paddingBlock: 1, paddingInline: 2 },
                    endIcon: <OpenInNewIcon />,
                }}
            />
        </Card>
    );
};
