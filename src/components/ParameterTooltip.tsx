import { Button, Grid, IconButton, Tooltip, Typography } from '@mui/material';
import InfoIcon from '@mui/icons-material/Info';
import { useState } from 'react';

interface ParameterTooltipProps {
    title: string;
    content: string;
}

export const ParameterTooltip = ({ title, content }: ParameterTooltipProps) => {
    const [open, setOpen] = useState(false);

    const handleTooltipOpen = () => {
        setOpen(true);
    };
    const handleTooltipClose = () => {
        setOpen(false);
    };
    return (
        <>
            <Tooltip
                PopperProps={{
                    disablePortal: true,
                }}
                onClose={handleTooltipClose}
                open={open}
                disableFocusListener
                disableHoverListener
                disableTouchListener
                placement="top-end"
                title={
                    <Grid
                        container
                        direction="column"
                        justifyContent="flex-start"
                        alignItems="flex-start">
                        <Typography variant="h6">{title}</Typography>
                        <Typography variant="caption">{content}</Typography>
                        <Button onClick={handleTooltipClose}>Close</Button>
                    </Grid>
                }>
                <IconButton onClick={handleTooltipOpen}>
                    <InfoIcon />
                </IconButton>
            </Tooltip>
        </>
    );
};
