import { render, renderHook, screen, waitFor } from '@test-utils';
import userEvent from '@testing-library/user-event';

import { useAppContext } from '@/AppContext';
import { newMessageId } from '@/mocks/handlers/messageStreamHandlers';

import { NewQuery } from '../NewQuery/NewQuery';

describe('NewQuery', () => {
    test('should send a prompt', async () => {
        const user = userEvent.setup();
        const { result } = renderHook(() => useAppContext());
        result.current.getAllThreads(0);

        render(<NewQuery />);
        const promptInput = await screen.findByPlaceholderText(
            'Select a Prompt Template above or type a free form prompt'
        );

        await user.type(promptInput, 'Hello');
        await user.click(screen.getByRole('button', { name: 'Prompt' }));

        await waitFor(() => {
            // We don't show the submission result in NewQuery so we just want to make sure the form doesn't have anything in it
            expect(screen.getByRole('form')).toHaveFormValues({
                content: '',
            });
        });

        expect(result.current.postMessageInfo.error).toBeFalsy();
        expect(result.current.postMessageInfo.data?.id).toEqual(newMessageId);
    });

    test('should populate the models list and change title description when selecting a new model', async () => {
        const user = userEvent.setup();

        render(<NewQuery />);

        const modelSelect = await screen.findByRole('combobox', { name: 'Model' });

        // Make sure the tooltip is showing the description for the first option
        await user.hover(modelSelect);
        expect(
            await screen.findByText(
                "AI2's 7B model trained on the Dolma dataset and fine-tuned for chat."
            )
        ).toBeVisible();

        // Select the second option
        await user.click(modelSelect);
        await user.click(screen.getByRole('option', { name: 'OLMo 7B - Base' }));

        // Check the tooltip has the second option's description now
        await user.hover(modelSelect);
        expect(
            await screen.findByText("AI2's 7B model trained on the Dolma dataset.")
        ).toBeVisible();
    });

    test('should update the prompt with the selected prompt template', async () => {
        const user = userEvent.setup();

        render(<NewQuery />);

        const templateSelect = await screen.findByRole('combobox', { name: 'Prompt template' });
        user.click(templateSelect);
        user.click(await screen.findByRole('option', { name: 'name' }));

        expect(await screen.findByRole('textbox')).toHaveValue('This is a prompt template');
    });
});
