import InfoOutlinedIcon from '@mui/icons-material/InfoOutlined';
import { Box, IconButton, Typography } from '@mui/material';
import { ReactNode, useRef, useState } from 'react';

import { ResponsiveTooltip } from '@/components/thread/ResponsiveTooltip';

interface ParameterDrawerInputWrapperProps {
    label: string;
    ariaLabel: string;
    inputId: string;
    children: ReactNode | ((props: { inputLabelId: string }) => ReactNode);
    tooltipContent?: string;
    tooltipTitle?: string;
}

export const ParameterDrawerInputWrapper = ({
    tooltipContent,
    tooltipTitle,
    children,
    label,
    inputId,
    ariaLabel,
}: ParameterDrawerInputWrapperProps) => {
    const containerRef = useRef<HTMLElement>();

    const inputLabelId = `${inputId}-label`;

    const shouldShowInfoButton = tooltipTitle != null && tooltipContent != null;

    const [isTooltipOpen, setIsTooltipOpen] = useState(false);

    const toggleTooltipOpen = () => {
        setIsTooltipOpen(!isTooltipOpen);
    };

    const handleTooltipClose = () => {
        setIsTooltipOpen(false);
    };

    return (
        <Box
            // MUI's Grid component had some weird stuff going on with top padding so we're using CSS grid here instead
            display="grid"
            gridTemplateRows="auto auto"
            gridTemplateColumns="subgrid"
            gridTemplateAreas='"label label" "input input"'
            gridColumn="1 / -1"
            ref={containerRef}
            paddingY={1}>
            <Box
                display="grid"
                gridTemplateColumns="auto 1fr"
                columnGap={1}
                alignItems="center"
                gridArea="label">
                <Typography variant="body1" component="label" htmlFor={inputId} id={inputLabelId}>
                    {label}
                </Typography>
                {shouldShowInfoButton && (
                    <ResponsiveTooltip
                        anchorEl={containerRef.current}
                        dialogTitle={tooltipTitle}
                        dialogContent={tooltipContent}
                        isTooltipOpen={isTooltipOpen}
                        onTooltipClose={handleTooltipClose}
                        tooltipIdSuffix={`${inputId}-description`}>
                        <IconButton
                            tabIndex={0}
                            aria-expanded={isTooltipOpen}
                            sx={{ color: 'inherit', justifySelf: 'left' }}
                            onClick={toggleTooltipOpen}
                            aria-labelledby={ariaLabel}
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
                )}
            </Box>
            <Box display="grid" gridTemplateColumns="subgrid" gridArea="input" columnGap={1}>
                {children instanceof Function ? children({ inputLabelId }) : children}
            </Box>
        </Box>
    );
};
