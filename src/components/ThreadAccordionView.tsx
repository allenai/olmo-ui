import React, { ReactNode } from 'react';
import {
    AccordionDetails,
    AccordionProps,
    AccordionSummaryProps,
    Typography,
    styled as MuiStyled,
    Grid,
    Button,
    Dialog,
    DialogTitle,
    Accordion as MuiAccordion,
    AccordionSummary as MuiAccordionSummary,
    Stack,
} from '@mui/material';
import styled from 'styled-components';
import ArrowForwardIosSharpIcon from '@mui/icons-material/ArrowForwardIosSharp';

import { ThreadControls } from './ThreadControls';
import { Message } from '../api/Message';
import { useAppContext } from '../AppContext';
import { UserAvatar } from './avatars/UserAvatar';

interface ThreadAccordionProps {
    title: string;
    body: ReactNode;
    threadID: string;
    threadCreator: string;
    showControls: boolean;
    rootMessage: Message;
}

export const ThreadAccordionView = ({
    title,
    body,
    threadID,
    threadCreator,
    showControls = false,
    rootMessage,
}: ThreadAccordionProps) => {
    const { expandedThreadID, setExpandedThreadID } = useAppContext();

    const [metadataModalOpen, setMetadataModalOpen] = React.useState(false);
    const handleModalOpen = () => setMetadataModalOpen(true);
    const handleModalClose = () => setMetadataModalOpen(false);

    const MetadataModal = () => {
        return (
            <Dialog onClose={handleModalClose} open={metadataModalOpen}>
                <Metadata>{JSON.stringify(rootMessage, null, 4)}</Metadata>
            </Dialog>
        );
    };

    const isExpanded = expandedThreadID === threadID;

    return (
        <Accordion
            // setting unmountOnExit to help with performance
            // see: https://mui.com/material-ui/react-accordion/#performance
            TransitionProps={{ unmountOnExit: true }}
            id={threadID}
            expanded={isExpanded}
            onChange={() => {
                const id = threadID === expandedThreadID ? undefined : threadID;
                setExpandedThreadID(id);
            }}>
            <AccordionSummary aria-controls={`${threadID}-content`} id={`${threadID}-header`}>
                {isExpanded ? (
                    <Stack direction="row">
                        <PaddedHeading>
                            <UserAvatar />
                        </PaddedHeading>
                        <TitleContainer>
                            <TitleTypography sx={{ fontWeight: 'bold' }}>{title}</TitleTypography>
                        </TitleContainer>
                    </Stack>
                ) : (
                    <TitleTypography sx={{ fontWeight: 'bold' }}>{title}</TitleTypography>
                )}
            </AccordionSummary>
            <AccordionBody>{body}</AccordionBody>
            {showControls && (
                <>
                    <ControlsGrid container justifyContent="space-between" spacing={2}>
                        <Grid item>
                            <MetadataButton variant="text" onClick={handleModalOpen}>
                                <Typography>View Metadata</Typography>
                            </MetadataButton>
                            <MetadataModal />
                        </Grid>
                        <Grid item>
                            <ThreadControls
                                threadCreator={threadCreator}
                                rootMessage={rootMessage}
                            />
                        </Grid>
                    </ControlsGrid>
                </>
            )}
        </Accordion>
    );
};

const MetadataButton = styled(Button)`
    && {
        color: ${({ theme }) => theme.color2.B4};
    }
`;

const Metadata = styled(DialogTitle)`
    white-space: pre;
`;

const ControlsGrid = styled(Grid)`
    padding-left: ${({ theme }) => theme.spacing(3)};
    padding-right: ${({ theme }) => theme.spacing(2)};
    padding-bottom: ${({ theme }) => theme.spacing(2)};
`;

const TitleContainer = styled.div`
    padding-top: ${({ theme }) => theme.spacing(2)};
    padding-bottom: ${({ theme }) => theme.spacing(2)};
    margin-left: ${({ theme }) => theme.spacing(1)};
`;

const TitleTypography = styled(Typography)`
    color: ${({ theme }) => theme.color2.B5};
`;

const PaddedHeading = styled.span`
    margin-left: ${({ theme }) => theme.spacing(0.5)};
    margin-top: ${({ theme }) => theme.spacing(1)};
`;

const Accordion = MuiStyled((props: AccordionProps) => (
    <MuiAccordion disableGutters elevation={0} square {...props} />
))(({ theme }) => ({
    marginBottom: theme.spacing(1),
    border: `1px solid ${theme.palette.divider}`,
    borderRadius: theme.spacing(1), // TODO: switch this out with theme.shape?
    '&:before': {
        display: 'none',
    },
    backgroundColor: 'white',
}));

const AccordionSummary = MuiStyled((props: AccordionSummaryProps) => (
    <MuiAccordionSummary
        expandIcon={<ArrowForwardIosSharpIcon sx={{ fontSize: '12px' }} />}
        {...props}
    />
))(({ theme }) => ({
    userSelect: 'text',
    flexDirection: 'row-reverse',
    '& .MuiAccordionSummary-expandIconWrapper.Mui-expanded': {
        transform: 'rotate(90deg)',
    },
    '& .MuiAccordionSummary-content': {
        marginLeft: theme.spacing(1),
        marginRight: theme.spacing(2),
    },
}));

const AccordionBody = MuiStyled(AccordionDetails)(({ theme }) => ({
    padding: theme.spacing(1),
    marginLeft: theme.spacing(2),
    marginRight: theme.spacing(2),
}));
