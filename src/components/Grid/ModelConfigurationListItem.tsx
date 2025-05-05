import { css } from '@allenai/varnish-panda-runtime/css';
import { Button, IconButton, Modal, ModalTrigger } from '@allenai/varnish-ui';
import DeleteOutlineIcon from '@mui/icons-material/DeleteOutline';
import EditIcon from '@mui/icons-material/Edit';
import MenuIcon from '@mui/icons-material/Menu';
import { GridListItem } from 'react-aria-components';

import { SchemaResponseModel } from '@/api/playgroundApi/playgroundApiSchema';

interface Props {
    item: SchemaResponseModel;
    onDelete?: (id: string) => void;
}

const gridCell = css({
    display: 'flex',
    flexDirection: 'row',
    textAlign: 'center',
    border: '1px solid',
    borderColor: 'teal.80',
    justifyContent: 'space-between',
    padding: '2',
});

const gridCellLeft = css({
    display: 'flex',
    flexDirection: 'row',
    textAlign: 'center',
    alignItems: 'center',
    justifyContent: 'center',
    gap: '2',
});

const gridCellRight = css({
    display: 'flex',
    flexDirection: 'row',
    textAlign: 'center',
    alignItems: 'center',
    justifyContent: 'center',
    gap: '2',
});

const body1Text = css({
    margin: '0',
    fontFamily: 'body',
    fontWeight: 'regular',
    lineHeight: '4',
    fontSize: 'md',
    letterSpacing: '0',
    textOverflow: 'ellipsis',
    whiteSpace: 'nowrap',
    overflow: 'hidden',
    color: 'text.primary',
});

const modalStyling = css({
    padding: '[2rem]',
});

export const ModelConfigurationListItem = ({ item, onDelete }: Props) => {
    return (
        <GridListItem className={gridCell} id={item.id}>
            <div className={gridCellLeft}>
                <IconButton variant="text">
                    <MenuIcon />
                </IconButton>
                <p className={body1Text}>{item.name}</p>
            </div>
            <div className={gridCellRight}>
                <IconButton variant="text">
                    <EditIcon />
                </IconButton>
                <ModalTrigger>
                    <IconButton variant="text">
                        <DeleteOutlineIcon />
                    </IconButton>
                    <Modal
                        heading="Delete Mode"
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
            </div>
        </GridListItem>
    );
};
