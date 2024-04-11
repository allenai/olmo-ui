import { fireEvent, render, renderHook, screen, waitFor } from '@test-utils';

import userEvent from '@testing-library/user-event';

import { messageId } from '@/mocks/handlers/messageStreamHandlers';
import { useAppContext } from '../../AppContext';
import { ThreadBodyView } from '../ThreadBodyView';

describe('ThreadBodyView', () => {
    test('should send a follow up message', async () => {
        const user = userEvent.setup();
        const { result } = renderHook(() => useAppContext());
        await result.current.getAllThreads(0);
        const firstThread = result.current.allThreadInfo.data.messages[0];

        render(
            <ThreadBodyView
                showFollowUp={true}
                messages={firstThread.children}
                parent={firstThread}
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
        await result.current.getAllThreads(0);
        const firstThread = result.current.allThreadInfo.data.messages[0];

        render(
            <ThreadBodyView
                showFollowUp={true}
                messages={firstThread.children}
                parent={firstThread}
            />
        );

        fireEvent.mouseEnter(screen.getAllByLabelText('LLM Response')[0]);
        await user.click(screen.getAllByLabelText('More Options')[0]);
        await user.click(screen.getByText('Edit'));

        const editInput = screen.getByLabelText('Edit Prompt');
        await user.type(editInput, 'Hello');
        await user.click(screen.getByLabelText('Finish editing LLM response'));

        await waitFor(() => {
            expect(result.current.postMessageInfo.loading).toEqual(false);
        });

        expect(result.current.postMessageInfo.data?.id).toEqual(messageId);
        expect(result.current.postMessageInfo.error).toBeFalsy();
    });
});
