import CloseIcon from '@mui/icons-material/Close';
import { Divider, IconButton, ListSubheader, Stack, Typography } from '@mui/material';

import { useAppContext } from '@/AppContext';
import { getFAQIdByShortId } from '@/components/faq/faq-utils';
import { FullScreenDrawer, FullScreenDrawerHeader } from '@/components/TemporaryDrawer';
import { RemoteState } from '@/contexts/util';
import { links } from '@/Links';

import { FullAttributionContent } from './AttributionContent';

export const ATTRIBUTION_DRAWER_ID = 'attribution';

export const AttributionDrawer = () => {
    return (
        <FullScreenDrawer
            drawerId="attribution"
            header={({ onDrawerClose }) => (
                <FullScreenDrawerHeader>
                    <Stack
                        justifyContent="space-between"
                        direction="row"
                        gap={2}
                        alignItems="center">
                        <ListSubheader sx={{ paddingBlock: 2, backgroundColor: 'transparent' }}>
                            <Typography
                                component="h2"
                                variant="h5"
                                margin={0}
                                color={(theme) => theme.palette.text.primary}>
                                CorpusLink
                            </Typography>
                        </ListSubheader>
                        <IconButton
                            onClick={onDrawerClose}
                            sx={{ color: 'inherit' }}
                            aria-label="close CorpusLink drawer">
                            <CloseIcon />
                        </IconButton>
                    </Stack>
                    <Divider />
                </FullScreenDrawerHeader>
            )}>
            <FullAttributionContent />
        </FullScreenDrawer>
    );
};
