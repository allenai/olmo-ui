import { css } from '@allenai/varnish-panda-runtime/css';
import { DragAndDropHooks, GridList } from 'react-aria-components';

import type { SchemaResponseModel } from '@/api/playgroundApi/playgroundApiSchema';

import { ModelConfigurationListItem } from './ModelConfigurationListItem';

const modelGridStyle = css({
    display: 'flex',
    flexDirection: 'column',
    border: '1px solid',
    borderColor: 'teal.80',
    borderRadius: 'sm',
    padding: '2',
    gap: '2',
    width: '[100%]',
    maxWidth: '[469px]',
    height: '[100%]',
    overflow: 'auto',
});

interface ModelConfigurationListProps {
    items: SchemaResponseModel[];
    dragAndDropHooks: DragAndDropHooks;
}

export const ModelConfigurationList = ({
    items,
    dragAndDropHooks,
}: ModelConfigurationListProps) => (
    <GridList items={items} dragAndDropHooks={dragAndDropHooks} className={modelGridStyle}>
        {(item) => <ModelConfigurationListItem key={item.id} item={item} />}
    </GridList>
);
