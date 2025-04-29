import { Stack, Button, IconButton } from '@allenai/varnish-ui';
import {useListData} from 'react-stately';
import {GridList, GridListItem} from 'react-aria-components';
import {useDragAndDrop} from 'react-aria-components';
import { Typography } from '@mui/material';
import { css } from '@/styled-system/css';
import MenuIcon from '@mui/icons-material/Menu';
import EditIcon from '@mui/icons-material/Edit';
import DeleteOutlineIcon from '@mui/icons-material/DeleteOutline';

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
})

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
    justifyContent: 'ceneter',
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
    }
});

export const ModelConfigList = () => {
    const gridData = [
        'OLMo 2 32B',
        'Tulu 3 405B',
        'Molmo',
        'OLMoE 1B 7B 0125',
        "Lmar",
        "Gemini",
        "Hello Kitty",
        "Hello There",
        "General Kenobi",
    ];

    // const list = useListData({
    //     initialItems: gridData,
    // });
    

    return (
        <Stack align='center'>
            <Stack align='start' spacing={16}>
                <Typography variant="h1">Models</Typography>
                <Button variant="contained" color='secondary' onClick={() => console.log("Hello world")}>Change Order</Button>
                <Button variant="contained" color='secondary' onClick={() => console.log("Hello world")}>Test</Button>

                {/* <GridList className={modelGridStyle}>
                    {
                        gridData.map((title: string)=>
                        <GridListItem className={gridCell} key={title}>
                            <div className={gridCellLeft}>
                                <IconButton variant="text" className={iconButton}>
                                    <MenuIcon />
                                </IconButton>
                                <Typography variant="body1">{title}</Typography>
                            </div>
                            <div className={gridCellRight}>
                                <IconButton variant="text" className={iconButton}>
                                    <EditIcon />
                                </IconButton>
                                <IconButton variant="text" className={iconButton}>
                                    <DeleteOutlineIcon />
                                </IconButton>
                            </div>
                        </GridListItem>)
                    }
                </GridList> */}
            </Stack>
        </Stack>
    )
}