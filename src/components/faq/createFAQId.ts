export const createFAQId = (summary: string) => {
    return summary
        .replace(/[^\w\s']|_/g, '')
        .replace(/\s+/g, '-')
        .toLowerCase();
};
