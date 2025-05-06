import { css } from '@allenai/varnish-panda-runtime/css';
import { DragAndDropHooks, GridList } from 'react-aria-components';

import type { SchemaResponseModel } from '@/api/playgroundApi/playgroundApiSchema';

import { ModelConfigurationListItem } from './ModelConfigurationListItem';

const modelListContainer = css({
    '--list-gap': 'token(spacing.2)',
    display: 'flex',
    flexDirection: 'column',
    border: '1px solid',
    borderColor: 'teal.80',
    borderRadius: 'sm',
    padding: '2',
    gap: 'var(--list-gap)',
    width: '[fit-content]',
    maxWidth: '[100%]',
    flex: '1',
    overflowY: 'auto',
    scrollbarGutter: 'stable both-edges',

    '& .react-aria-DropIndicator': {
        // This margin-block negates the gap for all the drop indicators that get added
        marginBlock: '[calc(var(--list-gap) / 2 * -1)]',
        '&[data-drop-target]': {
            outline: '1px solid token(colors.accent.tertiary)',
        },
    },
});

interface ModelConfigurationListProps {
    items: SchemaResponseModel[];
    dragAndDropHooks?: DragAndDropHooks;
    onDeleteModel?: (id: string) => void;
}

export const ModelConfigurationList = ({
    items,
    dragAndDropHooks,
    onDeleteModel,
}: ModelConfigurationListProps) => (
    <GridList items={items} dragAndDropHooks={dragAndDropHooks} className={modelListContainer}>
        {(item) => (
            <ModelConfigurationListItem key={item.id} item={item} onDelete={onDeleteModel} />
        )}
    </GridList>
);
