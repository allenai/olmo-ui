import { css } from '@allenai/varnish-panda-runtime/css';
import { ArrowOutward } from '@mui/icons-material';
import { Link, Typography } from '@mui/material';
import { generatePath } from 'react-router-dom';

import { agentImages } from './agentLinks';

const cardClassName = css({
    display: 'grid',
    gridColumn: {
        base: '1/-1',
        md: 'auto',
    },
    gridTemplateColumns: {
        base: 'subgrid',
        md: '1fr',
    },
    gap: '4',
    backgroundColor: {
        base: 'white',
        _dark: 'elements.overlay.background',
    },
    padding: '4',
    borderRadius: 'lg',
    fontWeight: 'medium',
    width: '[100%]',
});

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
    // not sure if linked agents should goto informationUrl or another (https://asta.allen.ai ?)
    const url =
        type === 'playground' ? generatePath('/agent/:agentId', { agentId: id }) : informationUrl;

    const imageUrl = agentImages[id];

    return (
        <Link href={url} color="inherit" className={cardClassName}>
            <img src={imageUrl} alt={name} className={css({ width: '[100%]' })} />
            <div>
                <div className={cardTitle}>
                    <Typography variant="h3">{name}</Typography>
                    {isExternal ? <ArrowOutward /> : null}
                </div>
                <p>{description}</p>
            </div>
        </Link>
    );
};
