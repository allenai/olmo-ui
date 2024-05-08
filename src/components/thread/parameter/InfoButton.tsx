import InfoOutlinedIcon from '@mui/icons-material/InfoOutlined';
import { IconButton } from '@mui/material';
import { type MouseEventHandler } from 'react';

interface InfoButtonProps {
    onClick: MouseEventHandler;
}

export const InfoButton = ({ onClick }: InfoButtonProps) => {
    return (
        <IconButton sx={{ color: 'inherit' }} onClick={onClick}>
            <InfoOutlinedIcon />
        </IconButton>
    );
};
