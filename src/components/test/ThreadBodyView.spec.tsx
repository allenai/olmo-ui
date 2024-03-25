import { fireEvent, render, renderHook, screen, waitFor } from '@test-utils';

import userEvent from '@testing-library/user-event';

import { useAppContext } from '../../AppContext';
import { ThreadBodyView } from '../ThreadBodyView';
import { messageId } from '../../mocks/handlers/messageStreamHandlers';
import { MessageList } from '../../api/Message';
import { Role } from '../../api/Role';

const mockThread: MessageList = {
    messages: [
        {
            children: [
                {
                    completion: 'cpl_R5T5K6B4C9',
                    content: 'Okay',
                    created: new Date(),
                    creator: 'murphy@allenai.org',
                    final: true,
                    id: 'msg_V6Y0U4H4O9',
                    labels: [],
                    logprobs: [],
                    model_type: 'chat',
                    opts: {
                        max_tokens: 2048,
                        n: 1,
                        temperature: 1.0,
                        top_p: 1.0,
                    },
                    parent: 'msg_L1Q1W8A3U0',
                    private: false,
                    role: Role.LLM,
                    root: 'msg_L1Q1W8A3U0',
                    snippet: 'Okay',
                },
            ],
            content: 'say one word',
            created: new Date(),
            creator: 'murphy@allenai.org',
            final: true,
            id: 'msg_L1Q1W8A3U0',
            labels: [],
            opts: {
                max_tokens: 2048,
                n: 1,
                temperature: 1.0,
                top_p: 1.0,
            },
            role: Role.User,
            private: false,
            root: messageId,
            snippet: 'say one word',
        },
    ],
    meta: { limit: 10, offset: 0, total: 229 },
};

describe('ThreadBodyView', () => {
    test('should send a follow up message', async () => {
        const user = userEvent.setup();
        const { result } = renderHook(() => useAppContext());
        result.current.getAllThreads(0);

        render(
            <ThreadBodyView
                showFollowUp={true}
                messages={mockThread.messages}
                parent={mockThread.messages[0]}
            />
        );
        const followUpInput = await screen.findByPlaceholderText('Follow Up');
        await user.type(followUpInput, 'Hello');
        await user.keyboard('{enter}');
        await waitFor(() => {
            expect(screen.getByRole('form')).toHaveFormValues({
                followUpMessage: '',
            });
        });
        expect(result.current.postMessageInfo.error).toBeFalsy();
        expect(result.current.postMessageInfo.data?.id).toEqual(messageId);
    });

    test('should be able to edit message', async () => {
        const user = userEvent.setup();
        const { result } = renderHook(() => useAppContext());
        result.current.getAllThreads(0);

        render(
            <ThreadBodyView
                showFollowUp={true}
                messages={mockThread.messages}
                parent={mockThread.messages[0]}
            />
        );

        fireEvent.mouseEnter(screen.getAllByLabelText('LLM Response')[0]);
        await user.click(screen.getAllByLabelText('More Options')[0]);
        await user.click(screen.getByText('Edit'));
        const editInput = await screen.getByTestId('Edit Prompt');
        await user.type(editInput, 'Hello');
        await user.click(screen.getByLabelText('Check'));
        expect(result.current.postMessageInfo.error).toBeFalsy();
        expect(result.current.postMessageInfo.data?.id).toEqual(messageId);
    });
});
