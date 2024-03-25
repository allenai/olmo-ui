import { render, renderHook, screen, waitFor } from '@test-utils';
import { debug } from 'vitest-preview';

import userEvent from '@testing-library/user-event';

import { useAppContext } from '../../AppContext';
import { ThreadBodyView } from '../ThreadBodyView';
import { messageId } from '../../mocks/handlers/messageStreamHandlers';

describe('ThreadBodyView', () => {
    test('should send a follow up message', async() => {
        const user = userEvent.setup();
        const { result } = renderHook(() => useAppContext());
        result.current.getAllThreads(0);
        
        render(<ThreadBodyView showFollowUp={true} messages={result.current.allThreadInfo.data?.messages} parent={result.current.allThreadInfo.data?.messages[0]} />)
        debug();
        const followUpInput = await screen.findByPlaceholderText(
            'Follow Up'
        );
        await user.type(followUpInput, 'Hello');
        await user.keyboard("{enter}");
        await waitFor(() => {
            expect(screen.getByRole('form')).toHaveFormValues({
                followUpMessage: '',
            });
        });
        expect(result.current.postMessageInfo.error).toBeFalsy();
        expect(result.current.postMessageInfo.data?.id).toEqual(messageId);
    });
});