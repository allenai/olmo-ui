import { css, cx } from '@allenai/varnish-panda-runtime/css';
import type { RecipeVariantProps } from '@allenai/varnish-panda-runtime/types';
import { KeyboardArrowDown } from '@mui/icons-material';

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

export { ExpandArrow };
export type { ExpandArrowProps };
