import DeleteOutlinedIcon from '@mui/icons-material/DeleteOutlined';

import { useNavigate } from 'react-router-dom';

import { useAppContext } from '@/AppContext';
import { ResponsiveButton } from './ResponsiveButton';

import { links } from '@/Links';

export const DeleteThreadButton = () => {
    const nav = useNavigate();
    const deleteThread = useAppContext((state) => state.deleteThread);
    const selectedThreadInfo = useAppContext((state) => state.selectedThreadInfo);

    const handleDeleteThread = () => {
        if (selectedThreadInfo.data) {
            deleteThread(selectedThreadInfo.data.id);
            nav(links.playground);
        }
    };
    return (
        <ResponsiveButton
            variant="outlined"
            startIcon={<DeleteOutlinedIcon />}
            title="Delete Thread"
            onClick={handleDeleteThread}
        />
    );
};
