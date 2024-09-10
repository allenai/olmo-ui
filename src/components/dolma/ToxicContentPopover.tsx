import InfoOutlinedIcon from '@mui/icons-material/InfoOutlined';
import { IconButton } from '@mui/material';
import { useState } from 'react';

import { ResponsiveTooltip } from '../thread/ResponsiveTooltip';

const TOOLTIP_TITLE = 'Toxicity Filter';

const TOOLTIP_CONTENT =
    "To minimize the risk of encountering documents with disturbing content while exploring the dataset, we've implemented a simple filter that scans document previews for offensive language. You have the option to reveal the blurred text if you choose to do so. Please note that our filter only detects specific toxic or offensive words. You might still encounter potentially harmful content if it doesn't contain any bad word.";

interface ToxicContentPopoverProps {
    anchorEl: HTMLElement | undefined;
}

export const ToxicContentPopover = ({ anchorEl }: ToxicContentPopoverProps) => {
    const [isTooltipOpen, setIsTooltipOpen] = useState(false);

    const toggleTooltipOpen = () => {
        setIsTooltipOpen(!isTooltipOpen);
    };

    const handleTooltipClose = () => {
        setIsTooltipOpen(false);
    };

    return (
        <>
            {/* TODO: we need to figure out the right color for the info icon we just inherit from text for now */}
            <ResponsiveTooltip
                anchorEl={anchorEl}
                dialogTitle={TOOLTIP_TITLE}
                dialogContent={TOOLTIP_CONTENT}
                isTooltipOpen={isTooltipOpen}
                onTooltipClose={handleTooltipClose}
                placement="right-end"
                tooltipIdSuffix="toxic-content-description">
                <IconButton
                    tabIndex={0}
                    aria-expanded={isTooltipOpen}
                    sx={{ color: 'inherit', justifySelf: 'start' }}
                    onClick={toggleTooltipOpen}>
                    <InfoOutlinedIcon />
                </IconButton>
            </ResponsiveTooltip>
        </>
    );
};
