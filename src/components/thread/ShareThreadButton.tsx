import ShareOutlinedIcon from '@mui/icons-material/ShareOutlined';

import { useAppContext } from '@/AppContext';
import { links } from '@/Links';
import { SnackMessageType } from '@/slices/SnackMessageSlice';

import { ResponsiveButton, ResponsiveButtonProps } from './ResponsiveButton';

type ShareThreadButtonProps = Partial<
    Pick<ResponsiveButtonProps, 'isResponsive' | 'layout' | 'variant'>
>;

export const ShareThreadButton = ({
    variant = 'outlined',
    layout = 'both',
    isResponsive = true,
}: ShareThreadButtonProps) => {
    const selectedThreadId = useAppContext((state) => state.selectedThreadRootId);
    const addSnackMessage = useAppContext((state) => state.addSnackMessage);

    if (!selectedThreadId) {
        return null;
    }

    const handleShareThread = () => {
        navigator.clipboard.writeText(location.origin + links.thread(selectedThreadId));
        addSnackMessage({
            id: `thread-copy-${new Date().getTime()}`.toLowerCase(),
            type: SnackMessageType.Brief,
            message: 'Link Copied',
        });
    };

    return (
        <ResponsiveButton
            variant={variant}
            layout={layout}
            isResponsive={isResponsive}
            startIcon={<ShareOutlinedIcon />}
            title="Share Thread"
            onClick={handleShareThread}
        />
    );
};
