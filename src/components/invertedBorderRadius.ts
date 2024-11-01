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

export const tabRoundedBorderStyle = {
    // Element with a sibling adjacent to it
    // https://stackoverflow.com/a/75685931
    '&:has(+ &)': {
        '&::after': {
            ...borderProps.base,
            ...borderProps.bottomRight,
        },
    },

    '& + &': {
        '&::before': {
            ...borderProps.base,
            ...borderProps.bottomLeft,
        },
    },
};
