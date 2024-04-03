import { Grid, Tooltip } from '@mui/material';
import ContentCopyIcon from '@mui/icons-material/ContentCopy';
import styled from 'styled-components';
import { CopyToClipboardButton } from '@allenai/varnish2/components';

import { search } from '../../api/dolma/search';

interface Props {
    doc: search.Document;
}

export const DocumentMeta = ({ doc }: Props) => {
    return (
        <ResultMetadataContainer container direction="row" columnGap={1}>
            <Grid item>
                <CopyToClipboardButton
                    buttonContent={<ContentCopyIcon fontSize="inherit" />}
                    text={doc.url}>
                    <Tooltip title={doc.url} placement="top">
                        <TruncatableText>
                            {doc.url ? <a href={doc.url}>{doc.url}</a> : null}
                        </TruncatableText>
                    </Tooltip>
                </CopyToClipboardButton>
            </Grid>
            <Grid item>
                <strong>Source:&nbsp;</strong> {doc.source}
            </Grid>
            <Grid item>
                <strong>Archive:&nbsp;</strong>
                {doc.archive}
            </Grid>
        </ResultMetadataContainer>
    );
};

const ResultMetadataContainer = styled(Grid)`
    font-size: ${({ theme }) => theme.typography.body1.fontSize};
    word-break: break-word;
    color: ${({ theme }) => theme.color2.N1.hex};
    &&& svg {
        color: ${({ theme }) => theme.color2.N4.hex};
    }
`;

const TruncatableText = styled.span`
    display: inline-block;
    vertical-align: top;
    padding-left: ${({ theme }) => theme.spacing(0.5)};
    max-width: 200px;
    white-space: nowrap;
    overflow: hidden;
    text-overflow: ellipsis;
`;
