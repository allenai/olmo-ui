import { Box } from '@mui/material';

import { SearchBar } from './SearchBar';
import { ElevatedCard, isDesktopOrUp } from './shared';

export const SearchForm = ({
    defaultValue,
    disabled,
    noCardOnDesktop,
}: {
    defaultValue?: string;
    disabled?: boolean;
    noCardOnDesktop?: boolean;
}) => {
    const Wrapper = noCardOnDesktop && isDesktopOrUp() ? Box : ElevatedCard;
    return (
        <Wrapper>
            <SearchBar defaultValue={defaultValue} disabled={disabled} />
        </Wrapper>
    );
};
