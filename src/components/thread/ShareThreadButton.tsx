import ShareOutlinedIcon from '@mui/icons-material/ShareOutlined';
import { Snackbar } from '@mui/material';
import { useState } from 'react';

import { useAppContext } from '@/AppContext';
import { links } from '@/Links';

import { ResponsiveButton } from './ResponsiveButton';

export const ShareThreadButton = () => {
    const selectedThreadId = useAppContext((state) => state.selectedThreadRootId);
    const [open, setOpen] = useState(false);

    const handleShareThread = () => {
        if (selectedThreadId) {
            navigator.clipboard.writeText(location.origin + links.thread(selectedThreadId));
            setOpen(true);
        }
    };

    if (!selectedThreadId) {
        return null;
    }

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
                onClose={() => {
                    setOpen(false);
                }}
                message="URL Copied."
            />
        </>
    );
};
