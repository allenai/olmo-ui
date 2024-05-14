import { Link, Typography } from '@mui/material';
import { Stack } from '@mui/system';

import { faqs } from '@/assets/faq-list';

import { createFAQId } from './createFAQId';

export const FAQCategoryLinks = () => {
    return (
        <Stack
            sx={{
                borderRadius: '5px',
                borderStyle: 'solid',
                borderWidth: 1,
                padding: '27px',
                borderColor: (theme) => theme.palette.primary.main,
            }}>
            <Typography variant="body1" fontWeight="bold" component="h2">
                Categories
            </Typography>
            {faqs.map((faqCategory) => (
                <Link
                    sx={{ paddingTop: '5px' }}
                    href={'#' + createFAQId(faqCategory.category)}
                    key={faqCategory.category}
                    component="a">
                    {faqCategory.category}
                </Link>
            ))}
        </Stack>
    );
};
