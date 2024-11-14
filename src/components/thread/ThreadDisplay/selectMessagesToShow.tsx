import { SelectedThreadMessage } from "@/api/SelectedThreadMessage";
import { AppContextState } from "@/AppContext";

/**
 * This selector traverses the message tree to get the messages related to
 * the current thread. The intention is to optimize developing experience
 * by saving the jobs for maintaining a list of current viewing message IDs.
 * However, this could be compute-intensive as the message tree grows and
 * the number of components that rely on it increases.
 */

export const selectMessagesToShow = (state: AppContextState): string[] => {
    const getMessageIdsToShow = (
        rootMessageId: string,
        messagesById: Record<string, SelectedThreadMessage>,
        messageIdList: string[] = []
    ): string[] => {
        const message = messagesById[rootMessageId];
        if (message == null || rootMessageId == null) {
            return [];
        }

        messageIdList.push(rootMessageId);
        if (message.selectedChildId != null) {
            const childMessage = messagesById[message.selectedChildId];
            getMessageIdsToShow(childMessage.id, messagesById, messageIdList);
        }

        return messageIdList;
    };

    return getMessageIdsToShow(state.selectedThreadRootId, state.selectedThreadMessagesById);
};
