import { Box } from '@mui/material';
import { useMatch } from 'react-router-dom';

import { links } from '@/Links';

import { NewSearchPlaceholder } from './NewSearchPlaceholder';
import { SearchBar } from './SearchBar';
import { BaseCard, useDesktopOrUp } from './shared';

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
    const Wrapper = noCardOnDesktop && isDesktop ? Box : BaseCard;
    const dolmaRouteMatch = useMatch(links.datasetExplorer);

    return (
        <Wrapper>
            <SearchBar
                defaultValue={defaultValue}
                disabled={disabled}
                showTooltip={showTooltip}
                title="Search the dataset"
            />
            {dolmaRouteMatch && <NewSearchPlaceholder />}
        </Wrapper>
    );
};
