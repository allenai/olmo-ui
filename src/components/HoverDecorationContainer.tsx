import React from 'react';
import styled from 'styled-components';

interface Props {
    children: JSX.Element;
    showDecoration?: boolean;
}
export const HoverDecorationContainer = ({ children, showDecoration = true }: Props) => {
    const [hoverActive, setHoverActive] = React.useState(false);

    const onHover = () => {
        setHoverActive(true);
    };

    const onHoverEnd = () => {
        setHoverActive(false);
    };

    return (
        <Wrapper
            onMouseOver={onHover}
            onMouseOut={onHoverEnd}
            onBlur={onHover}
            onFocus={onHoverEnd}
            hover={hoverActive && showDecoration}>
            {children}
        </Wrapper>
    );
};

const Wrapper = styled.div<{ hover?: boolean }>`
    border-right: ${({ hover }) => (hover ? `6px solid #F4D35E` : `transparent`)};
    margin-right: ${({ hover }) => (hover ? `10px` : `0px`)};
`;
