import { Box } from '@mui/material';
import { visuallyHidden } from '@mui/utils';

export const ATTRIBUTION_HIGHLIGHT_DESCRIPTION_ID = 'attribution-highlight-description';

export const AttributionHighlightDescription = () => {
    return (
        <Box id={ATTRIBUTION_HIGHLIGHT_DESCRIPTION_ID} sx={visuallyHidden}>
            Show documents related to this span
        </Box>
    );
};
