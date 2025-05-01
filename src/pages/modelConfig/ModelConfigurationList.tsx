import { DragAndDropHooks } from 'react-aria-components';

import type { SchemaResponseModel } from '@/api/playgroundApi/playgroundApiSchema';
import { GridList } from '@/components/Grid/GridList';

import { ModelConfigurationListItem } from './ModelConfigurationListItem';

interface ModelConfigurationListProps {
    items: SchemaResponseModel[];
    dragAndDropHooks: DragAndDropHooks;
    gridCellClass: string;
    gridCellLeftClass: string;
    gridCellRightClass: string;
    body1TextClass: string;
    iconButtonClass: string;
    className: string;
}

export const ModelConfigurationList = ({
    items,
    dragAndDropHooks,
    gridCellClass,
    gridCellLeftClass,
    gridCellRightClass,
    body1TextClass,
    iconButtonClass,
    className,
}: ModelConfigurationListProps) => (
    <GridList items={items} dragAndDropHooks={dragAndDropHooks} className={className}>
        {(item) => (
            <ModelConfigurationListItem
                key={item.id}
                item={item}
                gridCellClass={gridCellClass}
                gridCellLeftClass={gridCellLeftClass}
                gridCellRightClass={gridCellRightClass}
                body1TextClass={body1TextClass}
                iconButtonClass={iconButtonClass}
            />
        )}
    </GridList>
);
