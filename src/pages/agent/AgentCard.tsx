import { css } from '@allenai/varnish-panda-runtime/css';
import { ArrowOutward } from '@mui/icons-material';
import { Link, Typography } from '@mui/material';
import { generatePath } from 'react-router-dom';

import { Agent } from '@/api/playgroundApi/additionalTypes';

import { agentImages } from './agentLinks';

const cardClassName = css({
    // generic card styles
    display: 'grid',
    gap: '4',
    appearance: 'none',
    backgroundColor: 'elements.overlay.background',
    padding: '4',
    borderRadius: 'lg',
    fontWeight: 'medium',
    width: '[100%]',
});

const cardTitle = css({
    font: 'telegraf',
    display: 'flex',
    justifyContent: 'space-between',
});

type AgentCardProps = Agent & {
    type: 'playground' | 'link';
    isExternal?: boolean;
};

export const AgentCard = ({
    id,
    type,
    name,
    description,
    isExternal,
    // camelCase
    information_url: informationUrl,
}: AgentCardProps) => {
    // not sure if linked agents should goto informationUrl or another (https://asta.allen.ai ?)
    const url =
        type === 'playground' ? generatePath('/agent/:agentId', { agentId: id }) : informationUrl;

    const imageUrl = agentImages[id];

    return (
        <Link href={url} color="inherit" className={cardClassName}>
            <img src={imageUrl} alt={name} className={css({ width: '[100%]' })} />
            <div className={cardTitle}>
                <Typography variant="h3">{name}</Typography>
                {isExternal ? <ArrowOutward /> : null}
            </div>
            <p>{description}</p>
        </Link>
    );
};
