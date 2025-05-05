import { css } from '@allenai/varnish-panda-runtime/css';
import { IconButton } from '@allenai/varnish-ui';
import DeleteOutlineIcon from '@mui/icons-material/DeleteOutline';
import DragIndicatorOutlinedIcon from '@mui/icons-material/DragIndicatorOutlined';
import EditIcon from '@mui/icons-material/Edit';
import { GridListItem } from 'react-aria-components';

import { SchemaResponseModel } from '@/api/playgroundApi/playgroundApiSchema';

const gridListItemContainer = css({
    display: 'flex',
    flexDirection: 'row',
    textAlign: 'center',
    border: '1px solid',
    borderColor: 'teal.80',
    padding: '4',
    gap: '3',
    alignItems: 'center',

    '&[data-focus-visible]': {
        outlineWidth: '2px',
        outlineStyle: 'solid',
        outlineColor: 'accent.tertiary',
    },
});

const modelName = css({
    marginInlineEnd: 'auto',
    fontFamily: 'body',
    fontWeight: 'regular',
    fontSize: 'md',
    letterSpacing: '0',
    textOverflow: 'ellipsis',
    whiteSpace: 'nowrap',
    overflow: 'hidden',
    color: 'text.primary',
});

const dragButton = css({
    '&[data-disabled="true"]': {
        visibility: 'hidden',
    },
});

interface ModelConfigurationListItemProps {
    item: SchemaResponseModel;
}

export const ModelConfigurationListItem = ({ item }: ModelConfigurationListItemProps) => (
    <GridListItem className={gridListItemContainer} id={item.id} textValue={item.name}>
        {({ allowsDragging }) => (
            <>
                <IconButton
                    variant="text"
                    isDisabled={!allowsDragging}
                    className={dragButton}
                    slot="drag">
                    <DragIndicatorOutlinedIcon />
                </IconButton>
                <p className={modelName}>{item.name}</p>
                <IconButton variant="text" isDisabled={allowsDragging}>
                    <EditIcon />
                </IconButton>
                <IconButton variant="text" isDisabled={allowsDragging}>
                    <DeleteOutlineIcon />
                </IconButton>
            </>
        )}
    </GridListItem>
);
