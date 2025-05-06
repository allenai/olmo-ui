import { css } from '@allenai/varnish-panda-runtime/css';
import { Button, IconButton, Modal, ModalTrigger } from '@allenai/varnish-ui';
import DeleteOutlineIcon from '@mui/icons-material/DeleteOutline';
import { useSubmit } from 'react-router-dom';

import { SchemaResponseModel } from '@/api/playgroundApi/playgroundApiSchema';
import { links } from '@/Links';

interface DeleteModelDialogProps {
    item: SchemaResponseModel;
}

const modalStyling = css({
    padding: '[2rem]',
});

export const DeleteModelDialog = ({ item }: DeleteModelDialogProps) => {
    const submit = useSubmit();

    const handleDeleteModel = () => {
        const path = links.deleteModel(item.id);
        submit(null, {
            method: 'DELETE',
            action: path,
        });
    };

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
                            type="submit"
                            name="delete-model"
                            onPress={handleDeleteModel}>
                            Confirm
                        </Button>
                    </>,
                ]}>
                <p>Are you sure you want to delete this model?</p>
            </Modal>
        </ModalTrigger>
    );
};
