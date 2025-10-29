import { css } from '@allenai/varnish-panda-runtime/css';
import { cx } from '@allenai/varnish-ui';
import type { PropsWithChildren } from 'react';
import { Link } from 'react-router-dom';

const linkCardClassName = css({
    display: 'grid',
    gap: '4',
    appearance: 'none',
    backgroundColor: 'elements.overlay.background',
    padding: '4',
    borderRadius: 'lg',
    textAlign: 'left',
    fontWeight: 'medium',
    cursor: 'pointer',
    alignContent: 'center',
    gridTemplateColumns: {
        base: '35cqw 1fr',
        md: '1fr',
    },
    height: {
        base: '[100px]',
        md: 'auto',
    },
});

const imageContainer = css({
    borderRadius: 'sm',
    overflow: 'hidden',
    objectFit: 'contain',
    objectPosition: 'center',
    // set explcit elsewhere ?
    maxHeight: '[150px]',
});

export interface LinkCardProps extends PropsWithChildren {
    url: string;
    image?: string;
    alt?: string;
    className?: string;
}

export const LinkCard = ({ url, image, alt, className, children }: LinkCardProps) => {
    return (
        <Link to={url} className={cx(linkCardClassName, className)}>
            {image ? (
                <div className={imageContainer}>
                    <img src={image} alt={alt} className={css({ width: '[100%]' })} />
                </div>
            ) : null}
            <div>{children}</div>
        </Link>
    );
};
