import {
    Button,
    Dialog,
    DialogActions,
    DialogContent,
    DialogContentText,
    DialogTitle,
    Tooltip,
} from '@mui/material';

import { useSmallLayoutOrUp } from '../dolma/shared';

type ResponsiveTooltipProps = {
    isTooltipOpen: boolean;
    onTooltipClose: () => void;
    dialogTitle: string;
    dialogContent: string;
    children: JSX.Element;
    anchorEl?: HTMLElement;
    tooltipId: string;
};

export const ResponsiveTooltip = ({
    isTooltipOpen,
    onTooltipClose,
    dialogTitle,
    dialogContent,
    children,
    anchorEl,
    tooltipId,
}: ResponsiveTooltipProps): JSX.Element => {
    const handleTooltipClose = () => {
        onTooltipClose();
    };

    const isSmallLayoutOrUp = useSmallLayoutOrUp();

    const tooltipLabelId = `tooltip-title-${tooltipId}`;
    const tooltipContentId = `tooltip-content-${tooltipId}`;

    const TooltipContent = (
        <>
            <DialogTitle
                variant={isSmallLayoutOrUp ? 'subtitle2' : 'h6'}
                component="p"
                margin={0}
                id={tooltipLabelId}
                sx={{
                    paddingBlockEnd: 1,
                }}>
                {dialogTitle}
            </DialogTitle>
            <DialogContent sx={{ paddingBlockEnd: 0 }}>
                <DialogContentText id={tooltipContentId}>{dialogContent}</DialogContentText>
            </DialogContent>
            <DialogActions sx={{ justifyContent: 'flex-start' }} disableSpacing>
                <Button onClick={handleTooltipClose} size="small">
                    Close
                </Button>
            </DialogActions>
        </>
    );

    return isSmallLayoutOrUp ? (
        <Tooltip
            disableHoverListener
            onClose={handleTooltipClose}
            open={isTooltipOpen}
            placement="left"
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
            title={TooltipContent}>
            {children}
        </Tooltip>
    ) : (
        <>
            {children}
            <Dialog
                open={isTooltipOpen}
                onClose={handleTooltipClose}
                aria-labelledby={tooltipLabelId}
                aria-describedby={tooltipContentId}
                PaperProps={{
                    sx: (theme) => ({
                        borderRadius: theme.spacing(1.5),
                    }),
                }}>
                {TooltipContent}
            </Dialog>
        </>
    );
};
