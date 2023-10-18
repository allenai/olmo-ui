import React, { useState } from 'react';
import {
    Box,
    Grid,
    IconButton,
    LinearProgress,
    ListItemIcon,
    ListItemText,
    MenuItem,
    Stack,
    TextField,
    Typography,
} from '@mui/material';
import styled from 'styled-components';

import KeyboardArrowDown from '@mui/icons-material/KeyboardArrowDown';
import MoreHorizIcon from '@mui/icons-material/MoreHoriz';
import EditIcon from '@mui/icons-material/Edit';
import CheckIcon from '@mui/icons-material/Check';
import ClearIcon from '@mui/icons-material/Clear';

import { Message, MessagePost } from '../api/Message';
import { Role } from '../api/Role';
import { BarOnRightContainer } from './BarOnRightContainer';
import { useAppContext } from '../AppContext';
import { LLMResponseView, UserResponseView } from './ResponseViews';
import { MenuWrapperContainer, MessageActionsMenu } from './MessageActionsMenu';

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
    const { postMessage } = useAppContext();

    const [isEditing, setIsEditing] = useState(false);
    const [isLoading, setIsLoading] = useState(false);
    const [editMessageContent, setEditMessageContent] = useState('');
    const [curMessageIndex, setCurMessageIndex] = React.useState(0);
    // the anchor elements anchors the relevant dropdown menu to the dropdown menu button element (contextmenu, branchmenu)
    const [branchMenuAnchorEl, setBranchMenuAnchorEl] = React.useState<null | HTMLElement>(null);
    const [contextMenuAnchorEl, setContextMenuAnchorEl] = React.useState<null | HTMLElement>(null);

    const handleBranchMenuSelect = (index: number) => {
        setCurMessageIndex(index);
        setBranchMenuAnchorEl(null);
    };

    const [isSubmitting, setIsSubmitting] = useState(false);
    const [followUpPrompt, setFollowUpPrompt] = useState<string>();

    const branchCount = messages.length;
    const curMessage = messages[curMessageIndex];
    const curMessageRole = curMessage.role;

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

    const editMessage = async function () {
        setIsEditing(false);
        setIsLoading(true);
        const payload: MessagePost = {
            content: editMessageContent,
            role: curMessageRole,
            original: curMessage.id,
        };
        handleBranchMenuSelect(0); // 0 because the new message is unshifted
        const postMessageInfo = await postMessage(payload, parent);
        if (!postMessageInfo.loading && postMessageInfo.data && !postMessageInfo.error) {
            setIsLoading(false);
        }
    };

    const contextMenu = (
        <MessageActionsMenu
            setMenuAnchorEl={setContextMenuAnchorEl}
            menuAnchorEl={contextMenuAnchorEl || null}
            primaryIcon={<MoreHorizIcon />}
            disabled={isLoading || disabledActions}>
            <MenuItem
                key={'edit'}
                onClick={() => {
                    setIsEditing(true);
                    setContextMenuAnchorEl(null);
                }}>
                <ListItemIcon>
                    <EditIcon fontSize="small" />
                </ListItemIcon>
                <ListItemText>Edit</ListItemText>
            </MenuItem>
        </MessageActionsMenu>
    );

    const branchesMenu = (
        <MessageActionsMenu
            setMenuAnchorEl={setBranchMenuAnchorEl}
            menuAnchorEl={branchMenuAnchorEl || null}
            startIcon={<KeyboardArrowDown />}
            label={'View ' + branchCount + ' branches'}>
            {messages.map((msg, i) => (
                <MenuItem
                    key={i}
                    onClick={() => handleBranchMenuSelect(i)}
                    selected={i === curMessageIndex}
                    title={msg.content}>
                    <Typography variant="inherit" noWrap>
                        {msg.content}
                    </Typography>
                </MenuItem>
            ))}
        </MessageActionsMenu>
    );

    return (
        <BarOnRightContainer displayBar={branchCount > 1}>
            <>
                <Box sx={{ width: '100%', p: 2 }}>
                    <Stack direction="row" spacing={1}>
                        <Grid item sx={{ flexGrow: 1 }}>
                            {isEditing ? (
                                <Grid container spacing={0.5}>
                                    <Grid item sx={{ flexGrow: 1, marginRight: 2 }}>
                                        <TextField
                                            defaultValue={curMessage.content}
                                            fullWidth
                                            multiline
                                            onChange={(v) => setEditMessageContent(v.target.value)}
                                        />
                                    </Grid>
                                    <Grid item>
                                        <MenuWrapperContainer>
                                            <OutlinedIconButton
                                                sx={{ border: 1, borderRadius: 0, p: 0 }}
                                                size="small"
                                                disabled={!editMessageContent?.length}
                                                onClick={editMessage}>
                                                <CheckIcon />
                                            </OutlinedIconButton>
                                        </MenuWrapperContainer>
                                    </Grid>
                                    <Grid item>
                                        <MenuWrapperContainer>
                                            <OutlinedIconButton
                                                sx={{ border: 1, borderRadius: 0, p: 0 }}
                                                size="small"
                                                onClick={() => setIsEditing(false)}>
                                                <ClearIcon />
                                            </OutlinedIconButton>
                                        </MenuWrapperContainer>
                                    </Grid>
                                </Grid>
                            ) : (
                                <>
                                    {curMessage.role === Role.User ? (
                                        <UserResponseView
                                            response={curMessage.content}
                                            msgId={curMessage.id}
                                            contextMenu={!isEditing ? contextMenu : undefined}
                                            branchMenu={branchCount > 1 ? branchesMenu : undefined}
                                        />
                                    ) : (
                                        <LLMResponseView
                                            response={curMessage.content}
                                            msgId={curMessage.id}
                                            isEditedResponse={
                                                curMessage.original !== undefined &&
                                                curMessage.original?.length > 0
                                            }
                                            contextMenu={!isEditing ? contextMenu : undefined}
                                            branchMenu={branchCount > 1 ? branchesMenu : undefined}
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
                        showFollowUp={showFollowUp}
                        disabledActions={disabledActions}
                    />
                ) : showFollowUp ? (
                    <FollowUpContainer>
                        <TextField
                            sx={{ width: '100%' }}
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

const OutlinedIconButton = styled(IconButton)`
    &&& {
        border: 1px solid;
        border-radius: 0;
        padding: 0;
    }
`;
