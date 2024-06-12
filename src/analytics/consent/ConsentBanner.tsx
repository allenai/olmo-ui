import { Alert, Button, Stack, SxProps, Theme } from '@mui/material';
import { useState } from 'react';
import { Link } from 'react-router-dom';

import { links } from '@/Links';

import { ConsentModal } from './ConsentModal';

interface ConsentBannerProps {
    sx?: SxProps<Theme>;
}

export const ConsentBanner = ({ sx }: ConsentBannerProps): JSX.Element => {
    const [isConsentModalOpen, setIsConsentModalOpen] = useState(false);

    return (
        <>
            <Alert
                severity="info"
                icon={false}
                sx={[
                    {
                        display: 'flex',
                        flexWrap: 'wrap',
                        justifyContent: 'center',
                    },
                    // eslint-disable-next-line @typescript-eslint/no-unsafe-assignment
                    ...(Array.isArray(sx) ? sx : [sx]),
                ]}
                action={
                    <Stack direction="row" gap={1} flexWrap="wrap">
                        <Button
                            variant="outlined"
                            onClick={() => {
                                setIsConsentModalOpen(true);
                            }}>
                            Customize
                        </Button>
                        <Button variant="outlined">Decline</Button>
                        <Button variant="contained">Approve</Button>
                    </Stack>
                }>
                Can we use cookies and external services according to our{' '}
                <Link to={links.privacyPolicy} target="_blank">
                    privacy policy
                </Link>{' '}
                to improve the browsing experience?
            </Alert>
            <ConsentModal
                open={isConsentModalOpen}
                onClose={() => {
                    setIsConsentModalOpen(false);
                }}
            />
        </>
    );
};
