import { test, expect } from '@playwright/test';

test('has title', async ({ page }) => {
    await page.goto('/');
    await page.route('/v3/whoami', async (route) => {
        const json = {
            client: 'murphy@allenai.org',
        };
        await route.fulfill({ json });
    });
    await expect(page).toHaveTitle('OLMo - Allen Institute for AI');
});

test('can prompt', async ({ page }) => {
    await page.goto('/');
    await page.route('/v3/whoami', async (route) => {
        const json = {
            client: 'murphy@allenai.org',
        };
        await route.fulfill({ json });
    });
    await page.route('/v3/schema', async (route) => {
        const json = {
            InferenceOpts: {
                logprobs: {
                    default: null,
                    max: 10,
                    min: 0,
                    name: 'logprobs',
                    step: 1,
                },
                max_tokens: {
                    default: 2048,
                    max: 4096,
                    min: 1,
                    name: 'max_tokens',
                    step: 1,
                },
                n: {
                    default: 1,
                    max: 50,
                    min: 1,
                    name: 'n',
                    step: 1,
                },
                stop: {
                    default: null,
                    max: null,
                    min: null,
                    name: 'stop',
                    step: null,
                },
                temperature: {
                    default: 1.0,
                    max: 2.0,
                    min: 0.0,
                    name: 'temperature',
                    step: 0.01,
                },
                top_p: {
                    default: 1.0,
                    max: 1.0,
                    min: 0.0,
                    name: 'top_p',
                    step: 0.01,
                },
            },
        };
        await route.fulfill({ json });
    });
    await page.route('/v3/templates/prompts', async (route) => {
        const json = [];
        await route.fulfill({ json });
    });
    await page.route('/v3/models', async (route) => {
        const json = [
            {
                description: "AI2's 7B model trained on the Dolma dataset and fine-tuned for chat.",
                id: 'olmo-7b-chat',
                model_type: 'chat',
                name: 'OLMo 7B - Chat',
            },
            {
                description: "AI2's 7B model trained on the Dolma dataset.",
                id: 'olmo-7b-base',
                model_type: 'base',
                name: 'OLMo 7B - Base',
            },
        ];
        await route.fulfill({ json });
    });
    await page.route('/v3/messages?offset=0&creator=murphy%40allenai.org', async (route) => {
        const json = {
            messages: [],
            meta: {
                limit: 10,
                offset: 0,
                sort: null,
                total: 204,
            },
        };
        await route.fulfill({ json });
    });

    page.getByPlaceholder('Select a Prompt Template above or type a free form prompt').fill(
        'Can you tell me a friday joke?'
    );
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
        await route.fulfill({ json });
    });
    await expect(page.getByPlaceholder('Follow Up')).toBeInViewport();
});
