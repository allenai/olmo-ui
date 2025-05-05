import { Button } from '@allenai/varnish-ui';
import AddIcon from '@mui/icons-material/Add';
import { useState } from 'react';
import { useListData } from 'react-stately';

import { ModelConfigurationList } from '@/components/Grid/ModelConfigurationList';
import { MetaTags } from '@/components/MetaTags';
import { useAdminModels } from '@/pages/admin/modelConfig/components/useGetAdminModels';
import { css } from '@/styled-system/css';

import { DraggableModelList } from './DraggableModelList';

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
    const [isReorderModeOn, setIsReorderModeOn] = useState(false);

    const { data, status } = useAdminModels();

    const list = useListData({
        initialItems: data?.map((model) => ({ ...model })) ?? [],
        getKey: (item) => item.id,
    });

    if (status === 'error' || !data) {
        return 'something went wrong';
    }

    return (
        <>
            <MetaTags />
            <div className={containerStyle}>
                <div className={contentStyle}>
                    <Button variant="contained" color="secondary" endIcon={<AddIcon />}>
                        Add New Model
                    </Button>
                    <Button
                        variant="contained"
                        color="secondary"
                        onClick={() => {
                            setIsReorderModeOn(true);
                        }}>
                        Reorder
                    </Button>
                    {isReorderModeOn ? (
                        <DraggableModelList list={list} />
                    ) : (
                        <ModelConfigurationList items={list.items} />
                    )}
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
