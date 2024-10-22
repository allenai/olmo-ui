import { faqs } from '@/components/faq/faq-list';

export const createFAQId = (summary: string) => {
    return summary
        .replace(/[^\w\s']|_/g, '')
        .replace(/\s+/g, '-')
        .toLowerCase();
};

export const findFAQByShortId = (shortId: string) => {
    const targetFaq = faqs
        .flatMap((faqCategory) => faqCategory.questions)
        .find((faq) => faq.shortId === shortId);

    return targetFaq;
};

export const getFAQIdByShortId = (shortId: string, withHashtag: boolean = true) => {
    const targetFaq = findFAQByShortId(shortId);
    const targetId = targetFaq === undefined ? '' : createFAQId(targetFaq.question);

    return withHashtag ? '#' + targetId : targetId;
};
