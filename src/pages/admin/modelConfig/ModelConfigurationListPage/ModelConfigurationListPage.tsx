import { css } from '@allenai/varnish-panda-runtime/css';
import { Button, Card, CardHeader, Icon, Stack } from '@allenai/varnish-ui';
import AddIcon from '@mui/icons-material/Add';
import { useNavigate } from 'react-router-dom';

import { LinkButton } from '@/components/LinkButton';
import { links } from '@/Links';
import { useAdminModels } from '@/pages/admin/modelConfig/useGetAdminModels';

import { ModelConfigurationList } from '../components/ModelConfigurationList';

const cardContainer = css({
    margin: '[0 auto]',
    paddingRight: '2',
    paddingLeft: '2',
    // 100vh - height of navbar and title
    // this makes scrollbar work on mobile
    maxHeight: '[calc(100vh - 132px)]',
});

export const ModelConfigurationListPage = () => {
    const { data, status } = useAdminModels();
    const navigate = useNavigate();

    if (status === 'error' || !data) {
        return 'something went wrong';
    }

    return (
        <Card className={cardContainer}>
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
