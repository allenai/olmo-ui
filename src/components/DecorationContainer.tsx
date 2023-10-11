import React from 'react';
import styled from 'styled-components';

interface Props {
    children: JSX.Element;
    showDecoration?: boolean;
}
export const DecorationContainer = ({ children, showDecoration = false }: Props) => {
    return <Wrapper showDecoration={showDecoration}>{children}</Wrapper>;
};

const Wrapper = styled.div<{ showDecoration?: boolean }>`
    border-right: ${({ showDecoration }) => (showDecoration ? `6px solid #F4D35E` : `transparent`)};
    margin-right: ${({ showDecoration }) => (showDecoration ? `10px` : `0px`)};
`;
