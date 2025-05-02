import { Button } from '@allenai/varnish-ui';
import AddIcon from '@mui/icons-material/Add';
import { useState } from 'react';
import { useDragAndDrop } from 'react-aria-components';
import { useListData } from 'react-stately';

import { ModelConfigurationList } from '@/components/Grid/ModelConfigurationList';
import { MetaTags } from '@/components/MetaTags';
import { useAdminModels } from '@/pages/admin/modelConfig/components/useGetAdminModels';
import { css } from '@/styled-system/css';

const containerStyle = css({
    gridArea: 'content',
    paddingInline: '2',
    display: 'flex',
    flexDirection: 'column',
});

const contentStyle = css({
    backgroundColor: 'background',
    paddingInline: '2',
    flex: '[1]',
    display: 'flex',
    flexDirection: 'column',
    alignItems: 'center',
    gap: '2',
});

export const ModelConfigurationListPage = () => {
    const [hasReordered, setHasReordered] = useState(false);

    const { data, status } = useAdminModels();

    const list = useListData({
        initialItems: data?.map((model) => ({ ...model })) ?? [],
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
                setHasReordered(true);
            } else if (e.target.dropPosition === 'after') {
                list.moveAfter(e.target.key, e.keys);
                setHasReordered(true);
            }
        },
    });

    if (status === 'error' || !data) {
        return 'something went wrong';
    }

    console.log(data);

    return (
        <>
            <MetaTags />
            <div className={containerStyle}>
                <div className={contentStyle}>
                    <Button variant="contained" color="secondary" endIcon={<AddIcon />}>
                        Add New Model
                    </Button>
                    <ModelConfigurationList
                        items={list.items}
                        dragAndDropHooks={dragAndDropHooks}
                    />
                    {hasReordered && (
                        <Button
                            variant="contained"
                            color="primary"
                            onClick={() => {
                                setHasReordered(false);
                            }}>
                            Save Reorder
                        </Button>
                    )}
                </div>
            </div>
        </>
    );
};
