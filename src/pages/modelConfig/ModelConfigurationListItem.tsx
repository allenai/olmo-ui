import { IconButton } from '@allenai/varnish-ui';
import DeleteOutlineIcon from '@mui/icons-material/DeleteOutline';
import EditIcon from '@mui/icons-material/Edit';
import MenuIcon from '@mui/icons-material/Menu';

import { SchemaResponseModel } from '@/api/playgroundApi/playgroundApiSchema';
import { GridListItem } from '@/components/Grid/GridListItem';

interface Props {
    item: SchemaResponseModel;
    gridCellClass: string;
    gridCellLeftClass: string;
    gridCellRightClass: string;
    body1TextClass: string;
    iconButtonClass: string;
}

export const ModelConfigurationListItem = ({
    item,
    gridCellClass,
    gridCellLeftClass,
    gridCellRightClass,
    body1TextClass,
    iconButtonClass,
}: Props) => (
    <GridListItem className={gridCellClass}>
        <div className={gridCellLeftClass}>
            <IconButton variant="text" className={iconButtonClass}>
                <MenuIcon />
            </IconButton>
            <p className={body1TextClass}>{item.name}</p>
        </div>
        <div className={gridCellRightClass}>
            <IconButton variant="text" className={iconButtonClass}>
                <EditIcon />
            </IconButton>
            <IconButton variant="text" className={iconButtonClass}>
                <DeleteOutlineIcon />
            </IconButton>
        </div>
    </GridListItem>
);
