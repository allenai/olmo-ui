import { Dialog, DialogProps } from '@mui/material';

import { DESKTOP_LAYOUT_BREAKPOINT, SMALL_LAYOUT_BREAKPOINT } from '@/constants';

export const DEFAULT_MODAL_WIDTH = 970;

interface StandardModalProps extends DialogProps {
    width?: string | number;
}

export const StandardModal = ({
    children,
    width = DEFAULT_MODAL_WIDTH,
    open,
    ...rest
}: StandardModalProps) => {
    return (
        <Dialog
            fullWidth
            aria-labelledby="modal-title"
            aria-describedby="modal-description"
            PaperProps={{
                sx: {
                    maxWidth: `${width}px`,
                    padding: 3.75,
                    margin: '0 auto',
                    backgroundColor: 'background.paper',
                    backgroundImage: 'none',
                },
            }}
            {...rest}
            open={open}>
            {children}
        </Dialog>
    );
};
