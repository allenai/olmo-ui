import { css } from '@allenai/varnish-panda-runtime/css';
import { ArrowOutward } from '@mui/icons-material';
import { Typography } from '@mui/material';
import { generatePath } from 'react-router-dom';

import { LinkCard } from '@/components/thread/ThreadPlaceholder/LinkCard/LinkCard';

import { agentImages } from './agentLinks';

const cardTitle = css({
    fontFamily: 'heading',
    display: 'flex',
    justifyContent: 'space-between',
});

type AgentCardProps = {
    type: 'playground' | 'link';
    id: string;
    name: string;
    description: string;
    informationUrl?: string;
    isExternal?: boolean;
};

export const AgentCard = ({
    id,
    type,
    name,
    description,
    isExternal,
    // camelCase
    informationUrl,
}: AgentCardProps) => {
    const url =
        type === 'playground'
            ? generatePath('/agent/:agentId', { agentId: id })
            : informationUrl ?? '/'; // hmm

    const imageUrl = agentImages[id];

    return (
        <LinkCard url={url} image={imageUrl} alt={name}>
            <div className={cardTitle}>
                <Typography variant="h3">{name}</Typography>
                {isExternal ? <ArrowOutward /> : null}
            </div>
            <p>{description}</p>
        </LinkCard>
    );
};
