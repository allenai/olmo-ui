import { css } from '@allenai/varnish-panda-runtime/css';
import { IconButton } from '@allenai/varnish-ui';
import DragIndicatorOutlinedIcon from '@mui/icons-material/DragIndicatorOutlined';
import EditIcon from '@mui/icons-material/Edit';
import { GridListItem } from 'react-aria-components';
import { useNavigate } from 'react-router-dom';

import { SchemaResponseModel } from '@/api/playgroundApi/playgroundApiSchema';
import { links } from '@/Links';

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

const modelDetailContainer = css({
    display: 'flex',
    flexDirection: 'column',
    alignItems: 'flex-start',
    flex: '1',
});

const modelMetadata = css({
    display: 'flex',
    flexWrap: 'wrap',
    gap: '2',
    fontSize: 'sm',

    '& span': {
        display: 'flex',
        flexDirection: 'row',
        alignItems: 'flex-start',
        gap: '1',
        width: '[100%]',
    },
    '@media (min-width: 640px)': {
        flexDirection: 'row',
        gap: '3',

        '& span': {
            width: '[auto]',
            whiteSpace: 'nowrap',
            overflow: 'hidden',
            textOverflow: 'ellipsis',
        },
    },
});

interface ModelConfigurationListItemProps {
    item: SchemaResponseModel;
}

export const ModelConfigurationListItem = ({ item }: ModelConfigurationListItemProps) => {
    const navigate = useNavigate();
    return (
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
                    <div className={modelDetailContainer}>
                        <p className={modelName}>{item.name}</p>
                        <div className={modelMetadata}>
                            <span>
                                <strong>Id:</strong> {item.id}
                            </span>
                            <span>
                                <strong>Prompt Type:</strong> {item.promptType}
                            </span>
                            <span>
                                <strong>Description:</strong> {item.description}
                            </span>
                            <span>
                                <strong>Model Type:</strong> {item.modelType}
                            </span>
                            <span>
                                <strong>Internal:</strong> {item.internal ? 'Yes' : 'No'}
                            </span>
                        </div>
                    </div>

                    <IconButton
                        variant="text"
                        isDisabled={allowsDragging}
                        onPress={() => {
                            navigate(links.editModel(item.id));
                        }}>
                        <EditIcon />
                    </IconButton>
                    <DeleteModelDialog modelId={item.id} />
                </>
            )}
        </GridListItem>
    );
};
