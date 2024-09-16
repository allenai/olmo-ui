export const links = {
    home: '/',
    playground: '/',
    ourModels: 'https://huggingface.co/collections/allenai/olmo-suite-65aeaae8fe5b6b2122b46778',
    datasetExplorer: '/dolma',
    ourDatasets: 'https://huggingface.co/datasets/allenai/dolma',
    thread: (threadId: string) => `/thread/${threadId}`,
    faqs: '/faqs',
    login: (redirectTo?: string) => {
        const loginBase = '/login';

        if (!redirectTo) {
            return loginBase;
        }

        const searchParams = new URLSearchParams();
        searchParams.set('redirectTo', redirectTo);

        return `${loginBase}?${searchParams.toString()}`;
    },
    logout: '/logout',
    loginResult: '/login-result',
    feedbackForm:
        'https://docs.google.com/forms/d/e/1FAIpQLSfmPUnxBss08X8aq7Aiy17YSPhH-OqHzHMIzXg4zsIhAbvqxg/viewform?usp=sf_link',
    document: (documentId: string) => `/document/${documentId}`,
    search: '/search',
    promptTemplates: '/prompt-templates',
    admin: '/admin',
    dolma7B: 'https://blog.allenai.org/olmo-1-7-7b-a-24-point-improvement-on-mmlu-92b43f7d269d',
    odc: 'https://blog.allenai.org/making-a-switch-dolma-moves-to-odc-by-8f0e73852f44',
    dolmaBlog: 'https://blog.allenai.org/dolma-3-trillion-tokens-open-llm-corpus-9a0ff4b8da64',
} as const;
