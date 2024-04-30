import { Box } from '@mui/material';

import { SearchBar } from './SearchBar';
import { ElevatedCard, useDesktopOrUp } from './shared';

export const SearchForm = ({
    defaultValue,
    disabled,
    showTooltip,
    noCardOnDesktop,
}: {
    defaultValue?: string;
    disabled?: boolean;
    showTooltip?: boolean;
    noCardOnDesktop?: boolean;
}) => {
    const isDesktop = useDesktopOrUp();
    const Wrapper = noCardOnDesktop && isDesktop ? Box : ElevatedCard;

    return (
        <Wrapper>
            <SearchBar defaultValue={defaultValue} disabled={disabled} showTooltip={showTooltip} />
        </Wrapper>
    );
};
