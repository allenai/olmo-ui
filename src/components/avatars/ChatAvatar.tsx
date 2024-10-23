import { Avatar, AvatarProps } from '@mui/material';

export const ChatAvatar = ({ sx, src, ...props }: AvatarProps) => (
    <Avatar
        src={src}
        sx={[
            {
                width: 28,
                height: 28,
                padding: '3px',
                '& .MuiAvatar-fallback': {
                    padding: '3px',
                },
                border: '1px solid rgba(0, 0, 0, 0.15)', // Tinted outline for border
            },
            // Array.isArray doesn't preserve Sx's array type
            // eslint-disable-next-line @typescript-eslint/no-unsafe-assignment
            ...(Array.isArray(sx) ? sx : [sx]),
        ]}
        {...props}
    />
);
