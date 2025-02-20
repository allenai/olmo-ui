import { Typography } from '@mui/material';

import { MessageProps, sharedMessageStyle } from './shared';

export const UserMessage = ({ children }: MessageProps): JSX.Element => {
    return (
        <Typography component="div" fontWeight="bold" sx={sharedMessageStyle}>
            {children}
        </Typography>
    );
};
