import { useState } from 'react';
import { Box, Grid, Stack } from '@mui/material';

import { Message } from '../api/Message';
import { BarOnRightContainer } from './BarOnRightContainer';
import { useAppContext } from '../AppContext';
import { LabelRating } from '../api/Label';

import 'highlight.js/styles/github-dark.css';
import { BaseModelResponseView } from './ResponseView/BaseModelResponseView';
import { ChatResponseView } from './ThreadBody/ChatResponseView';
import { ThreadContextMenu } from './ThreadBody/ThreadContextMenu';
import { ThreadEditForm } from './ThreadBody/ThreadEditForm';
import { ThreadFollowUpForm } from './ThreadBody/ThreadFollowUpForm';

interface ThreadBodyProps {
    parent?: Message;
    messages?: Message[];
    showFollowUp?: boolean;
    disabledActions?: boolean;
    messagePath?: string[];
}

export const ThreadBodyView = ({
    parent,
    messages,
    showFollowUp,
    disabledActions = false,
    messagePath = parent?.id != null ? [parent.id] : [],
}: ThreadBodyProps) => {
    const postLabel = useAppContext((state) => state.postLabel);
    let followUpControl = showFollowUp;

    const [isEditing, setIsEditing] = useState(false);
    const [messageLoading, setMessageLoading] = useState(false);
    const [curMessageIndex, setCurMessageIndex] = useState(0);
    // the anchor elements anchors the relevant dropdown menu to the dropdown menu button element (contextmenu, branchmenu)
    const [branchMenuAnchorEl, setBranchMenuAnchorEl] = useState<null | HTMLElement>(null);
    const [contextMenuAnchorEl, setContextMenuAnchorEl] = useState<null | HTMLElement>(null);

    if (messages == null || messages.length === 0) {
        return null;
    }

    const handleBranchMenuSelect = (index: number) => {
        setCurMessageIndex(index);
        setBranchMenuAnchorEl(null);
    };

    const branchCount = messages.length;
    const curMessage = messages[curMessageIndex];

    // see if any loading state is active
    const isLoading = messageLoading;

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
                                <ThreadEditForm
                                    curMessage={curMessage}
                                    handleBranchMenuSelect={handleBranchMenuSelect}
                                    parent={parent}
                                    setIsEditing={setIsEditing}
                                    setMessageLoading={setMessageLoading}
                                    messagePath={messagePath.concat(curMessage.id)}
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
                        messagePath={messagePath.concat(curMessage.id)}
                    />
                ) : followUpControl ? (
                    <ThreadFollowUpForm
                        curMessage={curMessage}
                        disabledActions={disabledActions}
                        messagePath={messagePath.concat(curMessage.id)}
                    />
                ) : null}
            </>
        </BarOnRightContainer>
    );
};
