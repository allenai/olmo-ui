export const links = {
    ai2: 'https://allenai.org/',
    admin: '/admin',
    modelConfiguration: '/model-configuration',
    home: '/',
    playground: '/',
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
    document: (documentId: string, index?: string | null) =>
        index == null ? `/document/${documentId}` : `/${index}/document/${documentId}`,
    search: '/search',
    promptTemplates: '/prompt-templates',
    olmoeMixAnnouncement:
        'https://blog.allenai.org/olmoe-an-open-small-and-state-of-the-art-mixture-of-experts-model-c258432d0514',
    olmoeMixDownload: 'https://huggingface.co/datasets/allenai/OLMoE-mix-0924',
    olmoeAppStoreDownload: 'https://apps.apple.com/app/id6738533815',
    odc: 'https://blog.allenai.org/making-a-switch-dolma-moves-to-odc-by-8f0e73852f44',
    documentation: 'http://allenai.org/documentation',
    googlePrivacy: 'https://policies.google.com/privacy',
    googleTerms: 'https://policies.google.com/terms',
    discord: 'https://discord.gg/NE5xPufNwu',
    contactUs: 'https://allenai.org/contact',
} as const;
