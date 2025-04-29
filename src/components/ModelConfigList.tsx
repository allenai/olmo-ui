import { Button, IconButton, Stack } from '@allenai/varnish-ui';
import DeleteOutlineIcon from '@mui/icons-material/DeleteOutline';
import EditIcon from '@mui/icons-material/Edit';
import MenuIcon from '@mui/icons-material/Menu';
import { Card, CardContent, Typography } from '@mui/material';
import { useState } from 'react';
import { GridList, GridListItem, useDragAndDrop } from 'react-aria-components';
import { useListData } from 'react-stately';

import { DESKTOP_LAYOUT_BREAKPOINT } from '@/constants';
import { css } from '@/styled-system/css';

import { MetaTags } from './MetaTags';

const modelGridStyle = css({
    display: 'flex',
    flexDirection: 'column',
    border: '1px solid',
    borderColor: 'teal.80',
    borderRadius: 'sm',
    padding: '[18px]',
    gap: '[16px]',
    width: '[469px]',
    maxHeight: '[425px]',
    overflowY: 'scroll',
});

const gridCell = css({
    display: 'flex',
    flexDirection: 'row',
    textAlign: 'center',
    border: '1px solid',
    borderColor: 'teal.80',
    justifyContent: 'space-between',
    padding: '[18px]',
});

const gridCellLeft = css({
    display: 'flex',
    flexDirection: 'row',
    textAlign: 'center',
    alignItems: 'center',
    justifyContent: 'center',
    gap: '[16px]',
});

const gridCellRight = css({
    display: 'flex',
    flexDirection: 'row',
    textAlign: 'center',
    alignItems: 'center',
    justifyContent: 'ceneter',
    gap: '[16px]',
});

const iconButton = css({
    '& svg.MuiSvgIcon-root': {
        fill: 'white!important',
    },
});

export const ModelConfigList = () => {
    const gridData = [
        'OLMo 2 32B',
        'Tulu 3 405B',
        'Molmo',
        'OLMoE 1B 7B 0125',
        'Hello Kitty',
        'Hello World',
        'Hello There',
        'General Kenobi',
    ];

    const [isReorderMode, setIsReorderMode] = useState(false);

    const list = useListData({
        initialItems: gridData.map((title, index) => ({ id: index, title })),
        getKey: (item) => item.id,
    });

    const { dragAndDropHooks } = useDragAndDrop({
        getItems: (keys) =>
            [...keys].map((key) => {
                const item = list.getItem(key);
                return { 'text/plain': item?.title || '' };
            }),
        onReorder(e) {
            if (e.target.dropPosition === 'before') {
                list.moveBefore(e.target.key, e.keys);
            } else if (e.target.dropPosition === 'after') {
                list.moveAfter(e.target.key, e.keys);
            }
        },
    });

    return (
        <>
            <MetaTags />
            <Card
                elevation={0}
                sx={{
                    gridArea: 'content',
                    overflow: 'auto',
                    paddingInline: 2,
                }}>
                <CardContent
                    sx={(theme) => ({
                        backgroundColor: 'background.default',
                        paddingInline: 2,
                        [theme.breakpoints.up(DESKTOP_LAYOUT_BREAKPOINT)]: {
                            paddingInline: 4,
                        },
                    })}>
                    <Stack align="start" spacing={16}>
                        <Button
                            variant="contained"
                            color="secondary"
                            onClick={() => {
                                setIsReorderMode(!isReorderMode);
                            }}>
                            Change Order
                        </Button>
                        <GridList
                            className={modelGridStyle}
                            items={list.items}
                            dragAndDropHooks={dragAndDropHooks}>
                            {(item) => (
                                <GridListItem className={gridCell} key={item.id}>
                                    <div className={gridCellLeft}>
                                        <IconButton variant="text" className={iconButton}>
                                            <MenuIcon />
                                        </IconButton>
                                        <Typography variant="body1">{item.title}</Typography>
                                    </div>
                                    <div className={gridCellRight}>
                                        <IconButton variant="text" className={iconButton}>
                                            <EditIcon />
                                        </IconButton>
                                        <IconButton variant="text" className={iconButton}>
                                            <DeleteOutlineIcon />
                                        </IconButton>
                                    </div>
                                </GridListItem>
                            )}
                        </GridList>
                    </Stack>
                </CardContent>
            </Card>
        </>
    );
};
