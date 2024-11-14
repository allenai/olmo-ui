import PlusIcon from '@mui/icons-material/Add';
import MoreHorizIcon from '@mui/icons-material/MoreHoriz';
import { Button, ButtonGroup, ButtonProps, Menu, Stack } from '@mui/material';
import { MouseEvent, ReactNode, useState } from 'react';
import { useMatch } from 'react-router-dom';

import { useFeatureToggles } from '@/FeatureToggleContext';
import { links } from '@/Links';
import { SMALL_THREAD_CONTAINER_QUERY } from '@/utils/container-query-utils';

import { useDesktopOrUp, useMediumLayoutOrUp } from '../dolma/shared';
import { CorpusLinkButton } from './attribution/AttributionButton';
import { DeleteDialog, DeleteThreadButton } from './DeleteThreadButton';
import { ParameterButton } from './parameter/ParameterButton';
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
            title="New Thread"
            variant={variant}
            layout={layout}
            isResponsive={isResponsive}
            href={links.playground}
            disabled={playgroundRoute?.pathname === links.playground}
        />
    );
};

export const ThreadPageControls = (): JSX.Element => {
    const isDesktop = useDesktopOrUp();
    const isMediumLayout = useMediumLayoutOrUp();

    const { isCorpusLinkEnabled, isParametersEnabled } = useFeatureToggles();

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
                    width: '100%',
                    gridColumn: '1 / -1',
                }}>
                <ButtonGroup size="large" variant="outlined" fullWidth>
                    {isCorpusLinkEnabled && <CorpusLinkButton />}
                    {isParametersEnabled && <ParameterButton />}
                    {!isMediumLayout ? (
                        <MoreButton
                            sx={(theme) => ({
                                flexBasis: 'min-content',
                                // copied from ResponsiveButton
                                borderColor: theme.palette.primary.contrastText,
                                color: theme.palette.primary.contrastText,
                                '&:hover': {
                                    color: theme.palette.primary.contrastText,
                                    borderColor: theme.palette.primary.contrastText,
                                },
                            })}>
                            <NewThreadButton
                                key="more-new-thread-button"
                                variant="list"
                                isResponsive={false}
                            />
                            <DeleteThreadButton
                                key="more-delete-thread-button"
                                variant="list"
                                isResponsive={false}
                                onClick={handleClickDelete}
                            />
                            <ShareThreadButton
                                key="more-share-thread-button"
                                variant="list"
                                isResponsive={false}
                            />
                        </MoreButton>
                    ) : null}
                </ButtonGroup>
                {isMediumLayout ? (
                    <ButtonGroup size="large" variant="outlined">
                        <NewThreadButton layout="icon" isResponsive={false} />
                        <DeleteThreadButton
                            layout="icon"
                            isResponsive={false}
                            onClick={handleClickDelete}
                        />
                        <ShareThreadButton layout="icon" isResponsive={false} />
                    </ButtonGroup>
                ) : null}
                <DeleteDialog openDialog={isDeleteDialogOpen} setOpenDialog={setDeleteDialogOpen} />
            </Stack>
        );
    }
};

type MoreButtonProps = Pick<ButtonProps, 'sx'> & {
    id?: string;
    children: ReactNode;
};

const MoreButton = ({ id = 'more-button', sx, children }: MoreButtonProps) => {
    const [anchorEl, setAnchorEl] = useState<null | HTMLElement>(null);
    const open = Boolean(anchorEl);
    const handleClick = (event: MouseEvent<HTMLElement>) => {
        setAnchorEl(event.currentTarget);
    };
    const handleClose = () => {
        setAnchorEl(null);
    };

    return (
        <>
            <Button
                aria-label="more"
                id={`${id}-button`}
                aria-controls={open ? `${id}-menu` : undefined}
                aria-expanded={open ? 'true' : undefined}
                aria-haspopup="true"
                onClick={handleClick}
                sx={sx}>
                <MoreHorizIcon />
            </Button>
            <Menu
                id={`${id}-menu`}
                aria-labelledby={`${id}-button`}
                anchorEl={anchorEl}
                open={open}
                onClose={handleClose}
                onClick={handleClose}
                MenuListProps={{
                    dense: true,
                    disablePadding: true,
                    component: 'div',
                    sx: (theme) => ({
                        '& > .MuiButton-root': {
                            borderBottom: `1px solid ${theme.palette.grey[300]}`,
                            borderRadius: 0,
                            '&:hover': {
                                borderColor: theme.palette.grey[300],
                            },
                            ':last-child': {
                                borderBottom: 'none',
                            },
                        },
                    }),
                }}
                PaperProps={{
                    style: {
                        width: '12rem',
                    },
                }}>
                {children}
            </Menu>
        </>
    );
};
