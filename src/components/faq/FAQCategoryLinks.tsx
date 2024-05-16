import { Card, CardContent, Link, Stack, Typography } from '@mui/material';

import { faqs } from '@/assets/faq-list';

import { createFAQId } from './createFAQId';

export const FAQCategoryLinks = () => {
    return (
        <Card
            sx={{
                borderColor: (theme) => theme.palette.primary.main,
                backgroundColor: 'transparent',
                padding: '10px',
            }}>
            <CardContent>
                <Typography variant="body1" fontWeight="bold" component="h2">
                    Categories
                </Typography>
                <Stack>
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
            </CardContent>
        </Card>
    );
};
