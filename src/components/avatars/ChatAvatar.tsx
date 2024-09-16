import { Avatar, AvatarProps } from '@mui/material';

export const ChatAvatar = (props: Omit<AvatarProps, 'sx'>) => (
    <Avatar sx={{ height: 28, width: 28 }} {...props} />
);
