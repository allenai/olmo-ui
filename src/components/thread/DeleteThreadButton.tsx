import { DeleteOutlined } from '@mui/icons-material';
import DeleteOutlinedIcon from '@mui/icons-material/DeleteOutlined';

import { useUserAuthInfo } from '@/api/auth/auth-loaders';
import { useAppContext } from '@/AppContext';
import { isOlderThan30Days } from '@/utils/date-utils';

import { IconButtonWithTooltip } from '../IconButtonWithTooltip';
import { ResponsiveButton, ResponsiveButtonProps } from './ResponsiveButton';

type DeleteThreadButtonProps = Partial<
    Pick<ResponsiveButtonProps, 'isResponsive' | 'variant' | 'layout' | 'onClick'>
>;

export const DeleteThreadButton = ({
    variant = 'outlined',
    isResponsive = true,
    layout = 'both',
    onClick,
}: DeleteThreadButtonProps) => {
    const isPastThirtyDays = useAppContext(
        (state) =>
            // eslint-disable-next-line @typescript-eslint/no-unnecessary-condition
            state.selectedThreadMessagesById[state.selectedThreadRootId]?.isOlderThan30Days || false
    );
    const canUseDeleteButton = useAppContext(
        (state) =>
            // eslint-disable-next-line @typescript-eslint/no-unnecessary-condition
            state.selectedThreadMessagesById[state.selectedThreadRootId]?.creator ===
            state.userInfo?.client
    );
    const selectedThreadId = useAppContext((state) => state.selectedThreadRootId);

    if (isPastThirtyDays || !selectedThreadId) {
        return null;
    }

    return (
        <>
            <ResponsiveButton
                variant={variant}
                isResponsive={isResponsive}
                layout={layout}
                startIcon={<DeleteOutlinedIcon />}
                title="Delete this thread"
                onClick={onClick}
                disabled={!canUseDeleteButton}
            />
        </>
    );
};

interface DeleteThreadIconButtonProps {
    creator: string;
    createdDate: Date;
    isSelectedThread: boolean;
    onClick: () => void;
}

export const DeleteThreadIconButton = ({
    isSelectedThread,
    createdDate,
    creator,
    onClick,
}: DeleteThreadIconButtonProps) => {
    const userInfo = useAppContext((state) => state.userInfo);
    const { isAuthenticated } = useUserAuthInfo();

    const isPastThirtyDays = isOlderThan30Days(createdDate);
    const isCreator = userInfo?.client && creator === userInfo.client;

    if (!isAuthenticated || isPastThirtyDays || !isCreator) {
        return null;
    }

    return (
        <IconButtonWithTooltip
            sx={(theme) => ({
                color: isSelectedThread
                    ? theme.color['dark-teal-100'].hex
                    : theme.palette.text.drawer.primary,
                opacity: isSelectedThread ? 1 : 0,
                transition: '300ms opacity ease-in-out',
                '.Mui-focusVisible ~ div > &': {
                    opacity: 1,
                },
                '&.Mui-focusVisible, li:hover &': {
                    opacity: 1,
                },
            })}
            placement="right"
            onClick={onClick}
            disabled={!isCreator}
            label="Delete thread">
            <DeleteOutlined />
        </IconButtonWithTooltip>
    );
};
