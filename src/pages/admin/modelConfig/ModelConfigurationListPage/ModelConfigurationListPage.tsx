import { Button } from '@allenai/varnish-ui';
import AddIcon from '@mui/icons-material/Add';
import { useState } from 'react';

import { MetaTags } from '@/components/MetaTags';
import { ModelConfigurationList } from '@/pages/admin/modelConfig/ModelConfigurationListPage/components/ModelConfigurationList';
import { useAdminModels } from '@/pages/admin/modelConfig/useGetAdminModels';
import { css } from '@/styled-system/css';

import { ModelConfigurationListWithReorder } from './components/ModelConfigurationListWithReorder';

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
                    onClick={() => {
                        setUserIsReordering(true);
                    }}>
                    Save Reorder
                </Button>
            </div>
        </>
    );
};
