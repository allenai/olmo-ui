import { css } from '@allenai/varnish-panda-runtime/css';
import { ArrowOutward } from '@mui/icons-material';
import { Typography } from '@mui/material';
import { generatePath } from 'react-router-dom';

import placeholderImage from '@/assets/dolma-research.jpg';
import { LinkCard } from '@/components/thread/ThreadPlaceholder/LinkCard/LinkCard';
import { links } from '@/Links';

const cardTitle = css({
    fontFamily: 'heading',
    display: 'flex',
    justifyContent: 'space-between',
});

type ModelCardProps = {
    type: 'playground' | 'link';
    id: string;
    name: string;
    description: string;
    informationUrl?: string | null;
    imageUrl?: string;
};

const modelCardClassName = css({
    height: {
        base: '[125px]',
        md: 'auto',
    },
});

export const ModelCard = ({
    id,
    type,
    name,
    description,
    informationUrl,
    imageUrl = placeholderImage,
}: ModelCardProps) => {
    const isExternal = type === 'link';
    const url = isExternal
        ? informationUrl ?? '/' // we probably shouldn't be showing a card without an informationUrl, but it _is_ optional
        : generatePath(links.playground) + '?' + new URLSearchParams({ model: id }).toString();

    return (
        <LinkCard url={url} image={imageUrl} alt={name} className={modelCardClassName}>
            <div className={css({ display: 'grid', gap: '3' })}>
                <div className={cardTitle}>
                    <Typography variant="h3">{name}</Typography>
                    {isExternal ? <ArrowOutward /> : null}
                </div>
                <p>{description}</p>
            </div>
        </LinkCard>
    );
};
