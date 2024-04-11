import ShareOutlinedIcon from '@mui/icons-material/ShareOutlined';

import { useState } from 'react';

import { Snackbar } from '@mui/material';

import { ResponsiveButton } from './ResponsiveButton';
import { useAppContext } from '@/AppContext';
import { links } from '@/Links';

export const ShareThreadButton = () => {
    const selectedThreadInfo = useAppContext((state) => state.selectedThreadInfo);
    const [open, setOpen] = useState(false);

    const handleShareThread = () => {
        if (selectedThreadInfo.data) {
            navigator.clipboard.writeText(
                location.origin + links.thread(selectedThreadInfo.data.id)
            );
            setOpen(true);
        }
    };

    if (!selectedThreadInfo.data) {
        return null;
    }

    const handleClose = (_event: React.SyntheticEvent | Event, _reason?: string) => {
        setOpen(false);
    };

    return (
        <>
            <ResponsiveButton
                variant="outlined"
                startIcon={<ShareOutlinedIcon />}
                title="Share"
                onClick={handleShareThread}
            />
            <Snackbar
                open={open}
                autoHideDuration={500}
                onClose={handleClose}
                message="URL Copied."
            />
        </>
    );
};
