import { Button, Stack } from '@mui/material';
import styled from 'styled-components';

export const Content = styled(Stack).attrs({ spacing: 3 })``;

export const SubmitButton = styled(Button)`
    && {
        background-color: ${({ theme }) => theme.color2.B4};
    }
`;
