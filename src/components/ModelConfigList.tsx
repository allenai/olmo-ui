import { Button, IconButton, Stack } from '@allenai/varnish-ui';
import AddIcon from '@mui/icons-material/Add';
import DeleteOutlineIcon from '@mui/icons-material/DeleteOutline';
import EditIcon from '@mui/icons-material/Edit';
import MenuIcon from '@mui/icons-material/Menu';
import { useState } from 'react';
import { useDragAndDrop } from 'react-aria-components';
import { useListData } from 'react-stately';

import { css } from '@/styled-system/css';

import { GridList } from './grid/GridList';
import { GridListItem } from './grid/GridListItem';
import { MetaTags } from './MetaTags';

const containerStyle = css({
    gridArea: 'content',
    overflow: 'auto',
    paddingInline: '[16px]',
});

const contentStyle = css({
    backgroundColor: '[background.default]',
    paddingInline: '[16px]',
});

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
    justifyContent: 'center',
    gap: '[16px]',
});

const body1Text = css({
    margin: '0',
    fontFamily: '[Manrope, Arial, sans-serif]',
    fontWeight: '[400]',
    lineHeight: '[1.5]',
    fontSize: '[1rem]',
    letterSpacing: '0rem',
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

    const [hasReordered, setHasReordered] = useState(false);

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
                setHasReordered(true);
            } else if (e.target.dropPosition === 'after') {
                list.moveAfter(e.target.key, e.keys);
                setHasReordered(true);
            }
        },
    });

    return (
        <>
            <MetaTags />
            <div className={containerStyle}>
                <div className={contentStyle}>
                    <Stack align="start" spacing={16}>
                        <Button variant="contained" color="secondary" endIcon={<AddIcon />}>
                            Add New Model
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
                                        <p className={body1Text}>{item.title}</p>
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
                        {hasReordered && (
                            <Button
                                variant="contained"
                                color="primary"
                                onClick={() => {
                                    setHasReordered(false);
                                }}>
                                Save Reorder
                            </Button>
                        )}
                    </Stack>
                </div>
            </div>
        </>
    );
};
