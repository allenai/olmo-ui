import { Link } from '@mui/material';

const truncateUrl = (url: string, maxLength = 40) => {
    if (url.length <= maxLength) return url;
    return url.slice(0, maxLength) + '...';
};

interface UrlForDocumentAttributionProps {
    url: string | undefined;
}

export const UrlForDocumentAttribution = ({ url }: UrlForDocumentAttributionProps) => {
    if (!url) {
        return null;
    }
    return (
        <>
            URL:{' '}
            <Link href={url} target="_blank" rel="noopener noreferrer">
                {truncateUrl(url)}
            </Link>
        </>
    );
};
