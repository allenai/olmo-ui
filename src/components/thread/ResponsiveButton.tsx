import { Button, ButtonProps, Theme } from '@mui/material';

import { minContainerQuery } from '@/utils/container-query-utils';

/**
 * Creates a single button to create a responsive button set
 *
 * layout - Can create an Icon button, a Text button or Both
 * responsiveSize - sets container query for button
 *   small - show on small contianers
 *   large - show on large containers
 *   none - don't use any container query
 */
type ResponsiveButtonBaseProps = Omit<ButtonProps, 'sx' | 'children' | 'variant'> & {
    title: string;
    variant: ButtonProps['variant'] | 'list';
    layout?: 'icon' | 'text' | 'both';
    responsiveSize?: 'small' | 'large' | 'none';
};

const ResponsiveButtonBase = ({
    title,
    startIcon,
    variant,
    layout = 'both',
    responsiveSize = 'none',
    ...props
}: ResponsiveButtonBaseProps): JSX.Element => {
    const sizeStyles = (theme: Theme) => {
        if (responsiveSize !== 'none') {
            return {
                display: responsiveSize === 'large' ? 'none' : 'inline-flex',
                [minContainerQuery(theme, 700)]: {
                    display: responsiveSize === 'large' ? 'inline-flex' : 'none',
                },
            };
        } else {
            return {};
        }
    };

    const btnVariant = variant === 'list' ? 'text' : variant;
    const bgHover = variant === 'list' ? { background: 'transparent' } : {};

    return (
        <Button
            {...props}
            variant={btnVariant}
            aria-label={title}
            startIcon={layout === 'both' ? startIcon : undefined}
            sx={(theme) => ({
                ...sizeStyles(theme),
                borderColor: theme.palette.primary.contrastText,
                color: theme.palette.primary.contrastText,
                '&:hover': {
                    color: theme.palette.primary.contrastText,
                    borderColor: theme.palette.primary.contrastText,
                    ...bgHover,
                },
                justifyContent: variant === 'list' ? 'start' : 'center',
                flexBasis: layout === 'icon' ? 'min-content' : undefined,
            })}>
            {layout !== 'icon' ? title : null}
            {layout === 'icon' ? startIcon : null}
        </Button>
    );
};

/**
 * Creates a responsive button set
 *
 * layout - see ResponsiveButtonBase -- when not creating a pair of buttons, which button layout to use
 * isResponsive - weather to make responsive
 */

export type ResponsiveButtonProps = Omit<ResponsiveButtonBaseProps, 'responsiveSize'> & {
    isResponsive?: boolean;
};

export const ResponsiveButton = ({
    title,
    startIcon,
    variant,
    layout = 'both',
    isResponsive = true,
    ...props
}: ResponsiveButtonProps): JSX.Element => {
    return (
        <>
            <ResponsiveButtonBase
                {...props}
                variant={variant}
                startIcon={startIcon}
                title={title}
                layout={layout}
                responsiveSize={isResponsive ? 'large' : 'none'}
            />
            {isResponsive ? (
                <ResponsiveButtonBase
                    {...props}
                    variant={variant}
                    startIcon={startIcon}
                    title={title}
                    layout="icon"
                    responsiveSize="small"
                />
            ) : null}
        </>
    );
};
