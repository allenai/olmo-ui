import { Avatar } from '@mui/material';
import React from 'react';
import styled from 'styled-components';

import userAvatarURL from '../assets/user.svg';

export const UserAvatar = () => {
    return <UserStyledAvatar src={userAvatarURL} />;
};

const UserStyledAvatar = styled(Avatar)`
    background-color: ${({ theme }) => theme.color2.color.O6};
    height: 28px;
    width: 28px;
    img {
        height: 21px;
        width: 21px;
    }
`;
