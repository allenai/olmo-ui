import { Button } from '@allenai/varnish-ui';
import AddIcon from '@mui/icons-material/Add';
import { useState } from 'react';

import { useAdminModels } from '@/pages/admin/modelConfig/useGetAdminModels';
import { css } from '@/styled-system/css';

import { ModelConfigurationList } from './components/ModelConfigurationList';
import { ModelConfigurationListWithReorder } from './components/ModelConfigurationListWithReorder';

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

export const ModelConfigurationListPage = () => {
    const { data, status } = useAdminModels();
    const [userIsReordering, setUserIsReordering] = useState(false);

    if (status === 'error' || !data) {
        return 'something went wrong';
    }

    const ListComponent = userIsReordering
        ? ModelConfigurationListWithReorder
        : ModelConfigurationList;

    return (
        <>
            <div className={contentStyle}>
                <Button variant="contained" color="secondary" endIcon={<AddIcon />}>
                    Add New Model
                </Button>
                <ListComponent items={data} />
                <Button
                    variant="contained"
                    color="primary"
                    isDisabled={userIsReordering}
                    onClick={() => {
                        setUserIsReordering(true);
                    }}>
                    Reorder models
                </Button>
                <Button
                    isDisabled={!userIsReordering}
                    onClick={() => {
                        setUserIsReordering(false);
                    }}>
                    Save model order
                </Button>
            </div>
        </>
    );
};
