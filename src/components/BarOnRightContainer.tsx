import { Theme } from '@mui/material';
import styled from 'styled-components';

interface Props {
    children: JSX.Element;
    displayBar?: boolean;
}
export const BarOnRightContainer = ({ children, displayBar = false }: Props) => {
    return <Wrapper displayBar={displayBar}>{children}</Wrapper>;
};

const Wrapper = styled.div<{ displayBar?: boolean }>`
    border-right: ${({ displayBar, theme }: { displayBar?: boolean; theme: Theme }) =>
        displayBar ? `6px solid ${theme.palette.warning.dark}` : `transparent`};
    margin-right: ${({ displayBar }) => (displayBar ? `10px` : `0px`)};
`;
