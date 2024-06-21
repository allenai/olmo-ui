import { Link, Typography } from '@mui/material';

export interface DomainLinkProp {
    link: string;
}

export const DomainLink = ({ link }: DomainLinkProp) => {
    return (
        <Link href={`http://${link}`} target="_blank" underline="none" rel="noopener">
            <Typography
                sx={() => ({
                    fontWeight: 700,
                })}>
                {link}
            </Typography>
        </Link>
    );
};
