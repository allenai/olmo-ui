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
        <Grid
            width={1}
            container
            alignItems="center"
            ref={containerRef}
            // Grid didn't like getting passed a ref but Box is OK with it for some reason
            component={Box}
            rowSpacing={2}
            paddingBlockEnd={1}>
            <Grid item>
                <Typography variant="body1" component="label" htmlFor={inputId}>
                    {label}
                </Typography>
            </Grid>
            {shouldShowInfoButton && (
                <Grid item>
                    <ParameterInfoButton
                        anchorElement={containerRef.current}
                        tooltipTitle={tooltipTitle}
                        tooltipContent={tooltipContent}
                        tooltipIdSuffix={`${inputId}-description`}
                    />
                </Grid>
            )}
            <Grid item xs={12}>
                {children instanceof Function ? children({ inputLabelId }) : children}
            </Grid>
        </Grid>
    );
};
