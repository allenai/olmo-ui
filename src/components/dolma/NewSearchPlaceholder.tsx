import { Stack, Typography, useTheme } from '@mui/material';
import { Fragment } from 'react';
import { Link } from 'react-router-dom';

import { search } from '../../api/dolma/search';
import { NoPaddingGrid } from './shared';

export const NewSearchPlaceholder = () => {
    const exampleQueries = ['Economic Growth', 'Linda Tuhiwai Smith', 'Stoichiometry'];
    const theme = useTheme();

    return (
        <NoPaddingGrid item>
            <Typography variant="body1" sx={{ color: (theme) => theme.palette.text.primary }}>
                Or try one of these queries:
            </Typography>
            <Stack style={{ justifyContent: 'center' }} direction="row" spacing={1.5}>
                {exampleQueries.map((queryText, i) => (
                    <Fragment key={queryText}>
                        <span key={queryText}>
                            <Link
                                to={`/search?${search.toQueryString({
                                    query: queryText,
                                    offset: 0,
                                })}`}
                                style={{ color: theme.palette.primary.main }}>
                                {queryText}
                            </Link>
                        </span>
                        {i !== exampleQueries.length - 1 ? <span>&nbsp;</span> : null}
                    </Fragment>
                ))}
            </Stack>
        </NoPaddingGrid>
    );
};
