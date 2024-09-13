import CircleIcon from '@mui/icons-material/Circle';
import LogoutIcon from '@mui/icons-material/LogoutOutlined';
import TripOriginSharp from '@mui/icons-material/TripOriginSharp';
import {
    Box,
    Button,
    Checkbox,
    DialogActions,
    DialogContent,
    DialogTitle,
    FormControlLabel,
    Link,
    Stack,
    Typography,
    useMediaQuery,
    useTheme as useMuiTheme,
} from '@mui/material';
import React, { useCallback, useState } from 'react';
import { Controller, FormContainer, useForm, useFormState } from 'react-hook-form-mui';

import { UserClient } from '@/api/User';
import { links } from '@/Links';

import { StandardModal } from './StandardModal';
import { TermAndConditionsLink } from './TermsAndConditionsLink';

interface TermsAndConditionsSection {
    title: string;
    image: string;
    warning: string;
    contents: React.ReactNode;
    acknowledgement: string;
    submitButtonText: string;
}

export const TermsAndConditionsModal = () => {
    const theme = useMuiTheme();
    const greaterThanMd = useMediaQuery(theme.breakpoints.up('md'));
    const [open, setOpen] = useState<boolean>(true);
    const [activeStep, setActiveStep] = useState<number>(0);
    const formContext = useForm({
        defaultValues: {
            checked: false,
        },
    });
    const { isValid } = useFormState({ control: formContext.control });

    const handleSubmit = useCallback(async () => {
        if (activeStep + 1 === sections.length) {
            const userClient: UserClient = new UserClient();
            await userClient.acceptTermsAndConditions();
            setOpen(false);
        } else {
            setActiveStep(activeStep + 1);
            formContext.reset();
        }
    }, [activeStep, formContext]);

    const handlePrevious = useCallback(() => {
        setActiveStep(Math.max(activeStep - 1, 0));
        formContext.reset();
    }, [activeStep, formContext]);

    const section = sections[activeStep];
    return (
        <>
            <StandardModal open={open}>
                <Stack direction="row" spacing={2} sx={{ display: 'flex' }}>
                    {greaterThanMd && (
                        <Stack sx={{ height: 'auto', justifyContent: 'center' }}>
                            <Box component="img" src={section.image} />
                        </Stack>
                    )}
                    <Stack sx={{ display: 'flex', flexDirection: 'column', flexGrow: 3 }} gap={1}>
                        <DialogTitle
                            id="modal-title"
                            variant="overline"
                            sx={{ p: 0, m: 0, color: (theme) => theme.palette.text.primary }}>
                            Getting Started
                        </DialogTitle>
                        <DialogContent
                            sx={{
                                p: 0,
                                m: 0,
                                display: 'flex',
                                flexDirection: 'column',
                                gap: 2,
                                flex: 1,
                            }}>
                            <Typography
                                id="modal-description"
                                variant="h1"
                                color={(theme) => theme.palette.text.primary}
                                m={0}>
                                {section.title}
                            </Typography>
                            <Typography
                                variant="body1"
                                color={(theme) => theme.palette.primary.dark}
                                sx={{ m: 0, alignItems: 'center', display: 'inline-flex' }}>
                                {section.warning}
                            </Typography>
                            <Typography variant="body1">{section.contents}</Typography>
                        </DialogContent>
                        <DialogActions sx={{ p: 0, justifyContent: 'flex-start' }}>
                            <FormContainer formContext={formContext} onSuccess={handleSubmit}>
                                <FormControlLabel
                                    sx={{ alignItems: 'center', gap: 2 }}
                                    control={
                                        <Controller
                                            rules={{ required: true }}
                                            control={formContext.control}
                                            render={({ field: { onChange, value } }) => (
                                                <Checkbox checked={value} onChange={onChange} />
                                            )}
                                            name="checked"
                                        />
                                    }
                                    label={section.acknowledgement}
                                />
                                <Stack
                                    gap={2}
                                    direction="row"
                                    mt={2}
                                    justifyContent="space-between">
                                    <Stack direction="row" gap={2}>
                                        <Button
                                            fullWidth
                                            variant="outlined"
                                            onClick={handlePrevious}
                                            disabled={activeStep === 0}
                                            sx={{
                                                height: 'fit-content',
                                                width: 'fit-content',
                                                paddingX: 3,
                                                paddingY: 1,
                                                whiteSpace: 'nowrap',
                                            }}>
                                            Prev
                                        </Button>
                                        <Button
                                            variant="contained"
                                            disabled={!isValid}
                                            type="submit"
                                            fullWidth
                                            sx={{
                                                height: 'fit-content',
                                                width: 'fit-content',
                                                paddingX: 3,
                                                paddingY: 1,
                                                whiteSpace: 'nowrap',
                                            }}>
                                            {section.submitButtonText}
                                        </Button>
                                    </Stack>
                                    <Button
                                        component={Link}
                                        href={links.logout}
                                        variant="text"
                                        startIcon={<LogoutIcon />}
                                        underline="none"
                                        sx={{
                                            color: (theme) => theme.palette.text.primary,
                                        }}>
                                        Log out
                                    </Button>
                                </Stack>
                            </FormContainer>
                        </DialogActions>
                    </Stack>
                </Stack>
                <Stack sx={{ display: 'flex', justifyContent: 'center', alignItems: 'center' }}>
                    <ProgressIndicator steps={sections.length} activeStep={activeStep} />
                </Stack>
            </StandardModal>
        </>
    );
};

const ProgressIndicator = ({ steps, activeStep }: { steps: number; activeStep: number }) => {
    return (
        <Stack direction="row" gap={2} mt={3}>
            {[...Array(steps).keys()].map((step, i) => {
                return step <= activeStep ? (
                    <CircleIcon
                        key={i}
                        sx={{ fontSize: 'large', color: (theme) => theme.color.N6.hex }}
                    />
                ) : (
                    <TripOriginSharp // outlined circle icon
                        key={i}
                        sx={{
                            fontSize: 'large',
                            color: (theme) => theme.color.N6.hex,
                        }}
                    />
                );
            })}
        </Stack>
    );
};

const Section1: TermsAndConditionsSection = {
    title: 'Research purposes',
    image: '/Subtract.png',
    warning: 'Please read carefully',
    contents: (
        <>
            OLMo Platform is a research tool designed to allow for interaction with the OLMo model
            and its pipeline. The goal of the platform is to foster exploration, collaboration, and
            greater understanding of how large language models (LLMs) work. By taking a step in this
            direction, we hope to create a more open environment and community for LLM development.
        </>
    ),
    acknowledgement:
        'I understand that my queries and inputs will be used for future research and development.',
    submitButtonText: 'Next',
};

const Section2: TermsAndConditionsSection = {
    title: 'Limitations',
    image: '/Blog Post Images.png',
    warning: 'Please read carefully',
    contents: (
        <>
            Large pretrained language models, such as OLMo, are trained on mostly{' '}
            <TermAndConditionsLink link="https://arxiv.org/abs/2104.08758">
                unfiltered internet data
            </TermAndConditionsLink>
            , and therefore are extremely quick to produce{' '}
            <TermAndConditionsLink link="https://spectrum.ieee.org/open-ais-powerful-text-generating-tool-is-ready-for-business">
                toxic
            </TermAndConditionsLink>
            ,{' '}
            <TermAndConditionsLink link="https://arxiv.org/abs/2009.06807">
                unethical
            </TermAndConditionsLink>
            , and{' '}
            <TermAndConditionsLink link="https://aclanthology.org/D19-1339/">
                harmful
            </TermAndConditionsLink>{' '}
            content, especially about minority groups. We have tried to mitigate this when designing
            OLMo, but it may still contain biases. Thus, some responses from OLMo may contain
            inappropriate or offensive results.
        </>
    ),
    acknowledgement:
        'I understand that OLMo may produce unintended, inappropriate, or offensive results.',
    submitButtonText: 'Next',
};

const Section3: TermsAndConditionsSection = {
    title: 'Privacy and Data Collection',
    image: '/Blog Post Images2.png',
    warning: 'Please read carefully',
    contents: (
        <>
            The OLMo Platform collects user queries and inputs entered into it. You will have 30
            days to delete your queries before they will be stored and used for future research and
            development purposes and may be shared outside of AI2. Please use your discretion and DO
            NOT submit any personal, sensitive, or confidential information in your use of the OLMo
            Platform.
        </>
    ),
    acknowledgement:
        'I understand that my queries and inputs will be used for future research and development.',
    submitButtonText: "Let's Go!",
};

export const sections = [Section1, Section2, Section3];
