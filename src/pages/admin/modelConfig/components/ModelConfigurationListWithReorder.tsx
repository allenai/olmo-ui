import type { ComponentProps } from 'react';
import { useDragAndDrop } from 'react-aria-components';
import { useListData } from 'react-stately';

import { ModelConfigurationList } from '@/pages/admin/modelConfig/components/ModelConfigurationList';

interface ModelConfigurationListWithReorderProps
    extends ComponentProps<typeof ModelConfigurationList> {
    dragAndDropHooks?: never;
}

export const ModelConfigurationListWithReorder = ({
    items,
    ...rest
}: ModelConfigurationListWithReorderProps) => {
    const list = useListData({
        initialItems: items,
        getKey: (item) => item.id,
    });

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

    return (
        <ModelConfigurationList {...rest} items={list.items} dragAndDropHooks={dragAndDropHooks} />
    );
};
