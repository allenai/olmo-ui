import { Button, Card, CardActions, CardContent, Link, Typography } from '@mui/material';

import { SMALL_LAYOUT_BREAKPOINT } from '@/constants';

import { useDesktopOrUp } from './dolma/shared';

interface DolmaInformationCardProps {
    linkText: string;
    linkUrl: string;
    title: string;
    buttonText: string;
    buttonUrl: string;
}

export const DolmaInformationCard = ({
    linkText,
    linkUrl,
    title,
    buttonText,
    buttonUrl,
}: DolmaInformationCardProps) => {
    const isDesktopOrUp = useDesktopOrUp();

    return (
        <Card
            sx={(theme) => ({
                background: (theme) => theme.palette.primary.dark,
                padding: (theme) => theme.spacing(4),
                display: 'flex',
                flexDirection: 'column',
                alignItems: 'flex-start',
                textAlign: 'left',
                flex: 1,
                justifyContent: 'space-between',
                [theme.breakpoints.down(SMALL_LAYOUT_BREAKPOINT)]: {
                    padding: 3,
                    borderRadius: '0px',
                },
            })}
            variant={isDesktopOrUp ? 'elevation' : 'outlined'}>
            <CardContent
                sx={{
                    flex: 1,
                    display: 'flex',
                    flexDirection: 'column',
                    justifyContent: 'space-between',
                    alignItems: 'flex-start',
                    padding: 0,
                }}>
                <CardActions
                    sx={{
                        padding: 0,
                    }}>
                    <Link href={linkUrl} sx={{ color: (theme) => theme.palette.primary.light }}>
                        {linkText}
                    </Link>
                </CardActions>
                <Typography
                    variant="h4"
                    sx={{
                        color: (theme) => theme.palette.primary.contrastText,
                        marginY: 1,
                    }}>
                    {title}
                </Typography>
                <CardActions
                    sx={{
                        padding: 0,
                    }}>
                    <Button size="small" variant="contained" component={Link} href={buttonUrl}>
                        {buttonText}
                    </Button>
                </CardActions>
            </CardContent>
        </Card>
    );
};
