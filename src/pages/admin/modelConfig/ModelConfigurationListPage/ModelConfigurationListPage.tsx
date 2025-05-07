import { Button, Icon, Stack } from '@allenai/varnish-ui';
import AddIcon from '@mui/icons-material/Add';
import React from 'react';

import { LinkButton } from '@/components/LinkButton';
import { links } from '@/Links';
import { useAdminModels } from '@/pages/admin/modelConfig/useGetAdminModels';

import { AddNewModel } from '../AddNewModel';
import { ModelConfigurationList } from '../components/ModelConfigurationList';

export const ModelConfigurationListPage = () => {
    const { data, status } = useAdminModels();
    const [open, setOpen] = React.useState(false);
    if (status === 'error' || !data) {
        return 'something went wrong';
    }

    return (
        <>
            <Stack spacing={8} direction="row" wrap="wrap">
                <Button
                    variant="contained"
                    color="secondary"
                    onClick={() => {
                        setOpen(true);
                    }}
                    endIcon={
                        <Icon>
                            <AddIcon />
                        </Icon>
                    }>
                    Add New Model
                </Button>
                <LinkButton to={links.modelOrder}>Reorder models</LinkButton>
            </Stack>
            <ModelConfigurationList items={data} />
            <AddNewModel
                open={open}
                onClose={() => {
                    setOpen(false);
                }}
            />
        </>
    );
};
