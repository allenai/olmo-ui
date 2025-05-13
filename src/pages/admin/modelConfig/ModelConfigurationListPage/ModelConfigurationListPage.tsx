import { Button, Card, CardHeader, Icon, Stack } from '@allenai/varnish-ui';
import AddIcon from '@mui/icons-material/Add';
import { useNavigate } from 'react-router-dom';

import { LinkButton } from '@/components/LinkButton';
import { links } from '@/Links';
import { useAdminModels } from '@/pages/admin/modelConfig/useGetAdminModels';

import { ModelConfigurationList } from '../components/ModelConfigurationList';

export const ModelConfigurationListPage = () => {
    const { data, status } = useAdminModels();
    const navigate = useNavigate();

    if (status === 'error' || !data) {
        return 'something went wrong';
    }

    return (
        <Card>
            <CardHeader>
                <Stack spacing={8} direction="row" wrap="wrap">
                    <Button
                        variant="contained"
                        color="secondary"
                        onClick={() => {
                            navigate(links.addModel);
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
            </CardHeader>
            <ModelConfigurationList items={data} />
        </Card>
    );
};
