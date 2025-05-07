import { css } from '@allenai/varnish-panda-runtime/css';
import { IconButton } from '@allenai/varnish-ui';
import DragIndicatorOutlinedIcon from '@mui/icons-material/DragIndicatorOutlined';
import EditIcon from '@mui/icons-material/Edit';
import { GridListItem } from 'react-aria-components';

import { SchemaResponseModel } from '@/api/playgroundApi/playgroundApiSchema';

import { DeleteModelDialog } from './DeleteModelDialog';

const gridListItemContainer = css({
    display: 'flex',
    flexDirection: 'row',
    textAlign: 'center',
    border: '1px solid',
    borderColor: 'teal.80',
    padding: '4',
    gap: '3',
    alignItems: 'center',

    '&[draggable]': {
        cursor: 'grab',
    },

    '&[data-focus-visible]': {
        outlineWidth: '2px',
        outlineStyle: 'solid',
        outlineColor: 'accent.tertiary',
    },

    '&[data-dragging]': {
        opacity: '0.6',
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
                <DeleteModelDialog modelId={item.id} />
            </>
        )}
    </GridListItem>
);
