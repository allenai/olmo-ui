import { cva, cx } from '@allenai/varnish-panda-runtime/css';
import { KeyboardArrowDown } from '@mui/icons-material';
import { IconButton } from '@mui/material';
import { useContext } from 'react';
import { DisclosureStateContext } from 'react-aria-components';

const expandArrowRecipe = cva({
    base: {
        // MUI's transition has higher precidence :(
        // TODO: find a better way
        transition: '[transform! 150ms ease-in-out]',
    },
    variants: {
        expanded: {
            true: {
                transform: '[rotate(180deg)]',
            },
        },
    },
});

interface ExpandArrowProps {
    className?: string;
    expanded?: boolean;
}

const ExpandArrow = ({ className, expanded = false }: ExpandArrowProps) => (
    <KeyboardArrowDown className={cx(expandArrowRecipe({ expanded }), className)} />
);

interface ExpandArrowButtonProps extends ExpandArrowProps {
    iconClassName?: string;
}

const ExpandArrowButton = ({ className, iconClassName, expanded }: ExpandArrowButtonProps) => {
    const disclosureState = useContext(DisclosureStateContext);
    const isExpanded = disclosureState?.isExpanded ?? false;

    return (
        <IconButton tabIndex={-1} component="span" size="small" className={className}>
            <ExpandArrow className={iconClassName} expanded={expanded ?? isExpanded} />
        </IconButton>
    );
};

export { ExpandArrow, ExpandArrowButton };
export type { ExpandArrowProps };
