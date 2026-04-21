import { Divider, List, Stack } from '@mui/material';
import { Fragment } from 'react';

import { faqs } from '@/components/faq/faq-list';

import { createFAQId } from './faq-utils';
import { FAQCategoryLink } from './FAQCategoryLink';

export const FAQCategorySection = () => {
    return (
        <Stack direction="column" sx={{ overflowY: 'scroll' }}>
            <List>
                {faqs.map((faqCategory, index) => (
                    <Fragment key={faqCategory.category}>
                        <FAQCategoryLink
                            content={faqCategory.category}
                            id={createFAQId(faqCategory.category)}
                        />
                        {index !== faqs.length - 1 && <Divider />}
                    </Fragment>
                ))}
            </List>
        </Stack>
    );
};
