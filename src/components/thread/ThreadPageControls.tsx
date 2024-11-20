import PlusIcon from '@mui/icons-material/Add';
import { Stack } from '@mui/material';
import { useState } from 'react';
import { useMatch } from 'react-router-dom';

import { links } from '@/Links';
import { SMALL_THREAD_CONTAINER_QUERY } from '@/utils/container-query-utils';

import { useDesktopOrUp } from '../dolma/shared';
import { DeleteDialog, DeleteThreadButton } from './DeleteThreadButton';
import { ResponsiveButton, ResponsiveButtonProps } from './ResponsiveButton';
import { ShareThreadButton } from './ShareThreadButton';

type NewThreadButtonProps = Partial<
    Pick<ResponsiveButtonProps, 'isResponsive' | 'variant' | 'layout'>
>;

const NewThreadButton = ({
    variant = 'outlined',
    isResponsive = true,
    layout = 'both',
}: NewThreadButtonProps) => {
    const playgroundRoute = useMatch({
        path: links.playground,
    });

    return (
        <ResponsiveButton
            startIcon={<PlusIcon />}
            title="Create a new thread"
            variant={variant}
            layout={layout}
            isResponsive={isResponsive}
            href={links.playground}
            disabled={playgroundRoute?.pathname === links.playground}
        />
    );
};

export const ThreadPageControls = (): React.ReactNode => {
    const isDesktop = useDesktopOrUp();

    const [isDeleteDialogOpen, setDeleteDialogOpen] = useState(false);

    const handleClickDelete = () => {
        setDeleteDialogOpen(true);
    };

    if (isDesktop) {
        return (
            <Stack
                direction="row"
                gap={2}
                sx={{
                    height: 'auto',
                    alignItems: 'flex-start',
                    [SMALL_THREAD_CONTAINER_QUERY]: {
                        gridColumn: '1 / -1',
                        justifyContent: 'right',
                    },
                }}>
                <NewThreadButton />
                <DeleteThreadButton onClick={handleClickDelete} />
                <ShareThreadButton />
                <DeleteDialog openDialog={isDeleteDialogOpen} setOpenDialog={setDeleteDialogOpen} />
            </Stack>
        );
    } else {
        return (
            <Stack
                direction="row"
                gap={2}
                sx={{
                    height: 'auto',
                    alignItems: 'flex-start',
                    [SMALL_THREAD_CONTAINER_QUERY]: {
                        justifyContent: 'right',
                    },
                }}>
                <DeleteThreadButton onClick={handleClickDelete} />
                <DeleteDialog openDialog={isDeleteDialogOpen} setOpenDialog={setDeleteDialogOpen} />
            </Stack>
        );
    }
};
