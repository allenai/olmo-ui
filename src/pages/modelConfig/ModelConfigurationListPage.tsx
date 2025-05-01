import { Button, Stack } from '@allenai/varnish-ui';
import AddIcon from '@mui/icons-material/Add';
import { useState } from 'react';
import { useDragAndDrop } from 'react-aria-components';
import { useListData } from 'react-stately';

import { MetaTags } from '@/components/MetaTags';
import { useAdminModels } from '@/pages/modelConfig/components/useGetAdminModels';
import { css } from '@/styled-system/css';

import { ModelConfigurationList } from './ModelConfigurationList';

const containerStyle = css({
    gridArea: 'content',
    paddingInline: 'var(--spacing-2)',
});

const contentStyle = css({
    backgroundColor: '[background.default]',
    paddingInline: 'var(--spacing-2)',
});

const modelGridStyle = css({
    display: 'flex',
    flexDirection: 'column',
    border: '1px solid',
    borderColor: 'teal.80',
    borderRadius: 'sm',
    padding: 'var(--spacing-2)',
    gap: 'var(--spacing-2)',
    width: '[100%]',
    maxWidth: '[469px]',
    maxHeight: '[425px]',
    overflow: 'auto',
});

const gridCell = css({
    display: 'flex',
    flexDirection: 'row',
    textAlign: 'center',
    border: '1px solid',
    borderColor: 'teal.80',
    justifyContent: 'space-between',
    padding: 'var(--spacing-2)',
});

const gridCellLeft = css({
    display: 'flex',
    flexDirection: 'row',
    textAlign: 'center',
    alignItems: 'center',
    justifyContent: 'center',
    gap: 'var(--spacing-2)',
});

const gridCellRight = css({
    display: 'flex',
    flexDirection: 'row',
    textAlign: 'center',
    alignItems: 'center',
    justifyContent: 'center',
    gap: 'var(--spacing-2)',
});

const body1Text = css({
    margin: '0',
    fontFamily: '[Manrope, Arial, sans-serif]',
    fontWeight: 'var(--font-weight-regular)',
    lineHeight: 'var(--line-height-4)',
    fontSize: 'var(--font-size-md)',
    letterSpacing: 'var(--letter-spacing-0)',
    textOverflow: 'ellipsis',
    whiteSpace: 'nowrap',
    overflow: 'hidden',
});

const iconButton = css({
    '& svg.MuiSvgIcon-root': {
        fill: 'white!important',
    },
});

export const ModelConfigurationListPage = () => {
    const [hasReordered, setHasReordered] = useState(false);

    const { data, status } = useAdminModels();

    const list = useListData({
        initialItems: data?.map((model) => ({ ...model })) ?? [],
        getKey: (item) => item.id,
    });

    const { dragAndDropHooks } = useDragAndDrop({
        getItems: (keys) =>
            [...keys].map((key) => {
                const item = list.getItem(key);
                return { 'text/plain': item?.name || '' };
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

    if (status === 'error' || !data) {
        return 'something went wrong';
    }

    return (
        <>
            <MetaTags />
            <div className={containerStyle}>
                <div className={contentStyle}>
                    <Stack align="start" spacing={16}>
                        <Button variant="contained" color="secondary" endIcon={<AddIcon />}>
                            Add New Model
                        </Button>
                        <ModelConfigurationList
                            items={list.items}
                            dragAndDropHooks={dragAndDropHooks}
                            gridCellClass={gridCell}
                            gridCellLeftClass={gridCellLeft}
                            gridCellRightClass={gridCellRight}
                            body1TextClass={body1Text}
                            iconButtonClass={iconButton}
                            className={modelGridStyle}
                        />
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
