import DeleteOutlinedIcon from '@mui/icons-material/DeleteOutlined';
import { useNavigate } from 'react-router-dom';
import dayjs from 'dayjs';

import { useAppContext } from '@/AppContext';
import { ResponsiveButton } from './ResponsiveButton';
import { links } from '@/Links';

const isAfterThirtyDays = (selectedThreadDate: Date | undefined) => {
    const targetDate = dayjs(selectedThreadDate).add(29, 'days').format('YYYY-MM-DD');

    const isAfterThirtyDays = dayjs().isAfter(targetDate, 'day');

    return isAfterThirtyDays;
};

export const DeleteThreadButton = () => {
    const nav = useNavigate();
    const deleteThread = useAppContext((state) => state.deleteThread);
    const selectedThreadId = useAppContext((state) => state.selectedThread?.id);
    const isPastThirtyDays = useAppContext((state) =>
        isAfterThirtyDays(state.selectedThread?.created)
    );

    const handleDeleteThread = () => {
        if (selectedThreadId) {
            deleteThread(selectedThreadId);
            nav(links.playground);
        }
    };

    if (isPastThirtyDays || !selectedThreadId) {
        return null;
    }

    return (
        <ResponsiveButton
            variant="outlined"
            startIcon={<DeleteOutlinedIcon />}
            title="Delete Thread"
            onClick={handleDeleteThread}
        />
    );
};
