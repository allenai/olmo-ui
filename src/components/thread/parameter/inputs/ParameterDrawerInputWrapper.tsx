import { css } from '@allenai/varnish-panda-runtime/css';
import InfoOutlinedIcon from '@mui/icons-material/InfoOutlined';
import { Box, BoxProps, IconButton, Typography } from '@mui/material';
import { ReactNode, useRef, useState } from 'react';

import {
    ResponsiveTooltip,
    type ResponsiveTooltipProps,
} from '@/components/thread/ResponsiveTooltip';

export interface ParameterDrawerInputWrapperProps
    extends Omit<BoxProps, 'children' | 'aria-label'> {
    label: string;
    'aria-label': string;
    inputId: string;
    children: ReactNode | ((props: { inputLabelId: string }) => ReactNode);
    tooltipContent?: string;
    tooltipTitle?: string;
    tooltipPlacement?: ResponsiveTooltipProps['placement'];
}

export const ParameterDrawerInputWrapper = ({
    tooltipContent,
    tooltipTitle,
    tooltipPlacement,
    children,
    label,
    inputId,
    'aria-label': ariaLabel,
    ...boxProps
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
            paddingY={1}
            {...boxProps}
            ref={containerRef}>
            <Box display="flex" flexDirection="row" gap={1} alignItems="center" gridArea="label">
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
                        tooltipIdSuffix={`${inputId}-description`}
                        tooltipClassName={css({ right: '2' })}
                        placement={tooltipPlacement}>
                        <IconButton
                            tabIndex={0}
                            aria-expanded={isTooltipOpen}
                            sx={{ color: 'inherit', justifySelf: 'left', opacity: '50%' }}
                            onClick={toggleTooltipOpen}
                            aria-label={ariaLabel}
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
            <Box
                display="grid"
                gridTemplateColumns="subgrid"
                gridArea="input"
                columnGap={3}
                alignItems="center">
                {children instanceof Function ? children({ inputLabelId }) : children}
            </Box>
        </Box>
    );
};
