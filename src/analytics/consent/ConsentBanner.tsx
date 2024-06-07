import { Alert, Button, Stack } from '@mui/material';
import { useState } from 'react';
import { Link } from 'react-router-dom';

import { links } from '@/Links';

import { ConsentModal } from './ConsentModal';

export const ConsentBanner = (): JSX.Element => {
    const [isConsentModalOpen, setIsConsentModalOpen] = useState(false);

    return (
        <>
            <Alert
                severity="info"
                icon={false}
                action={
                    <Stack direction="row" gap={1}>
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
