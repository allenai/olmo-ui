import React from 'react';
import { Stack, Tooltip, Typography } from '@mui/material';
import ContentCopyIcon from '@mui/icons-material/ContentCopy';

import styled from 'styled-components';
import { CopyToClipboardButton } from '@allenai/varnish2/components';

export interface IdAndSourceProps {
    idDescriptor: string;
    id: string;
    source: string;
    truncateId?: boolean;
}

export const IdAndSourceComponent = ({
    idDescriptor,
    id,
    source,
    truncateId = true,
}: IdAndSourceProps) => {
    return (
        <ResultMetadataContainer direction="row">
            <strong>{idDescriptor}:&nbsp;</strong>
            <CopyToClipboardButton buttonContent={<ContentCopyIcon fontSize="inherit" />} text={id}>
                {truncateId ? (
                    <Tooltip title={id} placement="top">
                        <PaddedTypography noWrap>{id}</PaddedTypography>
                    </Tooltip>
                ) : (
                    <span>{id}</span>
                )}
            </CopyToClipboardButton>
            <span>
                <strong>Source:&nbsp;</strong> {source}
            </span>
        </ResultMetadataContainer>
    );
};

const PaddedTypography = styled(Typography)`
    padding-left: ${({ theme }) => theme.spacing(0.5)};
    width: 75px;
`;

const ResultMetadataContainer = styled(Stack)`
    font-size: ${({ theme }) => theme.typography.body1.fontSize};
    color: ${({ theme }) => theme.color2.N4};
    &&& svg {
        color: ${({ theme }) => theme.color2.N4};
    }
`;
