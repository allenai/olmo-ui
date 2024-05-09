import { Box, Button, Dialog, Stack, Tooltip, Typography } from '@mui/material';

import { useSmallLayoutOrUp } from '../dolma/shared';

type ResponsiveTooltipProps = {
    isTooltipOpen: boolean;
    onTooltipClose: () => void;
    dialogTitle: string;
    dialogContent: string;
    children: JSX.Element;
    anchorEl?: HTMLElement;
};

export const ResponsiveTooltip = ({
    isTooltipOpen,
    onTooltipClose,
    dialogTitle,
    dialogContent,
    children,
    anchorEl,
}: ResponsiveTooltipProps): JSX.Element => {
    const handleTooltipClose = () => {
        onTooltipClose();
    };

    const TooltipBox = (
        <>
            <Box
                sx={{
                    py: 1.5,
                    px: 2,
                }}>
                <Typography
                    variant="h6"
                    sx={{
                        marginTop: 0,
                        marginBottom: 0.75,
                    }}>
                    {dialogTitle}
                </Typography>
                <Typography variant="body1">{dialogContent}</Typography>
            </Box>
            <Stack
                direction="row"
                alignItems="flex-start"
                sx={{
                    marginTop: 0.5,
                    marginBottom: 1,
                }}>
                <Button onClick={handleTooltipClose} size="small">
                    Close
                </Button>
            </Stack>
        </>
    );

    return useSmallLayoutOrUp() ? (
        <Tooltip
            disableHoverListener
            onClose={handleTooltipClose}
            open={isTooltipOpen}
            placement="left"
            slot="tooltip"
            slotProps={{
                tooltip: {
                    sx: (theme) => ({
                        padding: 0,
                        paddingBottom: theme.spacing(0.5),
                        borderRadius: theme.spacing(1.5),
                        position: 'relative',
                        right: theme.spacing(2),
                    }),
                },
                popper: { anchorEl },
            }}
            title={TooltipBox}>
            {children}
        </Tooltip>
    ) : (
        <>
            {children}
            <Dialog
                open={isTooltipOpen}
                onClose={handleTooltipClose}
                PaperProps={{
                    sx: (theme) => ({
                        borderRadius: theme.spacing(1.5),
                    }),
                }}>
                {TooltipBox}
            </Dialog>
        </>
    );
};
