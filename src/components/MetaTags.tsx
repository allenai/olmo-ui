import { Helmet } from 'react-helmet';

interface Props {
    title?: string;
    description?: string;
}

export const MetaTags = ({
    title = 'AI2 OLMo',
    description = 'A state-of-the-art LLM and framework intentionally designed to provide access to data, training code, models, and evaluation code.',
}: Props) => {
    return (
        <Helmet>
            <title>{title}</title>
            <meta name="twitter:title" content={title} />
            <meta property="og:title" content={title} />
            <meta name="description" content={description} />
            <meta name="twitter:description" content={description} />
            <meta property="og:description" content={description} />
        </Helmet>
    );
};
