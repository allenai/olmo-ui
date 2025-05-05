import { useDragAndDrop } from 'react-aria-components';
import { ListData } from 'react-stately';

import { SchemaResponseModel } from '@/api/playgroundApi/playgroundApiSchema';
import { ModelConfigurationList } from '@/components/Grid/ModelConfigurationList';

export const DraggableModelList = ({ list }: { list: ListData<SchemaResponseModel> }) => {
    const { dragAndDropHooks } = useDragAndDrop({
        getItems: (keys) =>
            [...keys].map((key) => {
                const item = list.getItem(key);
                return { 'text/plain': item?.name || '' };
            }),
        onReorder(e) {
            if (e.target.dropPosition === 'before') {
                list.moveBefore(e.target.key, e.keys);
            } else if (e.target.dropPosition === 'after') {
                list.moveAfter(e.target.key, e.keys);
            }
        },
    });

    return <ModelConfigurationList items={list.items} dragAndDropHooks={dragAndDropHooks} />;
};
