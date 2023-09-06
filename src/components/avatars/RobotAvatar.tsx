import { Avatar } from '@mui/material';
import React from 'react';
import styled from 'styled-components';

import robotAvatarURL from '../assets/robot.svg';

export const RobotAvatar = () => {
    return <RobotStyledAvatar src={robotAvatarURL} />;
};

const RobotStyledAvatar = styled(Avatar)`
    background-color: ${({ theme }) => theme.color2.B6};
    height: 28px;
    width: 28px;
    img {
        height: 21px;
        width: 21px;
    }
`;
