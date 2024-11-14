import { Button, ButtonProps, Theme } from '@mui/material';

import { LARGE_THREAD_CONTAINER_QUERY } from '@/utils/container-query-utils';

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
    const sizeStyles = () => {
        if (responsiveSize !== 'none') {
            return {
                display: responsiveSize === 'large' ? 'none' : 'inline-flex',
                [LARGE_THREAD_CONTAINER_QUERY]: {
                    display: responsiveSize === 'large' ? 'inline-flex' : 'none',
                },
            };
        } else {
            return {};
        }
    };

    const btnVariant = variant === 'list' ? 'text' : variant;

    return (
        <Button
            {...props}
            variant={btnVariant}
            aria-label={title}
            startIcon={layout === 'both' ? startIcon : undefined}
            sx={(theme: Theme) => ({
                ...sizeStyles(),
                height: '100%',
                borderColor: theme.palette.primary.contrastText,
                color: theme.palette.primary.contrastText,
                '&:hover': {
                    color: theme.palette.primary.contrastText,
                    borderColor: theme.palette.primary.contrastText,
                },
                justifyContent: variant === 'list' ? 'start' : 'center',
                flexBasis: layout === 'icon' ? 'min-content' : undefined,
            })}>
            {layout === 'icon' ? startIcon : title}
        </Button>
    );
};

/**
 * Creates a responsive button set
 *
 * layout - see ResponsiveButtonBase -- when not creating a pair of buttons, which button layout to use
 * isResponsive - whether to make responsive
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
    if (isResponsive) {
        return (
            <>
                <ResponsiveButtonBase
                    {...props}
                    variant={variant}
                    startIcon={startIcon}
                    title={title}
                    layout={layout}
                    responsiveSize="large"
                />
                <ResponsiveButtonBase
                    {...props}
                    variant={variant}
                    startIcon={startIcon}
                    title={title}
                    layout="icon"
                    responsiveSize="small"
                />
            </>
        );
    }
    return (
        <ResponsiveButtonBase
            {...props}
            variant={variant}
            startIcon={startIcon}
            title={title}
            layout={layout}
            responsiveSize="none"
        />
    );
};
