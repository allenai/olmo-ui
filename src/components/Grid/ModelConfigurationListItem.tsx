import { IconButton } from '@allenai/varnish-ui';
import DeleteOutlineIcon from '@mui/icons-material/DeleteOutline';
import EditIcon from '@mui/icons-material/Edit';
import MenuIcon from '@mui/icons-material/Menu';
import { GridListItem } from 'react-aria-components';

import { SchemaResponseModel } from '@/api/playgroundApi/playgroundApiSchema';
import { css } from '@/styled-system/css';

interface Props {
    item: SchemaResponseModel;
}

const gridCell = css({
    display: 'flex',
    flexDirection: 'row',
    textAlign: 'center',
    border: '1px solid',
    borderColor: 'teal.80',
    justifyContent: 'space-between',
    padding: '2',
});

const gridCellLeft = css({
    display: 'flex',
    flexDirection: 'row',
    textAlign: 'center',
    alignItems: 'center',
    justifyContent: 'center',
    gap: '2',
});

const gridCellRight = css({
    display: 'flex',
    flexDirection: 'row',
    textAlign: 'center',
    alignItems: 'center',
    justifyContent: 'center',
    gap: '2',
});

const body1Text = css({
    margin: '0',
    fontFamily: 'body',
    fontWeight: 'regular',
    lineHeight: '4',
    fontSize: 'md',
    letterSpacing: '0',
    textOverflow: 'ellipsis',
    whiteSpace: 'nowrap',
    overflow: 'hidden',
});

const iconButton = css({
    '& svg': {
        color: 'white',
    },
});

export const ModelConfigurationListItem = ({ item }: Props) => (
    <GridListItem className={gridCell} id={item.id}>
        <div className={gridCellLeft}>
            <IconButton variant="text" className={iconButton}>
                <MenuIcon />
            </IconButton>
            <p className={body1Text}>{item.name}</p>
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
);
