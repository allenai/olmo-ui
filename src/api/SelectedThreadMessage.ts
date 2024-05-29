import dayjs from 'dayjs';

import { Label } from '@/api/Label';
import { Message, MessageStreamErrorReason } from '@/api/Message';
import { Role } from '@/api/Role';

export interface SelectedThreadMessage {
    id: string;
    childIds: string[];
    selectedChildId?: string;
    content: string;
    role: Role;
    labels: Label[];
    isLimitReached: boolean;
    isOlderThan30Days: boolean;
    parent?: string;
}

export const isOlderThan30Days = (createdDate: Date) => {
    const targetDate = dayjs(createdDate).add(29, 'days').format('YYYY-MM-DD');

    return dayjs().isAfter(targetDate, 'day');
};

const mapMessageToSelectedThreadMessage = (message: Message): SelectedThreadMessage => {
    const mappedChildren = message.children?.map((child) => child.id) ?? [];
    return {
        id: message.id,
        childIds: mappedChildren,
        selectedChildId: mappedChildren[0],
        content: message.content,
        role: message.role,
        labels: message.labels,
        isLimitReached: message.finish_reason === MessageStreamErrorReason.LENGTH,
        isOlderThan30Days: isOlderThan30Days(message.created),
        parent: message.parent ?? undefined,
    };
};

export const mapMessages = (
    message: Message,
    messageList: SelectedThreadMessage[] = []
): SelectedThreadMessage[] => {
    const mappedMessage = mapMessageToSelectedThreadMessage(message);
    messageList.push(mappedMessage);

    message.children?.forEach((childMessage) => {
        mapMessages(childMessage, messageList);
    });

    return messageList;
};
