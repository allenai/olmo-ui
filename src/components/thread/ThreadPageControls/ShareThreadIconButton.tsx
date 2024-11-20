import { useUserAuthInfo } from "@/api/auth/auth-loaders";
import { useAppContext } from "@/AppContext";
import { IconButtonWithTooltip } from "@/components/IconButtonWithTooltip";
import { links } from "@/Links";
import { SnackMessageType } from "@/slices/SnackMessageSlice";
import { IosShareOutlined } from "@mui/icons-material";

export const ShareThreadIconButton = () => {
    const selectedThreadId = useAppContext((state) => state.selectedThreadRootId);
    const addSnackMessage = useAppContext((state) => state.addSnackMessage);

    const { isAuthenticated } = useUserAuthInfo();

    const shouldDisableShareButton = !selectedThreadId || !isAuthenticated;

    const handleShareThread = async () => {
        await navigator.clipboard.writeText(location.origin + links.thread(selectedThreadId));
        addSnackMessage({
            id: `thread-copy-${new Date().getTime()}`.toLowerCase(),
            type: SnackMessageType.Brief,
            message: 'Link Copied',
        });
    };

    return (
        <IconButtonWithTooltip
            onClick={handleShareThread}
            disabled={shouldDisableShareButton}
            label="Share this thread">
            <IosShareOutlined
                sx={{
                    // This Icon looks visually off when centered
                    transform: 'translateY(-2px)',
                }} />
        </IconButtonWithTooltip>
    );
};
