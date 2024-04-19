import { ReactNode } from 'react';

import { Role } from '../../api/Role';
import { Message } from '../../api/Message';
import { BranchMenu } from './BranchMenu';
import { UserResponseView } from '../ResponseView/UserResponseView';
import { LLMResponseView } from '../ResponseView/LLMResponseView';

interface ChatResponseViewProps {
    messages: Message[];
    setBranchMenuAnchorEl: (anchor: null | HTMLElement) => void;
    handleBranchMenuSelect: (index: number) => void;
    branchMenuAnchorEl: HTMLElement | null;
    curMessageIndex: number;
    isEditing: boolean;
    contextMenu: ReactNode;
}

export const ChatResponseView = ({
    messages,
    setBranchMenuAnchorEl,
    handleBranchMenuSelect,
    curMessageIndex,
    branchMenuAnchorEl,
    isEditing,
    contextMenu,
}: ChatResponseViewProps) => {
    const curMessage = messages[curMessageIndex];
    const branchCount = messages.length;

    if (curMessage.role === Role.User) {
        return (
            <UserResponseView
                response={curMessage.content}
                msgId={curMessage.id}
                contextMenu={!isEditing ? contextMenu : undefined}
                branchMenu={
                    branchCount > 1 ? (
                        <BranchMenu
                            setBranchMenuAnchorEl={setBranchMenuAnchorEl}
                            branchMenuAnchorEl={branchMenuAnchorEl}
                            messages={messages}
                            curMessageIndex={curMessageIndex}
                            handleBranchMenuSelect={handleBranchMenuSelect}
                        />
                    ) : undefined
                }
                displayBranchIcon={branchCount > 1}
            />
        );
    }

    return (
        <LLMResponseView
            response={curMessage.content}
            msgId={curMessage.id}
            isEditedResponse={curMessage.original != null && curMessage.original.length > 0}
            contextMenu={!isEditing ? contextMenu : undefined}
            branchMenu={
                branchCount > 1 ? (
                    <BranchMenu
                        setBranchMenuAnchorEl={setBranchMenuAnchorEl}
                        branchMenuAnchorEl={branchMenuAnchorEl}
                        messages={messages}
                        curMessageIndex={curMessageIndex}
                        handleBranchMenuSelect={handleBranchMenuSelect}
                    />
                ) : undefined
            }
            displayBranchIcon={branchCount > 1}
        />
    );
};
