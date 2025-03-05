import CloseIcon from '@mui/icons-material/Close';
import {
    Dialog,
    DialogProps,
    DialogTitle,
    DialogTitleProps,
    IconButton,
    IconButtonProps,
} from '@mui/material';
import { SystemStyleObject } from '@mui/system';

import { SMALL_LAYOUT_BREAKPOINT } from '@/constants';

export const DEFAULT_MODAL_WIDTH = 970;

interface StandardModalProps extends DialogProps {
    width?: string | number;
    paperSx?: SystemStyleObject<Theme>;
}

export const StandardModal = ({
    children,
    width = DEFAULT_MODAL_WIDTH,
    open,
    onClose,
    sx,
    paperSx,
    ...rest
}: StandardModalProps) => {
    return (
        <Dialog
            fullWidth
            aria-labelledby="modal-title"
            aria-describedby="modal-description"
            sx={{ padding: 2 }}
            PaperProps={{
                sx: (theme) => ({
                    backgroundColor: 'background.paper',
                    backgroundImage: 'none',
                    width: '100%',
                    maxHeight: '100%',
                    padding: 2,
                    margin: '0 auto',
                    borderRadius: 2,
                    height: 'auto',
                    [theme.breakpoints.up(SMALL_LAYOUT_BREAKPOINT)]: {
                        maxWidth: `${width}px`,
                        padding: 4,
                        borderRadius: 4,
                    },
                    ...paperSx,
                }),
            }}
            {...rest}
            open={open}
            onClose={onClose}>
            {children}
        </Dialog>
    );
};

type StandardDialogCloseButtonProps = Pick<IconButtonProps, 'onClick'>;

export const StandardDialogCloseButton = ({ onClick }: StandardDialogCloseButtonProps) => {
    return (
        <IconButton
            aria-label="close"
            onClick={onClick}
            sx={(theme) => ({
                position: 'absolute',
                right: '8px',
                top: '8px',
                [theme.breakpoints.up(SMALL_LAYOUT_BREAKPOINT)]: {
                    top: '16px',
                    right: '16px',
                },
                color: theme.palette.grey[500],
            })}>
            <CloseIcon />
        </IconButton>
    );
};

export const StandardDialogTitle = ({ children, ...rest }: DialogTitleProps) => {
    return (
        <DialogTitle
            sx={{
                display: 'flex',
                flexDirection: 'column',
                paddingInline: 0,
                paddingBlockStart: 0,
            }}
            {...rest}>
            {children}
        </DialogTitle>
    );
};
