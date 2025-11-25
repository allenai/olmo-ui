import { css } from '@allenai/varnish-panda-runtime/css';
import { Close } from '@mui/icons-material';
import type { ReactNode } from 'react';
import { Button } from 'react-aria-components';

import { ThumbnailImage } from './ThumbnailImage';
import { VideoThumbnail } from './VideoThumbnail';

const thumbnailContainer = css({
    backgroundColor: 'background',
    position: 'relative',
    overflow: 'hidden',
    borderRadius: 'sm',
    maxWidth: '[clamp(80px, 30cqw, 120px)]',
    maxHeight: '[clamp(80px, 30cqw, 120px)]',
    aspectRatio: '1',
});

const removeButton = css({
    position: 'absolute',
    display: 'flex',
    zIndex: '[1]',
    top: '[0.5rem]',
    right: '[0.5rem]',
    padding: '[0.25rem]',

    background: 'dark-teal.100', // always green
    border: '[2px solid]',
    borderColor: 'cream.50',
    borderRadius: 'full',
    aspectRatio: '1',
    cursor: 'pointer',

    _focusVisible: {
        borderColor: 'cream.100',
    },

    color: 'elements.primary.contrast',
    fontSize: '[1rem]',

    _icon: {}, // > svg
});

interface ThumbnailProps {
    filename: string;
    type: string;
    src: string;
    onPressRemove: () => void;
}

export const Thumbnail = ({ filename, type, src, onPressRemove }: ThumbnailProps): ReactNode => {
    const alt = `User file ${filename}`;
    return (
        <div className={thumbnailContainer}>
            {type.startsWith('image/') ? (
                <ThumbnailImage alt={alt} src={src} title={filename} />
            ) : (
                <VideoThumbnail videoUrl={src} alt={alt} title={filename} />
            )}
            <RemoveButton filename={filename} onPressRemove={onPressRemove} />
        </div>
    );
};

type RemoveButtonProps = {
    filename: string;
    onPressRemove: () => void;
};

export const RemoveButton = ({ filename, onPressRemove }: RemoveButtonProps): ReactNode => {
    return (
        <Button
            className={removeButton}
            onPress={onPressRemove}
            aria-label={`Remove ${filename} from files to upload`}>
            <Close fontSize="inherit" />
        </Button>
    );
};
