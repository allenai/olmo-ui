import { threadOptions } from '@/api/playgroundApi/thread';
import { apiQueryClient } from '@/api/playgroundApi/v5';
import { SchemaLabelRequest, SchemaThread } from '@/api/playgroundApi/v5playgroundApiSchema';
import { queryClient } from '@/api/query-client';

// type MessageId = paths['/v5/message/{message_id}/label/']['put']['parameters']['path']['message_id'];

export const usePutLabels = () => {
    const { mutateAsync } = apiQueryClient.useMutation('put', '/v5/message/{message_id}/label/');

    return async (messageId: string, labels: SchemaLabelRequest[]) => {
        const newMessage = await mutateAsync({
            params: {
                path: {
                    message_id: messageId,
                },
            },
            body: {
                labels,
            },
        });

        const { queryKey } = threadOptions(newMessage.root);
        queryClient.setQueryData(queryKey, ({ messages, ...threadRest }: SchemaThread) => {
            return {
                ...threadRest,
                messages: messages.map((message) =>
                    message.id === messageId ? newMessage : message
                ),
            };
        });
    };
};
