import { css, cva } from '@allenai/varnish-panda-runtime/css';
import type { RecipeVariantProps } from '@allenai/varnish-panda-runtime/types';
import { cx } from '@allenai/varnish-ui';
import mime from 'mime/lite';
import type { PropsWithChildren } from 'react';
import { Link } from 'react-router-dom';

import { useVideoThumbnail } from '../../QueryForm/FileUploadThumbnails/useVideoThumbnail';

const linkCard = cva({
    base: {
        display: 'grid',
        alignItems: 'start',
        gap: '4',
        appearance: 'none',
        backgroundColor: {
            base: 'white',
            _dark: 'dark-teal.100',
        },
        padding: '4',
        borderRadius: 'lg',
        textAlign: 'left',
        fontWeight: 'medium',
        cursor: 'pointer',
        alignContent: 'start',
    },
    variants: {
        // internal variant
        cardType: {
            text: {}, // defaults
            image: {
                gridTemplateColumns: {
                    base: '35cqw 1fr',
                    md: '1fr',
                },
                gridTemplateRows: {
                    base: '1fr',
                    md: 'auto 1fr',
                },
            },
        },
        color: {
            default: {},
            faded: {
                backgroundColor: 'background.opacity-4',
            },
        },
    },
    defaultVariants: {
        color: 'default',
    },
});

const imageContainer = css({
    borderRadius: 'sm',
    overflow: 'hidden',
    maxHeight: '[7.5em]', // default
});

const imageClassNameInternal = css({
    width: '[100%]',
    height: '[100%]',
    objectFit: 'cover',
    objectPosition: 'center',
});

type LinkCardVariants = Exclude<RecipeVariantProps<typeof linkCard>, undefined>;

export interface LinkCardProps extends PropsWithChildren, LinkCardVariants {
    url: string;
    mediaUrl?: string;
    alt?: string;
    className?: string;
    imageContainerClassName?: string;
    imageClassName?: string;
}

export const LinkCard = ({
    url,
    mediaUrl,
    alt,
    color,
    cardType,
    className,
    imageContainerClassName,
    imageClassName,
    children,
}: LinkCardProps) => {
    const mimeType = mediaUrl ? mime.getType(mediaUrl) : '';
    const thumbnail = useVideoThumbnail({ videoUrl: mediaUrl || '', offsetPercent: 0.1 });
    const imageSrc = mimeType?.startsWith('video/')
        ? thumbnail
        : mimeType?.startsWith('image/')
          ? mediaUrl
          : '';
    // internal variant
    const cardTypeVariant = cardType ?? imageSrc ? 'image' : 'text';

    return (
        <Link to={url} className={cx(linkCard({ cardType: cardTypeVariant, color }), className)}>
            {cardTypeVariant === 'image' ? (
                <div className={cx(imageContainer, imageContainerClassName)}>
                    {imageSrc ? (
                        <img
                            src={imageSrc}
                            alt={alt}
                            className={cx(imageClassNameInternal, imageClassName)}
                        />
                    ) : null}
                </div>
            ) : null}
            <div>{children}</div>
        </Link>
    );
};
