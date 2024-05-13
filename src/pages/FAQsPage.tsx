import { Link } from '@mui/material';
import Markdown from 'react-markdown';

import { faqs } from '@/assets/faq-list';
import { PageContentWrapper } from '@/components/dolma/PageContentWrapper';
import { FAQ } from '@/components/faq/FAQ';
import { FAQCategory } from '@/components/faq/FAQCategory';

const FAQMarkdown = ({ children }: { children: string }) => {
    return (
        <Markdown
            components={{
                p: ({ children }) => <>{children}</>,
                // The ref types don't match for some reason
                a: ({ ref, ...props }) => <Link {...props} target="_blank" />,
            }}>
            {children}
        </Markdown>
    );
};

export const FAQsPage = () => {
    return (
        <PageContentWrapper>
            {faqs.map((faqCategory) => (
                <FAQCategory categoryName={faqCategory.category} key={faqCategory.category}>
                    {faqCategory.questions.map((question) => (
                        <FAQ summary={question.summary} key={question.summary}>
                            <FAQMarkdown>{question.content}</FAQMarkdown>
                        </FAQ>
                    ))}
                </FAQCategory>
            ))}
        </PageContentWrapper>
    );
};
