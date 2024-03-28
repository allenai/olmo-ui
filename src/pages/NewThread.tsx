import { Button, Card, CardContent, Stack, Typography, alpha } from '@mui/material';

import { FormContainer, TextFieldElement } from 'react-hook-form-mui';

import PlusIcon from '@mui/icons-material/Add';
import HistoryIcon from '@mui/icons-material/History';
import GearIcon from '@mui/icons-material/Settings';

export const NewThreadPage = () => {
    return (
        <Stack gap={4}>
            <Card
                variant="outlined"
                component={Stack}
                direction="row"
                gap={2}
                padding={2}
                sx={{
                    borderColor: (theme) => alpha(theme.palette.primary.main, 0.5),
                }}>
                <Typography
                    variant="h5"
                    component="h2"
                    m={0}
                    marginInlineEnd="auto"
                    color={(theme) => theme.palette.primary.main}>
                    Thread
                </Typography>
                <Button variant="outlined" startIcon={<PlusIcon />}>
                    New Thread
                </Button>
                <Button variant="outlined" startIcon={<GearIcon />}>
                    Parameters
                </Button>
                <Button variant="outlined" startIcon={<HistoryIcon />}>
                    History
                </Button>
            </Card>

            <Card raised elevation={1}>
                <CardContent>
                    <FormContainer>
                        <Stack gap={1} alignItems="flex-start">
                            <TextFieldElement
                                name="content"
                                label="Prompt"
                                placeholder="Enter your prompt here"
                                InputLabelProps={{
                                    shrink: true,
                                }}
                                fullWidth
                                multiline
                            />
                            <Button type="submit" variant="contained">
                                Submit
                            </Button>
                        </Stack>
                    </FormContainer>
                </CardContent>
            </Card>
        </Stack>
    );
};
