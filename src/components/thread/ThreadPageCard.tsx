import { Card, CardContent, Stack } from '@mui/material';
import { PropsWithChildren } from 'react';

interface ThreadPageCardProps extends PropsWithChildren {}

export const ThreadPageCard = ({ children }: ThreadPageCardProps): JSX.Element => {
    return (
        <Card
            raised
            elevation={1}
            sx={{
                padding: 2,
                backgroundColor: (theme) => theme.palette.background.default,
                height: 'fit-content',
            }}>
            <CardContent component={Stack} gap={2}>
                {children}
            </CardContent>
        </Card>
    );
};
