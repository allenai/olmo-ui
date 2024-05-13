import { faqs } from '@/assets/faq-list';
import { PageContentWrapper } from '@/components/dolma/PageContentWrapper';
import { FAQ } from '@/components/faq/FAQ';
import { FAQCategory } from '@/components/faq/FAQCategory';

export const FAQsPage = () => {
    return (
        <PageContentWrapper>
            {faqs.map((faqCategory) => (
                <FAQCategory categoryName={faqCategory.category} key={faqCategory.category}>
                    {faqCategory.questions.map((question) => (
                        <FAQ summary={question.summary} key={question.summary}>
                            {question.content}
                        </FAQ>
                    ))}
                </FAQCategory>
            ))}
        </PageContentWrapper>
    );
};
