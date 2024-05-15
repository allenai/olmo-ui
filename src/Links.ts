export const links = {
    playground: '/',
    ourModels: 'https://huggingface.co/collections/allenai/olmo-suite-65aeaae8fe5b6b2122b46778',
    datasetExplorer: '/dolma',
    ourDatasets: 'https://huggingface.co/datasets/allenai/dolma',
    thread: (threadId: string) => `/thread/${threadId}`,
    faqs: '/faqs',
    login: '/login',
    logout: '/logout',
    loginResult: '/login-result',
    feedbackForm:
        'https://docs.google.com/forms/d/e/1FAIpQLSfmPUnxBss08X8aq7Aiy17YSPhH-OqHzHMIzXg4zsIhAbvqxg/viewform?usp=sf_link',
    document: (documentId: string) => `/document/${documentId}`,
    search: '/search',
    promptTemplates: '/prompt-templates',
    admin: '/admin',
} as const;
