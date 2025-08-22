import { css, cx } from '@allenai/varnish-panda-runtime/css';
import { KeyboardArrowDown } from '@mui/icons-material';
import { IconButton } from '@mui/material';

const expandArrowRecipe = css({
    // MUI's transition has higher precidence :(
    // TODO: find a better way
    transition: '[transform! 150ms ease-in-out]',
    _groupExpanded: {
        transform: '[rotate(180deg)]',
    },
});

interface ExpandArrowProps {
    className?: string;
}

const ExpandArrow = ({ className }: ExpandArrowProps) => (
    <KeyboardArrowDown className={cx(expandArrowRecipe, className)} />
);

interface ExpandArrowButtonProps extends ExpandArrowProps {
    iconClassName?: string;
}

const ExpandArrowButton = ({ className, iconClassName }: ExpandArrowButtonProps) => {
    return (
        <IconButton tabIndex={-1} component="span" size="small" className={className}>
            <ExpandArrow className={iconClassName} />
        </IconButton>
    );
};

export { ExpandArrow, ExpandArrowButton };
export type { ExpandArrowProps };
