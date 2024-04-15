import { Box } from '@mui/material';

import { SearchBar } from './SearchBar';
import { ElevatedCard } from './shared';

export const SearchForm = ({
    defaultValue,
    disabled,
    noCard,
}: {
    defaultValue?: string;
    disabled?: boolean;
    noCard?: boolean;
}) => {
    const Wrapper = noCard ? Box : ElevatedCard;
    return (
        <Wrapper>
            <SearchBar defaultValue={defaultValue} disabled={disabled} />
        </Wrapper>
    );
};
