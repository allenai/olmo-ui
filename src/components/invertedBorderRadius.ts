import { SxProps } from '@mui/material';

const borderProps = {
    base: {
        content: '""',
        display: 'block',
        position: 'absolute',
        background: 'inherit',
        width: '4px',
        height: '4px',
        clipPath: 'path("M0,4L0,0C0,2,2,4,4,4L0,4Z")',
    },
    bottomRight: {
        bottom: '0',
        right: '-4px',
    },

    bottomLeft: {
        bottom: '0',
        left: '-4px',
        transform: 'rotate(-90deg)',
    },

    topRight: {
        top: '0',
        right: '-4px',
        transform: 'rotate(90deg)',
    },

    topLeft: {
        top: '0',
        left: '-4px',
        transform: 'rotate(180deg)',
    },
};

type BorderCorner = 'bottomRight' | 'bottomLeft' | 'topLeft' | 'topRight';

export const invertedBorderRadius = (corner: BorderCorner, corner2?: BorderCorner): SxProps => {
    let after;
    const before = {
        '&::before': {
            ...borderProps.base,
            ...borderProps[corner],
        },
    };
    if (corner2) {
        after = {
            '&::after': {
                ...borderProps.base,
                ...borderProps[corner2],
            },
        };
    }
    return {
        ...before,
        ...after,
    };
};
