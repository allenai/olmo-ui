import { css } from '@allenai/varnish-panda-runtime/css';
import { cx } from '@allenai/varnish-ui';
import { alpha, Divider, Link, useColorScheme } from '@mui/material';
import { AnchorHTMLAttributes, HTMLAttributes } from 'react';
import { ExtraProps } from 'react-markdown';

export const CustomDivider = ({
    node: _node,
    ...props
}: HTMLAttributes<HTMLHRElement> & ExtraProps) => {
    const { mode, systemMode } = useColorScheme();
    const colorMode = mode === 'system' || !mode ? systemMode ?? 'dark' : mode;

    return (
        <Divider
            {...props}
            sx={(theme) => ({
                borderBottomWidth: '2px',
                borderColor: alpha(
                    // TODO: eval if this is still needed or if varnish proper is fine
                    colorMode === 'dark' ? theme.palette.common.white : theme.palette.common.black,
                    0.25
                ),
                margin: '1.5rem 0',
            })}
        />
    );
};

export const CustomLink = ({
    node: _node,
    ...props
}: AnchorHTMLAttributes<HTMLAnchorElement> & ExtraProps) => (
    <Link
        {...props}
        target="_blank"
        rel="noopener noreferrer"
        sx={(theme) => ({
            '&, &:visited': {
                color: theme.vars.palette.primary.main,
            },
        })}
    />
);

const whitespace = css({ whiteSpace: 'pre-wrap' });

export const CustomPre = ({
    node: _node,
    className,
    ...props
}: HTMLAttributes<HTMLPreElement> & ExtraProps) => (
    <pre className={cx(whitespace, className)} {...props} />
);
