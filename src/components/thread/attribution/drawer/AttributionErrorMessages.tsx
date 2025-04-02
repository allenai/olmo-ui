import { Stack, Typography } from '@mui/material';
import type { PropsWithChildren } from 'react';

import { NoDocsIcon } from '@/components/assets/NoDocsIcon';

const ErrorMessageWrapper = ({ children }: PropsWithChildren) => {
    return (
        <Stack
            sx={{
                margin: 2,
                alignItems: 'center',
                justifyContent: 'center',
                display: 'flex',
                gap: 1.5,
                flex: 1,
            }}>
            <NoDocsIcon
                sx={(theme) => ({
                    width: 52.5,
                    height: 55,
                    fill: theme.palette.text.primary,
                    opacity: 0.5,
                })}
            />
            <Typography align="center">{children}</Typography>
        </Stack>
    );
};

export const UnavailableMessage = () => {
    return (
        <ErrorMessageWrapper>
            This message used a model that doesn&apos;t have OLMoTrace supported. View OLMoTrace for
            another message or prompt a model that does have OLMoTrace supported.
        </ErrorMessageWrapper>
    );
};

export const BlockedMessage = () => {
    return (
        <ErrorMessageWrapper>
            OLMoTrace is blocked for this message due to legal compliance. Please try another
            message.
        </ErrorMessageWrapper>
    );
};

export const OverloadedMessage = () => {
    return (
        <ErrorMessageWrapper>
            OLMoTrace is currently overloaded. Please try again later.
        </ErrorMessageWrapper>
    );
};
