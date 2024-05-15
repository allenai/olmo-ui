import { Divider, List } from '@mui/material';

import { faqs } from '@/assets/faq-list';

import { createFAQId } from './createFAQId';
import { FAQCategoryLink } from './FAQCategoryLink';

export const FAQCategorySection = () => {
    return (
        <>
            <List>
                {faqs.map((faqCategory, index) => (
                    <>
                        <FAQCategoryLink
                            content={faqCategory.category}
                            id={createFAQId(faqCategory.category)}
                        />
                        {index !== faqs.length - 1 && <Divider />}
                    </>
                ))}
            </List>
        </>
    );
};
