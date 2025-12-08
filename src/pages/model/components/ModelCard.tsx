import { css } from '@allenai/varnish-panda-runtime/css';
import { ArrowOutward } from '@mui/icons-material';
import { Typography } from '@mui/material';
import { generatePath } from 'react-router-dom';

import placeholderImage from '@/assets/dolma-research.jpg';
import {
    LinkCard,
    type LinkCardProps,
} from '@/components/thread/ThreadPlaceholder/LinkCard/LinkCard';
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
    className?: string;
    variant?: LinkCardProps['variant'];
    color?: LinkCardProps['color'];
};

export const ModelCard = ({
    id,
    type,
    name,
    description,
    informationUrl,
    imageUrl = placeholderImage,
    className,
    variant,
    color,
}: ModelCardProps) => {
    const isExternal = type === 'link';
    const url = isExternal
        ? informationUrl ?? '/' // we probably shouldn't be showing a card without an informationUrl, but it _is_ optional
        : generatePath(links.playground) + '?' + new URLSearchParams({ model: id }).toString();

    return (
        <LinkCard
            url={url}
            mediaUrl={imageUrl}
            alt={name}
            color={color}
            variant={variant}
            className={className}>
            <div className={css({ display: 'grid', gap: '3' })}>
                <div className={cardTitle}>
                    <Typography variant={imageUrl ? 'h3' : 'h4'} component="h4">
                        {name}
                    </Typography>
                    {isExternal ? <ArrowOutward /> : null}
                </div>
                <p>{description}</p>
            </div>
        </LinkCard>
    );
};
