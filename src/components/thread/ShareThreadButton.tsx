import ShareOutlinedIcon from '@mui/icons-material/ShareOutlined';

import { useAppContext } from '@/AppContext';
import { links } from '@/Links';

import { ResponsiveButton } from './ResponsiveButton';

export const ShareThreadButton = () => {
    const selectedThreadId = useAppContext((state) => state.selectedThreadRootId);
    const addSnackMessage = useAppContext((state) => state.addSnackMessage);

    const handleShareThread = () => {
        if (selectedThreadId) {
            navigator.clipboard.writeText(location.origin + links.thread(selectedThreadId));

            addSnackMessage({
                id: `thread-copy-${new Date().getTime()}`.toLowerCase(),
                type: 'Brief',
                message: 'Link Copied',
            });
        }
    };

    if (!selectedThreadId) {
        return null;
    }

    return (
        <ResponsiveButton
            variant="outlined"
            startIcon={<ShareOutlinedIcon />}
            title="Share"
            onClick={handleShareThread}
        />
    );
};
