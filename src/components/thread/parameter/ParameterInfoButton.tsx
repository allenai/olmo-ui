import InfoOutlinedIcon from '@mui/icons-material/InfoOutlined';
import { IconButton } from '@mui/material';
import { useState } from 'react';

import { ResponsiveTooltip } from '../ResponsiveTooltip';

interface ParameterInfoButtonProps {
    anchorElement?: HTMLElement;

    tooltipTitle: string;
    tooltipContent: string;
}

export const ParameterInfoButton = ({
    tooltipTitle,
    tooltipContent,
    anchorElement,
}: ParameterInfoButtonProps) => {
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
                title={`More about ${tooltipTitle}`}
                aria-expanded={isTooltipOpen}
                sx={{ color: 'inherit' }}
                onClick={toggleTooltipOpen}
                onKeyDown={(event) => {
                    // This is currently used in the parameters drawer that has ESC handling as well
                    // we need to stop propagation so the drawer doesn't close when we  just want to close the tooltip
                    event.stopPropagation();

                    if (event.key === 'Escape') {
                        handleTooltipClose();
                    }
                }}>
                <InfoOutlinedIcon />
            </IconButton>
        </ResponsiveTooltip>
    );
};
