import { css } from '@allenai/varnish-panda-runtime/css';
import { Close } from '@mui/icons-material';
import type { ReactNode } from 'react';
import { Button } from 'react-aria-components';

import { PromptButton } from '../PromptButton';
import { ThumbnailImage } from './ThumbnailImage';
import { VideoThumbnail } from './VideoThumbnail';

const thumbnailContainer = css({
    backgroundColor: 'background',
    position: 'relative',
    overflow: 'hidden',
    borderRadius: 'sm',
    maxWidth: '[clamp(80px, 30cqw, 120px)]',
    maxHeight: '[clamp(80px, 30cqw, 120px)]',
    width: '[100%]',
    height: '[100%]',
    aspectRatio: '1',
});

const removeButton = css({
    position: 'absolute',

    zIndex: '[1]',
    top: '[0.5rem]',
    right: '[0.5rem]',
    padding: '[0.25rem]',

    background: 'dark-teal.100', // always green
    border: '[2px solid]',
    borderColor: 'cream.50',

    _focusVisible: {
        outline: 'none', // using border instead
        borderColor: 'green.100',
    },

    fontSize: '[1rem]',
    color: 'elements.primary.contrast',

    _disabled: {
        borderColor: '[currentColor/80]',
    },
    _hover: {
        _notDisabled: {
            color: 'cream.60',
        },
    },
});

interface ThumbnailProps {
    filename: string;
    type: string;
    src: string;
    isDisabled?: boolean;
    onPressRemove?: () => void;
    onClick?: () => void;
}

export const Thumbnail = ({
    filename,
    type,
    src,
    isDisabled,
    onPressRemove,
    onClick,
}: ThumbnailProps): ReactNode => {
    const alt = `User file ${filename}`;

    const computedOnClick = !isDisabled ? onClick : undefined;

    const Wrapper = onClick ? Button : 'div';
    return (
        <Wrapper
            className={thumbnailContainer}
            onClick={computedOnClick}
            style={computedOnClick ? { cursor: 'pointer' } : undefined}>
            {type.startsWith('image/') ? (
                <ThumbnailImage alt={alt} src={src} title={filename} />
            ) : (
                <VideoThumbnail videoUrl={src} alt={alt} title={filename} />
            )}
            {onPressRemove && (
                <RemoveButton
                    isDisabled={isDisabled}
                    filename={filename}
                    onPressRemove={onPressRemove}
                />
            )}
        </Wrapper>
    );
};

type RemoveButtonProps = {
    filename: string;
    isDisabled?: boolean;
    onPressRemove: () => void;
};

export const RemoveButton = ({
    filename,
    isDisabled,
    onPressRemove,
}: RemoveButtonProps): ReactNode => {
    return (
        <PromptButton
            className={removeButton}
            isDisabled={isDisabled}
            onPress={onPressRemove}
            aria-label={`Remove ${filename} from files to upload`}>
            <Close fontSize="inherit" />
        </PromptButton>
    );
};
