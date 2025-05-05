import { css } from '@allenai/varnish-panda-runtime/css';
import { DragAndDropHooks, GridList } from 'react-aria-components';

import type { SchemaResponseModel } from '@/api/playgroundApi/playgroundApiSchema';

import { ModelConfigurationListItem } from './ModelConfigurationListItem';

const modelListContainer = css({
    display: 'flex',
    flexDirection: 'column',
    border: '1px solid',
    borderColor: 'teal.80',
    borderRadius: 'sm',
    padding: '2',
    gap: '2',
    width: '[100%]',
    maxWidth: '[469px]',
    flex: '1',
    overflow: 'auto',

    '& .react-aria-DropIndicator': {
        '&[data-drop-target]': {
            outline: '1px solid red',
            outlineColor: 'accent.tertiary',
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
