import { css } from '@allenai/varnish-panda-runtime/css';
import { Button, Stack } from '@allenai/varnish-ui';
import { useDragAndDrop } from 'react-aria-components';
import { useSubmit } from 'react-router-dom';
import { useListData } from 'react-stately';

import { LinkButton } from '@/components/LinkButton';
import { links } from '@/Links';

import { ModelConfigurationList } from '../components/ModelConfigurationList';
import { useAdminModels } from '../useGetAdminModels';

const containerStyle = css({
    maxHeight: '[100%]',
    alignSelf: 'center',
});

export const ReorderModelsPage = () => {
    const { data } = useAdminModels();

    const list = useListData({
        initialItems: data,
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

    const submit = useSubmit();

    const handleSaveModelOrder = () => {
        submit(
            list.items.map((item, i) => ({ id: item.id, order: i })),
            { method: 'PUT', encType: 'application/json' }
        );
    };

    return (
        <Stack direction="column" spacing={16} className={containerStyle}>
            <Stack direction="row" spacing={16}>
                <LinkButton to={links.modelConfiguration}>Cancel</LinkButton>
                <Button
                    type="submit"
                    name="reorder-models"
                    variant="contained"
                    onPress={handleSaveModelOrder}>
                    Save model order
                </Button>
            </Stack>
            <ModelConfigurationList items={list.items} dragAndDropHooks={dragAndDropHooks} />
        </Stack>
    );
};
