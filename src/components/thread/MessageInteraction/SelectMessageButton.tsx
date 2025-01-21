import Article from '@mui/icons-material/Article';
import ArticleOutlined from '@mui/icons-material/ArticleOutlined';

import { Message } from '@/api/Message';
import { useAppContext } from '@/AppContext';

import { MessageInteractionIcon } from './MessageInteraction';

interface SelectMessageButtonProps {
    messageId: Message['id'];
}

export const SelectMessageButton = ({ messageId }: SelectMessageButtonProps) => {
    const isMessageSelected = useAppContext(
        (state) => state.attribution.selectedMessageId === messageId
    );
    const selectMessage = useAppContext((state) => state.selectMessage);
    const unselectMessage = useAppContext((state) => state.unselectMessage);
    const openDrawer = useAppContext((state) => state.openDrawer);

    const handlePress = () => {
        if (isMessageSelected) {
            unselectMessage(messageId);
        } else {
            selectMessage(messageId);
            openDrawer('attribution');
        }
    };

    return (
        <MessageInteractionIcon
            onClick={handlePress}
            tooltip={isMessageSelected ? 'Hide training text' : 'Match training text'}
            Icon={isMessageSelected ? Article : ArticleOutlined}
            selected={isMessageSelected}
        />
        // <VUIButton variant={isMessageSelected ? 'contained' : 'text'} onPress={handlePress}>
        //     {isMessageSelected ? 'Hide training text' : 'Match training text'}
        // </VUIButton>
    );
};
