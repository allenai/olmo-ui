import InfoOutlinedIcon from '@mui/icons-material/InfoOutlined';
import { IconButton } from '@mui/material';
import { type MouseEventHandler } from 'react';

import { ResponsiveTooltip } from '../ResponsiveTooltip';

interface InfoButtonProps {
    onClick: MouseEventHandler;
    isTooltipOpen?: boolean;
    label: string;
}

export const InfoButton = ({ onClick, isTooltipOpen, label }: InfoButtonProps) => {
    return (
        <IconButton
            tabIndex={0}
            aria-label={label}
            aria-expanded={isTooltipOpen}
            sx={{ color: 'inherit' }}
            onClick={onClick}>
            <InfoOutlinedIcon />
        </IconButton>
    );
};

export const InfoButtonWithTooltip = () => {
    return (
        <ResponsiveTooltip
            anchorEl={boxRef.current}
            dialogTitle={dialogTitle}
            dialogContent={dialogContent}
            isTooltipOpen={isTooltipOpen}
            onTooltipClose={handleTooltipClose}>
            <IconButton
                tabIndex={0}
                aria-label={`More about ${dialogTitle}`}
                aria-expanded={isTooltipOpen}
                sx={{ color: 'inherit' }}
                onClick={handleTooltipOpen}>
                <InfoOutlinedIcon />
            </IconButton>
        </ResponsiveTooltip>
    );
};
