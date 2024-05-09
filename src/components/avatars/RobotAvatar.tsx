import { Avatar } from '@mui/material';
import styled from 'styled-components';

import robotAvatarURL from '../assets/robot.svg';

export const RobotAvatar = () => {
    return <RobotStyledAvatar src={robotAvatarURL} alt="A blue robot icon representing the LLM" />;
};

const RobotStyledAvatar = styled(Avatar)`
    background-color: ${({ theme }) => theme.color2.B6.hex};
    height: 28px;
    width: 28px;
    img {
        height: 21px;
        width: 21px;
    }
`;
