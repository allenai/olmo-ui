import React from 'react';
import { Dialog, DialogTitle } from '@mui/material';

import styled from 'styled-components';

import { DataDoc } from '../pages/Doc';
import { Message } from '../api/Message';

interface Props {
    onClose: () => void;
    open: boolean;
    metadata: DataDoc | Message;
}

export const MetadataModal = ({ onClose, open, metadata }: Props) => {
    return (
        <Dialog fullWidth maxWidth="md" onClose={onClose} open={open}>
            <MetadataDetails>{JSON.stringify(metadata, null, 2)}</MetadataDetails>
        </Dialog>
    );
};

const MetadataDetails = styled(DialogTitle)`
    white-space: pre-wrap;
`;
