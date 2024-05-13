import { PageContentWrapper } from '@/components/dolma/PageContentWrapper';
import { FAQ } from '@/components/faq/FAQ';
import { FAQCategory } from '@/components/faq/FAQCategory';

export const FAQsPage = () => {
    return (
        <PageContentWrapper>
            <FAQCategory categoryName="Example">
                <FAQ summary="How should an FAQ look?">This is an example FAQ</FAQ>
                <FAQ summary="What about a second FAQ...">Example 2</FAQ>
            </FAQCategory>
            <FAQCategory categoryName="Example2">
                <FAQ summary="How should an FAQ look in the second category?">
                    This is an example FAQ
                </FAQ>
                <FAQ summary="What about a second FAQ in the second category...">Example 2</FAQ>
            </FAQCategory>
        </PageContentWrapper>
    );
};
