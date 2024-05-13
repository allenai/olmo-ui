import { Box, Grid, Typography } from '@mui/material';
import { ComponentProps, ReactNode, useRef } from 'react';

import { ParameterInfoButton } from './ParameterInfoButton';

type PickedParameterInfoButtonProps = Pick<
    ComponentProps<typeof ParameterInfoButton>,
    'tooltipContent' | 'tooltipTitle'
>;

interface ParameterDrawerInputWrapperProps extends Partial<PickedParameterInfoButtonProps> {
    label: string;
    inputId: string;
    children: ReactNode | ((props: { inputLabelId: string }) => ReactNode);
}

export const ParameterDrawerInputWrapper = ({
    tooltipContent,
    tooltipTitle,
    children,
    label,
    inputId,
}: ParameterDrawerInputWrapperProps) => {
    const containerRef = useRef<HTMLElement>();

    const inputLabelId = `${inputId}-label`;

    const shouldShowInfoButton = tooltipTitle != null && tooltipContent != null;

    return (
        <Box
            display="grid"
            gridTemplateAreas={`"label info-button"
                                "input input"`}
            gridTemplateColumns="auto 1fr"
            rowGap={2}
            columnGap={1}
            width={1}
            alignItems="center"
            ref={containerRef}
            paddingY={1}>
            <Typography variant="body1" component="label" htmlFor={inputId}>
                {label}
            </Typography>
            {shouldShowInfoButton && (
                <ParameterInfoButton
                    anchorElement={containerRef.current}
                    tooltipTitle={tooltipTitle}
                    tooltipContent={tooltipContent}
                    tooltipIdSuffix={`${inputId}-description`}
                />
            )}
            <Box sx={{ gridArea: 'input' }}>
                {children instanceof Function ? children({ inputLabelId }) : children}
            </Box>
        </Box>
    );
};
