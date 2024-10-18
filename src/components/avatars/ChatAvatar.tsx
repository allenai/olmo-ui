import { Avatar, AvatarProps } from '@mui/material';

export const ChatAvatar = ({ sx, src, ...props }: AvatarProps) => (
    <Avatar
        src={src}
        sx={[
            { width: 28, height: 28, padding: '3px' },
            // Array.isArray doesn't preserve Sx's array type
            // eslint-disable-next-line @typescript-eslint/no-unsafe-assignment
            ...(Array.isArray(sx) ? sx : [sx]),
        ]}
        {...props}
    />
);
