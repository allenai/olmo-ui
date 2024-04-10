import { Card, Stack, Typography, useMediaQuery, useTheme } from '@mui/material';

import { DESKTOP_LAYOUT_BREAKPOINT } from '@/constants';
import { biggerContainerQuery, smallerContainerQuery } from '@/utils/container-query-utils';
import { SearchTextField } from '../dolma/SearchForm';
import { SearchBar } from '../dolma/SearchBar';

// interface SearchDatasetCardProp extends PropsWithChildren {}

export const SearchDatasetCard = (): JSX.Element => {
    const theme = useTheme();
    const isDesktopOrUp = useMediaQuery(theme.breakpoints.up(DESKTOP_LAYOUT_BREAKPOINT));

    return (
        <Card
            variant={isDesktopOrUp ? 'elevation' : 'outlined'}
            sx={(theme) => ({
                padding: 0,
                [biggerContainerQuery(theme)]: {
                    padding: 2,
                },

                backgroundColor: (theme) => theme.palette.background.default,

                border: 0,
                [smallerContainerQuery(theme)]: {
                    borderRadius: 0,
                },
            })}>
            <Stack gap={1.5} alignItems="flex-start">
                <Typography variant="h3" color="primary">Search Training Data</Typography>
                <SearchBar />
                <Stack direction="row" justifyContent="space-between" width="100%">
                    {/* <Button
                        variant="contained"
                        onClick={() => submitSearch()}
                        sx={{ height: 'fit-content', paddingBlock: 1, paddingInline: 2 }}
                        disabled={disabled}>
                        Submit
                    </Button> */}
                </Stack>
            </Stack>
        </Card>
    );
};
