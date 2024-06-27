import { Button, Card, CardActions, CardContent, Link, Typography } from '@mui/material';

import { SMALL_LAYOUT_BREAKPOINT } from '@/constants';

interface DolmaInformationCardProps {
    linkText: string;
    linkUrl: string;
    title: string;
    buttonText: string;
    buttonUrl: string;
}

export const DolmaInformationCard = ({
    linkText,
    title,
    buttonText,
    buttonUrl,
}: DolmaInformationCardProps) => {
    return (
        <Card
            variant="outlined"
            sx={(theme) => ({
                background: (theme) => theme.palette.primary.dark,
                display: 'flex',
                flexDirection: 'column',
                alignItems: 'flex-start',
                textAlign: 'left',
                flex: '1 0 21rem',
                justifyContent: 'space-between',

                [theme.breakpoints.down(SMALL_LAYOUT_BREAKPOINT)]: {
                    borderRadius: '0px',
                },
            })}>
            <CardContent
                sx={{
                    flex: 1,
                    display: 'flex',
                    flexDirection: 'column',
                    justifyContent: 'space-between',
                    alignItems: 'flex-start',
                    padding: 4,
                }}>
                <Typography variant="body1" color="primary.light">
                    {linkText}
                </Typography>
                <Typography
                    variant="h5"
                    sx={{
                        color: (theme) => theme.palette.primary.contrastText,
                        marginY: 1,
                    }}>
                    {title}
                </Typography>
                <CardActions sx={{ padding: 1.5, paddingInlineStart: 0 }}>
                    <Button
                        size="medium"
                        variant="contained"
                        component={Link}
                        href={buttonUrl}
                        target="_blank"
                        rel="noopener noreferrer">
                        {buttonText}
                    </Button>
                </CardActions>
            </CardContent>
        </Card>
    );
};
