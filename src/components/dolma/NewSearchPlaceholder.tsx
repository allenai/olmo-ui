import { Link } from 'react-router-dom';
import { Stack } from '@mui/material';
import { Fragment } from 'react';

import { search } from '../../api/dolma/search';
import { NoPaddingGrid } from './shared';

export const NewSearchPlaceholder = () => {
    const exampleQueries = ['"Joe Biden"', 'Seattle', 'reddit'];

    return (
        <NoPaddingGrid item>
            <p>Or try one of these queries:</p>
            <Stack style={{ justifyContent: 'center' }} direction="row" spacing={1.5}>
                {exampleQueries.map((queryText, i) => (
                    <Fragment key={queryText}>
                        <span key={queryText}>
                            <Link
                                to={`/search?${search.toQueryString({
                                    query: queryText,
                                    offset: 0,
                                })}`}>
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
