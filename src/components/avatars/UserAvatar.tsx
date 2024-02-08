import { Avatar } from '@mui/material';
import React from 'react';
import styled from 'styled-components';

import userAvatarURL from '../assets/user.svg';

export const UserAvatar = () => {
    return <UserStyledAvatar src={userAvatarURL} />;
};

// TODO Change 05 to 06
const UserStyledAvatar = styled(Avatar)`
    background-color: ${({ theme }) => theme.color2.color.O5.attributes.hex};
    height: 28px;
    width: 28px;
    img {
        height: 21px;
        width: 21px;
    }
`;
