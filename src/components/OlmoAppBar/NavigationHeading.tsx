import { ListSubheader, Typography } from '@mui/material';

interface NavigationHeadingProps {
    headingText: string;
}
export const NavigationHeading = ({ headingText }: NavigationHeadingProps) => {
    return (
        <ListSubheader sx={{ paddingBlock: 2 }}>
            <Typography variant="h6" margin={0} color="primary">
                {headingText}
            </Typography>
        </ListSubheader>
    );
};
