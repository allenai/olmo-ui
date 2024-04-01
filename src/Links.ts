export const links = {
    playground: '/',
    ourModels: '/models',
    datasetExplorer: '/dolma',
    ourDatasets: '/dolma/datasets/about',
    thread: (threadId: string) => `/thread/${threadId}`,
    faqs: '/faqs',
    dataPolicy: '/data-policy',
    logOut: '/log-out',
    feedbackForm:
        'https://docs.google.com/forms/d/e/1FAIpQLSfmPUnxBss08X8aq7Aiy17YSPhH-OqHzHMIzXg4zsIhAbvqxg/viewform?usp=sf_link',
    document: (documentId: string) => `/document/${documentId}`,
    search: '/search',
    promptTemplates: '/prompt-templates',
    admin: '/admin',
} as const;
