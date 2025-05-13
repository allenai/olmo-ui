import { css } from '@allenai/varnish-panda-runtime/css';
import { DragAndDropHooks, GridList } from 'react-aria-components';

import type { SchemaResponseModel } from '@/api/playgroundApi/playgroundApiSchema';

import { ModelConfigurationListItem } from './ModelConfigurationListItem';

const modelListContainer = css({
    '--list-gap': 'token(spacing.2)',
    display: 'flex',
    flexDirection: 'column',
    gap: 'var(--list-gap)',
    maxWidth: '[100%]',
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
}

export const ModelConfigurationList = ({
    items,
    dragAndDropHooks,
}: ModelConfigurationListProps) => (
    <GridList items={items} dragAndDropHooks={dragAndDropHooks} className={modelListContainer}>
        {(item) => <ModelConfigurationListItem key={item.id} item={item} />}
    </GridList>
);
