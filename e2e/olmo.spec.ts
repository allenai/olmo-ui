import { test, expect } from '@playwright/test';

test('has title', async ({ page }) => {
    await page.goto('/');

    await expect(page).toHaveTitle('OLMo - Allen Institute for AI');
});

test('can prompt', async ({ page }) => {
    await page.goto('/');
    await page
        .getByPlaceholder('Select a Prompt Template above or type a free form prompt')
        .fill('Can you tell me a friday joke?');
    await page.getByRole('button', { name: 'Prompt' }).click();
    await page.route('/v3/message/stream', async (route) => {
        const json = {
            id: 'msg_Y3U0D2Y3R3',
            content: 'Can you tell me a friday joke?',
            snippet: 'Can you tell me a friday joke?',
            creator: 'murphy@allenai.org',
            role: 'user',
            opts: {
                max_tokens: 2048,
                temperature: 1.0,
                n: 1,
                top_p: 1.0,
                logprobs: null,
                stop: null,
            },
            root: 'msg_Y3U0D2Y3R3',
            created: '2024-03-13T16:31:10.771830+00:00',
            deleted: null,
            parent: null,
            template: null,
            logprobs: null,
            children: [
                {
                    id: 'msg_R0U7A5L9K0',
                    content:
                        "Sure, here's one:\n\nWhy did the scarecrow win an award?\n\nBecause he was outstanding in his field!",
                    snippet:
                        "Sure, here's one: Why did the scarecrow win an award? Because he was outstanding in his\u2026",
                    creator: 'murphy@allenai.org',
                    role: 'assistant',
                    opts: {
                        max_tokens: 2048,
                        temperature: 1.0,
                        n: 1,
                        top_p: 1.0,
                        logprobs: null,
                        stop: null,
                    },
                    root: 'msg_Y3U0D2Y3R3',
                    created: '2024-03-13T16:31:10.780811+00:00',
                    deleted: null,
                    parent: 'msg_Y3U0D2Y3R3',
                    template: null,
                    logprobs: [],
                    children: null,
                    completion: 'cpl_A6K4Q2C8K7',
                    final: true,
                    original: null,
                    private: true,
                    model_type: 'chat',
                    labels: [],
                },
            ],
            completion: null,
            final: true,
            original: null,
            private: true,
            model_type: null,
            labels: [],
        };
        await route.fulfill({ json: json });
    });
    await expect(page.getByRole('button', { name: 'View Metadata' })).toBeVisible();
});
