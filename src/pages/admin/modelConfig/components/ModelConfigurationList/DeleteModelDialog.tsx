import { css } from '@allenai/varnish-panda-runtime/css';
import { Button, IconButton, Modal, ModalTrigger } from '@allenai/varnish-ui';
import DeleteOutlineIcon from '@mui/icons-material/DeleteOutline';

import { SchemaResponseModel } from '@/api/playgroundApi/playgroundApiSchema';

interface DeleteModelDialogProps {
    onDelete?: (id: string) => void;
    item: SchemaResponseModel;
}

const modalStyling = css({
    padding: '[2rem]',
});

export const DeleteModelDialog = ({ onDelete, item }: DeleteModelDialogProps) => {
    return (
        <ModalTrigger>
            <IconButton variant="text">
                <DeleteOutlineIcon />
            </IconButton>
            <Modal
                heading="Delete Model"
                className={modalStyling}
                buttons={[
                    <>
                        <Button variant="outlined" slot="close">
                            Close
                        </Button>
                        <Button
                            variant="contained"
                            color="secondary"
                            slot="close"
                            onClick={() => {
                                if (onDelete) {
                                    onDelete(item.id);
                                }
                            }}>
                            Confirm
                        </Button>
                    </>,
                ]}>
                <p>Are you sure you want to delete this model?</p>
            </Modal>
        </ModalTrigger>
    );
};
