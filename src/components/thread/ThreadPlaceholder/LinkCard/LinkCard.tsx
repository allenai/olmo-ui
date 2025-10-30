import { css, cva } from '@allenai/varnish-panda-runtime/css';
import { cx } from '@allenai/varnish-ui';
import type { PropsWithChildren } from 'react';
import { Link } from 'react-router-dom';

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
    maxHeight: '[120px]', // default
});

const imageClassName = css({
    width: '[100%]',
    height: '[100%]',
    objectFit: 'cover',
    objectPosition: 'center',
});

export interface LinkCardProps extends PropsWithChildren {
    url: string;
    image?: string;
    alt?: string;
    className?: string;
}

export const LinkCard = ({ url, image, alt, className, children }: LinkCardProps) => {
    const cardType = image ? 'image' : 'text';

    return (
        <Link to={url} className={cx(linkCard({ cardType }), className)}>
            {image ? (
                <div className={imageContainer}>
                    <img src={image} alt={alt} className={imageClassName} />
                </div>
            ) : null}
            <div>{children}</div>
        </Link>
    );
};
