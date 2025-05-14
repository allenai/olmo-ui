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
    whiteSpace: 'nowrap',
    overflowX: 'hidden',
    textOverflow: 'ellipsis',
});

const modelMetadata = css({
    display: 'flex',
    flexWrap: 'wrap',
    gap: '2',
    fontSize: 'sm',
    color: 'text',

    '& p': {
        display: 'inline-flex',
        alignItems: 'baseline',
        gap: '1',
        margin: '[0]',
        flex: '[1 1 100%]',
        minWidth: '[fit-content]',
    },

    '@media (min-width: 640px)': {
        '& p': {
            flex: '[0 1 auto]',
            minWidth: '[fit-content]',
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
                    {allowsDragging && (
                        <IconButton
                            variant="text"
                            isDisabled={!allowsDragging}
                            className={dragButton}
                            slot="drag">
                            <DragIndicatorOutlinedIcon />
                        </IconButton>
                    )}
                    <div className={modelDetailContainer}>
                        <p className={modelName}>{item.name}</p>
                        <div className={modelMetadata}>
                            <p>
                                <strong>Id:</strong> {item.id}
                            </p>
                            <p>
                                <strong>Prompt Type:</strong> {item.promptType}
                            </p>
                            <p>
                                <strong>Description:</strong> {item.description}
                            </p>
                            <p>
                                <strong>Model Type:</strong> {item.modelType}
                            </p>
                            <p>
                                <strong>Internal:</strong> {item.internal ? 'Yes' : 'No'}
                            </p>
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
