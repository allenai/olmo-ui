import CloseIcon from '@mui/icons-material/Close';
import { Box, Divider, IconButton, ListSubheader, Stack, Typography } from '@mui/material';

import { useAppContext } from '@/AppContext';
import { FullScreenDrawer } from '@/components/TemporaryDrawer';
import { ParameterSlider } from '@/components/thread/parameter/inputs/ParameterSlider';
import { DrawerId } from '@/slices/DrawerSlice';

export const PARAMETERS_DRAWER_ID: DrawerId = 'parameters';

const TEMPERATURE_INFO =
    'Temperature controls the degree of randomness. Lower temperatures are suitable for prompts that expect accuracy and reliability, while higher temperatures lead to more diverse or creative results. The model will become repetitive as the temperature approaches zero.';

const TOP_P_INFO =
    'Top-p controls how the model selects tokens for output. It sets a probability threshold and selects tokens from most probable to least until the combined probability reaches this threshold. A lower value is suitable for factual answers while a higher one leads to more diverse output.';

export const ParameterDrawer = (): JSX.Element => {
    return (
        <FullScreenDrawer
            drawerId="parameters"
            fullWidth
            header={({ onDrawerClose }) => (
                <Box
                    sx={{
                        position: 'sticky',
                        top: 0,
                        background: 'inherit',
                        zIndex: 1,
                    }}>
                    <Stack
                        justifyContent="space-between"
                        direction="row"
                        gap={2}
                        alignItems="center">
                        <ListSubheader sx={{ paddingBlock: 2, backgroundColor: 'transparent' }}>
                            <Typography variant="h5" margin={0} color="primary">
                                Parameters
                            </Typography>
                        </ListSubheader>
                        <IconButton
                            onClick={onDrawerClose}
                            sx={{ color: 'inherit' }}
                            aria-label="close parameters drawer">
                            <CloseIcon />
                        </IconButton>
                    </Stack>
                    <Divider />
                </Box>
            )}>
            <ParameterContent />
        </FullScreenDrawer>
    );
};

// Not sure what I should do about these, I just wanted to avoid repetition -- but they are mildly specific
const SubGridList = ({ children }: React.PropsWithChildren) => (
    <Box
        component="ul"
        margin="0"
        padding="0"
        display="grid"
        gridTemplateColumns="auto min-content">
        {children}
    </Box>
);
const SubGridListItem = ({ children }: React.PropsWithChildren) => (
    <Box component="li" display="grid" gridTemplateColumns="subgrid" gridColumn="1 / -1">
        {children}
    </Box>
);

export const ParameterContent = () => {
    const updateInferenceOpts = useAppContext((state) => state.updateInferenceOpts);

    const schemaData = useAppContext((state) => state.schema);

    if (schemaData == null) {
        return null;
    }

    const opts = schemaData.Message.InferenceOpts;

    return (
        <Stack>
            <SubGridList>
                <SubGridListItem>
                    <ParameterSlider
                        label="Temperature"
                        min={opts.temperature.min}
                        max={opts.temperature.max}
                        step={opts.temperature.step}
                        initialValue={opts.temperature.default}
                        onChange={(v) => {
                            updateInferenceOpts({ temperature: v });
                        }}
                        dialogContent={TEMPERATURE_INFO}
                        dialogTitle="Temperature"
                        id="temperature"
                    />
                </SubGridListItem>
                <SubGridListItem>
                    <ParameterSlider
                        label="Top P"
                        min={opts.top_p.min}
                        max={opts.top_p.max}
                        step={opts.top_p.step}
                        initialValue={opts.top_p.default}
                        onChange={(v) => {
                            updateInferenceOpts({ top_p: v });
                        }}
                        dialogContent={TOP_P_INFO}
                        dialogTitle="Top P"
                        id="top-p"
                    />
                </SubGridListItem>
            </SubGridList>
        </Stack>
    );
};
