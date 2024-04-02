import { Button, Grid, IconButton, Tooltip, Typography, tooltipClasses } from '@mui/material';
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
                placement="left-start"
                slotProps={{
                    popper: {
                        sx: {
                            [`&.${tooltipClasses.popper}[data-popper-placement*="left"] .${tooltipClasses.tooltip}`]:
                                {
                                    marginRight: '160px',
                                    marginLeft: '-160px',
                                    marginTop: '-160px',
                                },
                        },
                    },
                }}
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
