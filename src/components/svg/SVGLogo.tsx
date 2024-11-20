import { Box, BoxProps, useTheme } from '@mui/material';

export type SVGLogoProps = Pick<BoxProps, 'children' | 'sx'> & {
    color?: string;
    intrinsicWidth: number;
    intrinsicHeight: number;
    width?: number;
    title?: string;
};

export type SVGLogoComponentProps = Omit<SVGLogoProps, 'intrinsicWidth' | 'intrinsicHeight'>;

export const SVGLogo = ({
    width,
    intrinsicWidth,
    intrinsicHeight,
    title = '',
    color,
    children,
    sx,
}: SVGLogoProps) => {
    const theme = useTheme();

    const svgDefaultProps = {
        width: '100%',
        maxWidth: width ?? intrinsicWidth,
        height: 'auto',
        fill: 'currentColor',
        color: color ?? theme.palette.primary.main,
    };
    // Follows best practices for SVG images inline:
    // https://css-tricks.com/accessible-svgs/#aa-2-inline-svg
    return (
        <Box
            component="svg"
            viewBox={`0 0 ${intrinsicWidth} ${intrinsicHeight}`}
            role="img"
            // Array.isArray doesn't preserve Sx's array type
            // eslint-disable-next-line @typescript-eslint/no-unsafe-assignment
            sx={{ ...svgDefaultProps, ...(Array.isArray(sx) ? sx : [sx]) }}>
            <title>{title}</title>
            {children}
        </Box>
    );
};
