import DeleteOutlinedIcon from '@mui/icons-material/DeleteOutlined';

import { useNavigate } from 'react-router-dom';

import { useAppContext } from '@/AppContext';
import { ResponsiveButton } from './ResponsiveButton';

import { links } from '@/Links';

import dayjs from 'dayjs';

const isBetween = require('dayjs/plugin/isBetween')
dayjs.extend(isBetween)

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

    const canDeleteThread = () => {
        // const thirtyDaysAgo: dayjs.Dayjs = dayjs().subtract(29, 'days');
        // const currentDate = dayjs();
        // const isWithinThirtyDaysBool = selectedThreadInfo.data ? dayjs(selectedThreadInfo.data.created).isBetween(thirtyDaysAgo.toDate(), currentDate.toDate(), null, {'m': 'numeric', 'd': 'numeric'});
        // return isWithinThirtyDaysBool;
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
