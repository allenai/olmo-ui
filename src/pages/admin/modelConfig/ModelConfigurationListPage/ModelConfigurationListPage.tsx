import { Button, useDragAndDrop } from '@allenai/varnish-ui';
import AddIcon from '@mui/icons-material/Add';
import { useState } from 'react';
import { useSubmit } from 'react-router-dom';
import { useListData } from 'react-stately';

import { useAdminModels } from '@/pages/admin/modelConfig/useGetAdminModels';
import { css } from '@/styled-system/css';

import { ModelConfigurationList } from './components/ModelConfigurationList';

const contentStyle = css({
    backgroundColor: 'background',
    paddingInline: '2',
    flex: '[1]',
    display: 'flex',
    flexDirection: 'column',
    alignItems: 'center',
    gap: '2',
    height: '[100%]',
});

const buttonGroup = css({
    display: 'flex',
    flexFlow: 'row wrap',
    gap: '2',
});

export const ModelConfigurationListPage = () => {
    const { data, status } = useAdminModels();
    const [userIsReordering, setUserIsReordering] = useState(false);

    const submit = useSubmit();

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
        isDisabled: !userIsReordering,
    });

    if (status === 'error' || !data) {
        return 'something went wrong';
    }

    return (
        <>
            <div className={contentStyle}>
                <div className={buttonGroup}>
                    <Button variant="contained" color="secondary" endIcon={<AddIcon />}>
                        Add New Model
                    </Button>
                    <Button
                        variant="contained"
                        color="primary"
                        isDisabled={userIsReordering}
                        onPress={() => {
                            setUserIsReordering(true);
                        }}>
                        Reorder models
                    </Button>
                    <Button
                        type="submit"
                        name="reorder-models"
                        isDisabled={!userIsReordering}
                        onPress={(e) => {
                            setUserIsReordering(false);
                            // submit();
                        }}>
                        Save model order
                    </Button>
                </div>
                <ModelConfigurationList items={list.items} dragAndDropHooks={dragAndDropHooks} />
            </div>
        </>
    );
};
