import RemoveCircleOutlineIcon from '@mui/icons-material/RemoveCircleOutline';
import ShareOutlinedIcon from '@mui/icons-material/ShareOutlined';
import { Button, Snackbar } from '@mui/material';
import { useState } from 'react';

const takeDownFormUrl = 'https://forms.gle/hGoEs8PJszcmxmh56';

// TODO: Combine this with ShareThreadButton once page layouts/container querys are consistent
export const ShareButton = ({ url, onClick }: { url: string; onClick?: () => void }) => {
    const [open, setOpen] = useState(false);
    if (!url) {
        return null;
    }

    return (
        <>
            <Button
                title="Share"
                variant="outlined"
                onClick={() => {
                    if (onClick) {
                        onClick();
                    }
                    navigator.clipboard.writeText(url);
                    setOpen(true);
                }}
                startIcon={<ShareOutlinedIcon />}>
                Share
            </Button>
            <Snackbar
                open={open}
                autoHideDuration={2500}
                onClose={() => {
                    setOpen(false);
                }}
                message="Link copied to clipboard"
            />
        </>
    );
};

export const RequestRemovalButton = () => {
    // TODO: This button just links to a google form, figure out what it should actually do

    return (
        <>
            <Button
                variant="outlined"
                startIcon={<RemoveCircleOutlineIcon />}
                target="_blank"
                href={takeDownFormUrl}>
                Request Removal
            </Button>
        </>
    );
};
