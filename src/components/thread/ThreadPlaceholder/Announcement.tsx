import { css } from '@allenai/varnish-panda-runtime/css';
import { Link } from 'react-router-dom';

import { links } from '@/Links';

import { selectPubliclyAvailable, useModels } from '../ModelSelect/useModels';

const linkClassName = css({ color: 'links', fontWeight: 'semiBold' });

const announcementClassName = css({
    marginBlock: '[3dvh]',
    marginInline: 'auto',
    backgroundColor: {
        base: 'white',
        _dark: 'dark-teal.100',
    },
    boxShadow: '[0 2px 2px rgba(0, 0, 0, 0.15)]',
    paddingInline: '8',
    paddingBlock: '4',
    borderRadius: 'lg',
    display: 'grid',
    gap: '2',
    justifySelf: 'start',
    fontSize: 'lg',
    height: '[min-content]',
    gridColumn: '1/-1',
    textAlign: 'center',
});

interface AnnouncementProps {
    modelName: string;
    modelId: string;
}

export const Announcement = ({ modelName, modelId }: AnnouncementProps) => {
    const model =
        useModels({ select: selectPubliclyAvailable }).find((m) => m.id === modelId) != null;
    if (!modelId || !model) {
        return null;
    }

    return (
        <div className={announcementClassName}>
            <p>
                Announcing
                {` `}
                <Link to={links.selectModel(modelId)} className={linkClassName}>
                    {modelName}
                </Link>{' '}
                our new multimodal model.{` `}
                Checkout out all our{` `}
                <Link to={links.model.root} className={linkClassName}>
                    models
                </Link>
                .
            </p>
        </div>
    );
};
