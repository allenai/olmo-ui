import { Helmet } from 'react-helmet';

interface Props {
    title?: string;
    description?: string;
}

export const MetaTags = ({
    title = "Dolma - AI2's Open Pretraining Dataset for AI Language Models",
    description = "Dolma is a free and open pretraining dataset that you can explore for yourself. With 3 trillion tokens, it is the world's largest dataset of its kind.",
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
