import { alpha, Divider, Link, styled } from '@mui/material';

export const HorizontalRule = styled(Divider)(({ theme }) => ({
    borderBottomWidth: '2px',
    borderColor: alpha(
        theme.palette.mode === 'dark' ? theme.palette.common.white : theme.palette.common.black,
        0.25
    ),
    margin: '1.5rem 0',
}));

export const CustomParagraph = styled('p')({
    margin: 0,
    marginBlockEnd: '1em',
});

export const CustomLink = styled(Link)(({ theme }) => ({
    '&, & a:visited': {
        color: theme.palette.primary.main,
    },
}));
