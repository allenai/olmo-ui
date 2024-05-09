import InfoOutlinedIcon from '@mui/icons-material/InfoOutlined';
import { IconButton } from '@mui/material';
import { useState } from 'react';

import { ResponsiveTooltip } from '../ResponsiveTooltip';

interface InfoButtonWithTooltipProps {
    anchorElement?: HTMLElement;

    tooltipTitle: string;
    tooltipContent: string;
}

export const InfoButtonWithTooltip = ({
    tooltipTitle,
    tooltipContent,
    anchorElement,
}: InfoButtonWithTooltipProps) => {
    const [isTooltipOpen, setIsTooltipOpen] = useState(false);

    const toggleTooltipOpen = () => {
        setIsTooltipOpen(!isTooltipOpen);
    };

    const handleTooltipClose = () => {
        setIsTooltipOpen(false);
    };

    return (
        <ResponsiveTooltip
            anchorEl={anchorElement}
            dialogTitle={tooltipTitle}
            dialogContent={tooltipContent}
            isTooltipOpen={isTooltipOpen}
            onTooltipClose={handleTooltipClose}>
            <IconButton
                tabIndex={0}
                aria-label={`More about ${tooltipTitle}`}
                aria-expanded={isTooltipOpen}
                sx={{ color: 'inherit' }}
                onClick={toggleTooltipOpen}>
                <InfoOutlinedIcon />
            </IconButton>
        </ResponsiveTooltip>
    );
};
