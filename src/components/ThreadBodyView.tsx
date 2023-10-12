import React, { useState } from 'react';
import {
    Box,
    Chip,
    Grid,
    IconButton,
    LinearProgress,
    Menu,
    MenuItem,
    Stack,
    TextField,
    Typography,
} from '@mui/material';
import styled from 'styled-components';
import { Marked } from 'marked';
import { markedHighlight } from 'marked-highlight';
import hljs from 'highlight.js';
import DOMPurify from 'dompurify';

import KeyboardArrowDown from '@mui/icons-material/KeyboardArrowDown';
import EditIcon from '@mui/icons-material/Edit';
import CheckIcon from '@mui/icons-material/Check';
import ClearIcon from '@mui/icons-material/Clear';

import { Message, MessagePost } from '../api/Message';
import { Role } from '../api/Role';
import { BarOnRightContainer } from './BarOnRightContainer';
import { useAppContext } from '../AppContext';

import 'highlight.js/styles/github-dark.css';
import { RobotAvatar } from './avatars/RobotAvatar';
import { UserAvatar } from './avatars/UserAvatar';

interface ThreadBodyProps {
    parent?: Message;
    messages?: Message[];
    showFollowUp?: boolean;
    disabledActions?: boolean;
}

interface AgentResponseProps {
    msgId: string;
    response: string;
    isEditedResponse?: boolean;
}

const LLMResponseView = ({ response, msgId, isEditedResponse = false }: AgentResponseProps) => {
    const marked = new Marked(
        markedHighlight({
            langPrefix: 'hljs language-',
            highlight(code, lang) {
                const language = hljs.getLanguage(lang) ? lang : 'plaintext';
                return hljs.highlight(code, { language }).value;
            },
        })
    );
    // turning off features as they pop dom warnings
    marked.use({
        mangle: false,
        headerIds: false,
    });
    const html = DOMPurify.sanitize(marked.parse(response));
    return (
        <Stack direction="row">
            {isEditedResponse ? (
                <Stack direction="column" spacing={-1}>
                    <RobotAvatar />
                    <UserAvatar />
                </Stack>
            ) : (
                <RobotAvatar />
            )}
            <LLMResponseContainer id={msgId} dangerouslySetInnerHTML={{ __html: html }} />
        </Stack>
    );
};

const UserResponseView = ({ response, msgId }: AgentResponseProps) => {
    return (
        <Stack direction="row">
            <UserAvatar />
            <UserResponseContainer id={msgId}>
                <TitleTypography sx={{ fontWeight: 'bold' }}>{response}</TitleTypography>
            </UserResponseContainer>
        </Stack>
    );
};

const MENU_MAX_HEIGHT = 48 * 4.5;

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
    // the anchor element anchors the expanded dropdown menu to the dropdown menu button element
    const [anchorEl, setAnchorEl] = React.useState<null | HTMLElement>(null);
    const open = Boolean(anchorEl);

    const [isSubmitting, setIsSubmitting] = useState(false);
    const [followUpPrompt, setFollowUpPrompt] = useState<string>();

    const handleMenuClick = (event: React.MouseEvent<HTMLElement>) => {
        setAnchorEl(event.currentTarget);
    };

    const handleSelect = (index: number) => {
        setCurMessageIndex(index);
        setAnchorEl(null);
    };

    const handleClose = () => {
        setAnchorEl(null);
    };

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
        handleSelect(0); // 0 because the new message is unshifted
        const postMessageInfo = await postMessage(payload, parent);
        if (!postMessageInfo.loading && postMessageInfo.data && !postMessageInfo.error) {
            setIsLoading(false);
        }
    };

    // we add mouseover functionality via the BarOnRightContainer to enable a right side border on hover.
    // we do this using mouseover and mouseout (and onblur/onfocus for a11y) because the :hover css
    // pseudo-class does not preserve the border if you click into the menu, so this is more robust.
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
                                                // color="primary"
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
                                                // color="primary"
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
                                        />
                                    ) : (
                                        <LLMResponseView
                                            response={curMessage.content}
                                            msgId={curMessage.id}
                                            isEditedResponse={
                                                curMessage.original !== undefined &&
                                                curMessage.original?.length > 0
                                            }
                                        />
                                    )}
                                </>
                            )}
                        </Grid>
                        {!isEditing && (
                            <EditButton
                                disabled={isLoading || disabledActions}
                                onClick={() => setIsEditing(true)}
                            />
                        )}
                        {branchCount > 1 && (
                            <Grid item>
                                <MenuWrapperContainer>
                                    <Chip
                                        icon={<KeyboardArrowDown />}
                                        label={'View ' + branchCount + ' branches'}
                                        variant="outlined"
                                        clickable
                                        onClick={handleMenuClick}
                                    />
                                    <Menu
                                        anchorEl={anchorEl}
                                        open={open}
                                        onClose={handleClose}
                                        PaperProps={{
                                            style: {
                                                maxHeight: MENU_MAX_HEIGHT,
                                                width: '20ch',
                                            },
                                        }}>
                                        {messages.map((msg, i) => (
                                            <MenuItem
                                                key={i}
                                                onClick={() => handleSelect(i)}
                                                selected={i === curMessageIndex}
                                                title={msg.content}>
                                                <Typography variant="inherit" noWrap>
                                                    {msg.content}
                                                </Typography>
                                            </MenuItem>
                                        ))}
                                    </Menu>
                                </MenuWrapperContainer>
                            </Grid>
                        )}
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

const EditButton = ({ disabled, onClick }: { disabled: boolean; onClick: () => void }) => (
    <Grid item>
        <MenuWrapperContainer>
            <Chip
                icon={<EditIcon sx={{ fontSize: 16 }} />}
                label={'Edit'}
                disabled={disabled}
                variant="outlined"
                clickable
                onClick={onClick}
            />
        </MenuWrapperContainer>
    </Grid>
);

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

const UserResponseContainer = styled.div`
    padding-top: ${({ theme }) => theme.spacing(1)};
    padding-bottom: ${({ theme }) => theme.spacing(2)};
    margin-left: ${({ theme }) => theme.spacing(1)};
`;

const LLMResponseContainer = styled.div`
    background-color: ${({ theme }) => theme.color2.N1};
    border-radius: ${({ theme }) => theme.shape.borderRadius};
    padding: ${({ theme }) => theme.spacing(2)};
    margin-left: ${({ theme }) => theme.spacing(1)};
    width: 100%;
`;

const TitleTypography = styled(Typography)`
    color: ${({ theme }) => theme.color2.B5};
`;
