import { Button as VUIButton } from '@allenai/varnish-ui';

import { Message } from '@/api/Message';
import { useAppContext } from '@/AppContext';

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
        <VUIButton variant={isMessageSelected ? 'contained' : 'text'} onPress={handlePress}>
            {isMessageSelected ? 'Hide training text' : 'Match training text'}
        </VUIButton>
    );
};
