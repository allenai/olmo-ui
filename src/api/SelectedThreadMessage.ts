import { Label } from '@/api/Label';
import { Message, MessageStreamErrorReason } from '@/api/Message';
import { Role } from '@/api/Role';
import { NullishPartial } from '@/util';
import { isOlderThan30Days } from '@/utils/date-utils';

import { InferenceOpts } from './Schema';

export interface SelectedThreadMessage {
    id: string;
    childIds: string[];
    selectedChildId?: string;
    content: string;
    role: Role;
    labels: Label[];
    creator: string;
    isLimitReached: boolean;
    isOlderThan30Days: boolean;
    parent?: string;
    model_id: string | null | undefined;
    opts: NullishPartial<InferenceOpts>;
    imageLinks?: string[];
}

const mapMessageToSelectedThreadMessage = (message: Message): SelectedThreadMessage => {
    const mappedChildren = message.children?.map((child) => child.id) ?? [];
    return {
        id: message.id,
        childIds: mappedChildren,
        selectedChildId: mappedChildren[0],
        content: message.content,
        role: message.role,
        labels: message.labels,
        creator: message.creator,
        isLimitReached: message.finish_reason === MessageStreamErrorReason.LENGTH,
        isOlderThan30Days: isOlderThan30Days(message.created),
        parent: message.parent ?? undefined,
        model_id: message.model_id,
        opts: message.opts,
        imageLinks: message.image_links,
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
