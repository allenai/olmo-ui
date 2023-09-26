import React from 'react';
import { Dialog, DialogTitle } from '@mui/material';

import styled from 'styled-components';

export interface MetadataModalProps {
    handleModalClose: () => void;
    metadataModalOpen: boolean;
    metadata: any;
}

export const MetadataModal = ({
    handleModalClose,
    metadataModalOpen,
    metadata,
}: MetadataModalProps) => {
    return (
        <Dialog fullWidth maxWidth="md" onClose={handleModalClose} open={metadataModalOpen}>
            <MetadataDetails>{JSON.stringify(metadata, null, 2)}</MetadataDetails>
        </Dialog>
    );
};

const MetadataDetails = styled(DialogTitle)`
    white-space: pre-wrap;
`;
