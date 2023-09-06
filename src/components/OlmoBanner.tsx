import * as React from 'react';
import styled from 'styled-components';
import Grid from '@mui/material/Grid';
import { Content, logos } from '@allenai/varnish2/components';

export interface BannerProps {
    transparentBackground?: boolean;
    endSlot?: React.ReactNode; // a space on the right side of the banner for additional content
}

export const BannerLink = styled.a`
    display: inline-block;
    padding: 5px 0 2px 0;
`;

const BannerContent = styled(Content)`
    padding-top: ${({ theme }) => theme.spacing(1)};
    padding-bottom: ${({ theme }) => theme.spacing(1)};
`;

const BannerContainer = styled.div<{ transparentBackground?: boolean }>`
    background: ${({ transparentBackground, theme }) =>
        transparentBackground ? `transparent` : theme.color2.N9};
    margin: ${({ theme }) => theme.spacing(1)};
    padding: ${({ theme }) => theme.spacing(0.5)};
    border-radius: 10px;
`;

export const OlmoBanner = React.forwardRef<HTMLDivElement, BannerProps>(
    ({ transparentBackground, endSlot }) => (
        <BannerContainer transparentBackground={transparentBackground}>
            <BannerContent>
                <Grid container justifyContent="space-between" spacing={2}>
                    <Grid item>
                        <BannerLink href="https://allenai.org">
                            <logos.AI2Logo color="white" size="md" />
                        </BannerLink>
                    </Grid>
                    {endSlot && <Grid item>{endSlot}</Grid>}
                </Grid>
            </BannerContent>
        </BannerContainer>
    )
);
