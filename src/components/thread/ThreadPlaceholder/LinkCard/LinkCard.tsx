import { css, cva } from '@allenai/varnish-panda-runtime/css';
import { cx } from '@allenai/varnish-ui';
import type { PropsWithChildren } from 'react';
import { Link } from 'react-router-dom';

import { useDetermineMimeType } from '@/utils/useDetermineFileType';

import { useVideoThumbnail } from '../../QueryForm/FileUploadThumbnails/useVideoThumbnail';

const linkCard = cva({
    base: {
        display: 'grid',
        gap: '4',
        appearance: 'none',
        backgroundColor: 'elements.overlay.background',
        padding: '4',
        borderRadius: 'lg',
        textAlign: 'left',
        fontWeight: 'medium',
        cursor: 'pointer',
        alignContent: 'start',
    },
    variants: {
        cardType: {
            text: {}, // defaults
            image: {
                gridTemplateColumns: {
                    base: '35cqw 1fr',
                    md: '1fr',
                },
                gridTemplateRows: {
                    base: '1fr',
                    md: '1fr auto',
                },
            },
        },
    },
});

const imageContainer = css({
    borderRadius: 'sm',
    overflow: 'hidden',
    maxHeight: '[7.5em]', // default
});

const imageClassName = css({
    width: '[100%]',
    height: '[100%]',
    objectFit: 'cover',
    objectPosition: 'center',
});

export interface LinkCardProps extends PropsWithChildren {
    url: string;
    mediaUrl?: string;
    alt?: string;
    className?: string;
}

export const LinkCard = ({ url, mediaUrl, alt, className, children }: LinkCardProps) => {
    const { mimeType } = useDetermineMimeType(mediaUrl);
    const thumbnail = useVideoThumbnail({ videoUrl: mediaUrl || '', offsetPercent: 0.1 });
    const imageSrc = mimeType?.startsWith('video/')
        ? thumbnail
        : mimeType?.startsWith('image/')
          ? mediaUrl
          : '';
    const cardType = imageSrc ? 'image' : 'text';

    return (
        <Link to={url} className={cx(linkCard({ cardType }), className)}>
            <div className={imageContainer}>
                {!!imageSrc && <img src={imageSrc} alt={alt} className={imageClassName} />}
            </div>
            <div>{children}</div>
        </Link>
    );
};
