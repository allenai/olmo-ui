import React, { ReactNode } from 'react';
import {
    AccordionDetails,
    AccordionProps,
    AccordionSummaryProps,
    Typography,
    Grid,
    Button,
    Accordion as MuiAccordion,
    AccordionSummary as MuiAccordionSummary,
} from '@mui/material';
import PersonIcon from '@mui/icons-material/Person';
import styled from 'styled-components';
import ArrowForwardIosSharpIcon from '@mui/icons-material/ArrowForwardIosSharp';

import { ThreadControls } from './ThreadControls';
import { Message } from '../api/Message';
import { useAppContext } from '../AppContext';
import { MetadataModal } from './MetadataModal';
import { ExpandedThreadTitleView } from './ExpandedThreadTitleView';

interface ThreadAccordionProps {
    title: string;
    unformattedTitle: string;
    body: ReactNode;
    threadID: string;
    threadCreator: string;
    showControls: boolean;
    rootMessage: Message;
}

export const ThreadAccordionView = ({
    title,
    unformattedTitle,
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
                    <ExpandedThreadTitleView
                        copyableTitle={
                            <CopyableTitle title={title} isPrivate={rootMessage.private} />
                        }
                        rootMessage={rootMessage}
                    />
                ) : (
                    <CopyableTitle
                        noWrap={true}
                        title={unformattedTitle}
                        isPrivate={rootMessage.private}
                    />
                )}
            </AccordionSummary>
            <AccordionBody>{body}</AccordionBody>
            {showControls && (
                <>
                    <ControlsGrid container justifyContent="space-between" spacing={2}>
                        <Grid item>
                            <Button disableRipple={true} variant="text" onClick={handleModalOpen}>
                                <Typography>View Metadata</Typography>
                            </Button>
                            <MetadataModal
                                onClose={handleModalClose}
                                open={metadataModalOpen}
                                metadata={rootMessage}
                            />
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

interface CopyableTitleProps {
    title: string;
    noWrap?: boolean;
    isPrivate?: boolean;
}

// title of accordion can be clicked to open/close, but if the user selects text, we prevent
// open/close so they can copy the text.
const CopyableTitle = ({ title, noWrap, isPrivate }: CopyableTitleProps) => {
    return (
        <TitleTypography
            noWrap={noWrap}
            onClick={(e) => {
                // this title is on a mui accordion header. so when clicked, it opens and closes the panel.
                // we want to allow copying text, so if text is selected, we cancel the click event.
                if (window.getSelection && window.getSelection()?.toString().length) {
                    e.stopPropagation();
                }
            }}>
            {title}
            {!!isPrivate && <PersonIcon />}
        </TitleTypography>
    );
};

const ControlsGrid = styled(Grid)`
    padding-left: ${({ theme }) => theme.spacing(3)};
    padding-right: ${({ theme }) => theme.spacing(2)};
    padding-bottom: ${({ theme }) => theme.spacing(2)};
`;
export const TitleTypography = styled(Typography)`
    &&& {
        color: ${({ theme }) => theme.color2.B5};
        display: flex;
        font-weight: bold;
        ${({ theme }) => theme.breakpoints.up('md')} {
            max-width: 900px;
        }
        ${({ theme }) => theme.breakpoints.down('md')} {
            max-width: 450px;
        }
    }
`;

const Accordion = styled((props: AccordionProps) => (
    <MuiAccordion disableGutters elevation={0} square {...props} />
))(({ theme }) => ({
    '&&&': {
        marginBottom: theme.spacing(1),
        border: `1px solid ${theme.palette.divider}`,
        borderRadius: 10,
        '&:before': {
            display: 'none',
        },
        backgroundColor: 'white',
    },
}));

const AccordionSummary = styled((props: AccordionSummaryProps) => (
    <MuiAccordionSummary
        expandIcon={<ArrowForwardIosSharpIcon sx={{ fontSize: '12px' }} />}
        {...props}
    />
))(({ theme }) => ({
    '&&&': {
        userSelect: 'text',
        flexDirection: 'row-reverse',
        '& .MuiAccordionSummary-expandIconWrapper.Mui-expanded': {
            transform: 'rotate(90deg)',
        },
        '& .MuiAccordionSummary-content': {
            marginLeft: theme.spacing(1),
            marginRight: theme.spacing(2),
        },
    },
}));

const AccordionBody = styled(AccordionDetails)(({ theme }) => ({
    '&&&': {
        padding: theme.spacing(1),
        marginLeft: theme.spacing(2),
        marginRight: theme.spacing(2),
    },
}));
