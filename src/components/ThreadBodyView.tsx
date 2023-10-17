import React, { useState } from 'react';
import {
    Box,
    Button,
    Grid,
    IconButton,
    LinearProgress,
    ListItemIcon,
    ListItemText,
    Menu,
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

interface ThreadBodyProps {
    parent?: Message;
    messages?: Message[];
    showFollowUp?: boolean;
    disabledActions?: boolean;
}

const MENU_MAX_HEIGHT = 48 * 4.5;
const MENU_WIDTH = '20ch';

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

    const branchMenuOpen = Boolean(branchMenuAnchorEl);
    const contextMenuOpen = Boolean(contextMenuAnchorEl);

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

    const menuPaperStyle = {
        maxHeight: MENU_MAX_HEIGHT,
        width: MENU_WIDTH,
    };

    const contextMenu = (
        <MenuWrapperContainer>
            <ResponseMenuButton
                variant="outlined"
                disabled={isLoading || disabledActions}
                onClick={(e) => setContextMenuAnchorEl(e.currentTarget)}>
                <MoreHorizIcon />
            </ResponseMenuButton>
            <Menu
                anchorEl={contextMenuAnchorEl}
                open={contextMenuOpen}
                onClose={() => setContextMenuAnchorEl(null)}
                PaperProps={{
                    style: menuPaperStyle,
                }}>
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
            </Menu>
        </MenuWrapperContainer>
    );

    const branchesMenu = (
        <MenuWrapperContainer>
            <ResponseMenuButton
                startIcon={<KeyboardArrowDown />}
                variant="outlined"
                onClick={(e) => setBranchMenuAnchorEl(e.currentTarget)}>
                <Typography noWrap>View {branchCount} branches</Typography>
            </ResponseMenuButton>
            <Menu
                anchorEl={branchMenuAnchorEl}
                open={branchMenuOpen}
                onClose={() => setBranchMenuAnchorEl(null)}
                PaperProps={{
                    style: menuPaperStyle,
                }}>
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
            </Menu>
        </MenuWrapperContainer>
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

const ResponseMenuButton = styled(Button)`
    &&& {
        padding: ${({ theme }) => theme.spacing(0.75)};
        min-width: 20px;
        height: 25px;
        color: ${({ theme }) => theme.color2.N5};
        border-color: ${({ theme }) => theme.color2.N5};
        font-size: 12px;
    }
`;

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

const MenuWrapperContainer = styled.div`
    padding-top: ${({ theme }) => theme.spacing(1)};
`;
