import { Helmet } from 'react-helmet';
import { useLocation } from 'react-router-dom';

interface MetaTagsProps {
    title?: string;
    description?: string;
    socialSharingImageUrl?: string;
}

export const MetaTags = ({
    title = 'Ai2 Playground',
    description = "Try Ai2's latest models on our official Playground.",
    socialSharingImageUrl = '/social-sharing-image.png',
}: MetaTagsProps) => {
    const location = useLocation();

    return (
        <Helmet>
            <title>{title}</title>
            <meta property="og:type" content="website" />
            <meta property="og:site_name" content="Ai2 Playground" />
            <meta property="og:title" content={title} />
            <meta property="og:description" content={description} />
            <meta property="og:image" content={socialSharingImageUrl} />
            <meta property="og:url" content={`${process.env.BASE_URL}/${location.pathname}`} />
            <meta name="twitter:card" content="summary_large_image" />
            <meta name="twitter:site" content="@allen_ai" />
        </Helmet>
    );
};
