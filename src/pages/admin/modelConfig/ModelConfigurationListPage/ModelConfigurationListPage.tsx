import { css } from '@allenai/varnish-panda-runtime/css';
import { Button } from '@allenai/varnish-ui';
import AddIcon from '@mui/icons-material/Add';

import { LinkButton } from '@/components/LinkButton';
import { links } from '@/Links';
import { useAdminModels } from '@/pages/admin/modelConfig/useGetAdminModels';

import { ModelConfigurationList } from '../components/ModelConfigurationList';

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
                    <LinkButton to={links.modelOrder}>Reorder models</LinkButton>
                </div>
                <ModelConfigurationList items={data} />
            </div>
        </>
    );
};
