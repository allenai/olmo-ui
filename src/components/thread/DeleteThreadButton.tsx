import DeleteOutlinedIcon from '@mui/icons-material/DeleteOutlined';

import { useNavigate } from 'react-router-dom';

import dayjs from 'dayjs';

import isBetween from 'dayjs/plugin/isBetween';

import { FetchInfo, useAppContext } from '@/AppContext';
import { ResponsiveButton } from './ResponsiveButton';

import { links } from '@/Links';
import { Message } from '@/api/Message';

dayjs.extend(isBetween);

const isWithinThirtyDays = (selectedThreadInfo: FetchInfo<Message>) => {
    const thirtyDaysAgo: dayjs.Dayjs = dayjs().subtract(29, 'days');
    const currentDate = dayjs();
    const isWithinThirtyDaysBool = dayjs(selectedThreadInfo.data?.created).isBetween(
        thirtyDaysAgo.toDate(),
        currentDate.toDate(),
        null,
        '[]'
    );
    return isWithinThirtyDaysBool;
};

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

    const canDelete = selectedThreadInfo.data ? isWithinThirtyDays(selectedThreadInfo) : false;

    if (!canDelete) {
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
