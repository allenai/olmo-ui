import { useState } from 'react';
import { Box, Grid, LinearProgress, Stack, TextField } from '@mui/material';
import styled from 'styled-components';

import { Message, MessagePost } from '../api/Message';
import { BarOnRightContainer } from './BarOnRightContainer';
import { useAppContext } from '../AppContext';
import { LabelRating } from '../api/Label';

import 'highlight.js/styles/github-dark.css';
import { BaseModelResponseView } from './ResponseView/BaseModelResponseView';
import { ChatResponseView } from './ThreadBody/ChatResponseView';
import { ThreadContextMenu } from './ThreadBody/ThreadContextMenu';
import { ThreadBodyForm } from './ThreadBody/TheadBodyForm';

interface ThreadBodyProps {
    parent?: Message;
    messages?: Message[];
    showFollowUp?: boolean;
    disabledActions?: boolean;
}

export const ThreadBodyView = ({
    parent,
    messages,
    showFollowUp,
    disabledActions = false,
}: ThreadBodyProps) => {
    if (!messages) {
        return null;
    }
    const postLabel = useAppContext((state) => state.postLabel);
    const postMessage = useAppContext((state) => state.postMessage);
    let followUpControl = showFollowUp;

    const [isEditing, setIsEditing] = useState(false);
    const [messageLoading, setMessageLoading] = useState(false);
    const [curMessageIndex, setCurMessageIndex] = useState(0);
    // the anchor elements anchors the relevant dropdown menu to the dropdown menu button element (contextmenu, branchmenu)
    const [branchMenuAnchorEl, setBranchMenuAnchorEl] = useState<null | HTMLElement>(null);
    const [contextMenuAnchorEl, setContextMenuAnchorEl] = useState<null | HTMLElement>(null);

    const handleBranchMenuSelect = (index: number) => {
        setCurMessageIndex(index);
        setBranchMenuAnchorEl(null);
    };

    const [isSubmitting, setIsSubmitting] = useState(false);
    const [followUpPrompt, setFollowUpPrompt] = useState<string>();

    const branchCount = messages.length;
    const curMessage = messages[curMessageIndex];

    // see if any loading state is active
    const isLoading = messageLoading || isSubmitting;

    const postFollowupMessage = async function () {
        setIsSubmitting(true);
        const parent = curMessage;
        const payload: MessagePost = {
            content: followUpPrompt || '',
        };
        const postMessageInfo = await postMessage(payload, parent);
        if (!postMessageInfo.loading && postMessageInfo.data && !postMessageInfo.error) {
            setFollowUpPrompt('');
        }
        setIsSubmitting(false);
    };

    const handleEdit = () => {
        setIsEditing(true);
        setContextMenuAnchorEl(null);
    };

    const addLabel = async (rating: LabelRating, id: string, msg: Message) => {
        postLabel({ rating, message: id }, msg);
        setContextMenuAnchorEl(null);
    };

    const isBaseModelThread = curMessage.model_type && curMessage.model_type === 'base';
    // if we have a base model thread, we don't want to allow follow ups, this disables that control.
    if (isBaseModelThread) {
        followUpControl = false;
    }

    const contextMenu = (
        <ThreadContextMenu
            setContextMenuAnchorEl={setContextMenuAnchorEl}
            contextMenuAnchorEl={contextMenuAnchorEl}
            isLoading={isLoading}
            disabledActions={disabledActions}
            handleEdit={handleEdit}
            addLabel={addLabel}
            curMessage={curMessage}
        />
    );

    return (
        <BarOnRightContainer displayBar={branchCount > 1}>
            <>
                <Box sx={{ width: '100%', p: 2 }}>
                    <Stack direction="row" spacing={1}>
                        <Grid item sx={{ flexGrow: 1 }}>
                            {isEditing ? (
                                <ThreadBodyForm
                                    curMessage={curMessage}
                                    handleBranchMenuSelect={handleBranchMenuSelect}
                                    parent={parent}
                                    setIsEditing={setIsEditing}
                                    setMessageLoading={setMessageLoading}
                                />
                            ) : (
                                <>
                                    {isBaseModelThread ? (
                                        <BaseModelResponseView
                                            response={curMessage.content}
                                            msgId={curMessage.id}
                                            initialPrompt={parent?.content}
                                        />
                                    ) : (
                                        <ChatResponseView
                                            messages={messages}
                                            setBranchMenuAnchorEl={setBranchMenuAnchorEl}
                                            handleBranchMenuSelect={handleBranchMenuSelect}
                                            curMessageIndex={curMessageIndex}
                                            branchMenuAnchorEl={branchMenuAnchorEl}
                                            isEditing={isEditing}
                                            contextMenu={contextMenu}
                                        />
                                    )}
                                </>
                            )}
                        </Grid>
                    </Stack>
                </Box>
                {curMessage.children ? (
                    <ThreadBodyView
                        messages={curMessage.children}
                        parent={curMessage}
                        showFollowUp={followUpControl}
                        disabledActions={disabledActions}
                    />
                ) : followUpControl ? (
                    <FollowUpContainer>
                        <TextField
                            fullWidth
                            multiline
                            placeholder="Follow Up"
                            disabled={isSubmitting || disabledActions}
                            maxRows={13}
                            value={followUpPrompt}
                            onChange={(v) => setFollowUpPrompt(v.target.value)}
                            onKeyDown={(event) => {
                                if (event.key === 'Enter') {
                                    postFollowupMessage();
                                }
                            }}
                        />
                        {isSubmitting ? <LinearProgress /> : null}
                    </FollowUpContainer>
                ) : null}
            </>
        </BarOnRightContainer>
    );
};

const FollowUpContainer = styled.div`
    padding-left: ${({ theme }) => theme.spacing(2)};
    padding-right: ${({ theme }) => theme.spacing(1)};
    margin: ${({ theme }) => theme.spacing(2)};
`;
