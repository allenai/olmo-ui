import { DialogContent } from '@mui/material';

import {
    StandardDialogCloseButton,
    StandardDialogTitle,
    StandardModal,
} from '@/components/StandardModal';

interface PointPictureModalProps {
    open: boolean;
    closeModal: () => void;
    children?: React.ReactNode;
}

export const PointPictureModal = ({
    open,
    closeModal: handleClose,
    children,
}: PointPictureModalProps) => {
    return (
        <StandardModal open={open} onClose={handleClose} width={1200}>
            <StandardDialogTitle variant="h4">
                <StandardDialogCloseButton onClick={handleClose} />
            </StandardDialogTitle>
            <DialogContent
                sx={{
                    display: 'grid',
                    gridTemplate: 'auto / auto',
                    gridTemplateAreas: '"combined"',
                    width: 'fit-content',
                    height: 'fit-content',
                    maxWidth: '100%',
                }}>
                {children}
            </DialogContent>
        </StandardModal>
    );
};
