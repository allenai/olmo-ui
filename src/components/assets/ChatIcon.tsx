import { SvgIcon } from '@mui/material';
import { ComponentProps } from 'react';

export const ChatIcon = (props: ComponentProps<typeof SvgIcon>): JSX.Element => {
    return (
        <SvgIcon {...props}>
            <svg width="20" height="20" viewBox="0 0 24 24" fill="none">
                <path
                    id="Chat"
                    fillRule="evenodd"
                    clipRule="evenodd"
                    d="M0 0H20V14.8003H13.9168L8.80089 20L7.24396 18.4176L13.0047 12.5624H17.7982V2.23792H2.20183V12.5624H7.28084V14.8003H0V0Z"
                    fill="currentColor"
                />
            </svg>
        </SvgIcon>
    );
};
