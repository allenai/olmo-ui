import { css } from '@allenai/varnish-panda-runtime/css';

export const menuItemClassName = css({
    color: 'text',
    paddingBlock: '1',
    paddingInline: '5',
    cursor: 'pointer',
    _hover: {
        backgroundColor: 'background.opacity-4',
    },
    outline: 'none',
});

export const menuClassName = css({
    display: 'grid',
    gap: '2',
    paddingBlock: '2',
    backgroundColor: 'elements.overrides.form.input.fill',
    borderRadius: 'sm',
    overflow: 'hidden',
    boxShadow: '0 4px 4px 0 rgba(0, 0, 0, 0.20)',
    outline: 'none',
});
