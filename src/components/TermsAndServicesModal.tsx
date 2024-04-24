import React, { useCallback, useState } from 'react';
import {
    Button,
    Checkbox,
    DialogTitle,
    Typography,
    FormControlLabel,
    Stack,
    styled,
    DialogContent,
    DialogActions,
} from '@mui/material';
import CircleIcon from '@mui/icons-material/Circle';
import TripOriginSharp from '@mui/icons-material/TripOriginSharp';
import PrivacyTipOutlinedIcon from '@mui/icons-material/PrivacyTipOutlined';
import DangerousOutlinedIcon from '@mui/icons-material/DangerousOutlined';
import ScienceOutlinedIcon from '@mui/icons-material/ScienceOutlined';
import { Controller, FormContainer, useForm, useFormState } from 'react-hook-form-mui';
import { Link } from 'react-router-dom';

import { StandardModal } from './StandardModal';

interface TermsAndServiceSection {
    title: string;
    icon: React.ReactNode;
    contents: React.ReactNode;
    acknowledgement: string;
    submitButtonText: string;
}

export const TermsAndServiceModal = () => {
    const [open, setOpen] = useState<boolean>(true);
    const [activeStep, setActiveStep] = useState<number>(0);
    const formContext = useForm({
        defaultValues: {
            checked: false,
        },
    });
    const { isValid } = useFormState({ control: formContext.control });

    const handleSubmit = useCallback(() => {
        if (activeStep + 1 === sections.length) {
            setOpen(false); // close modal
            /// TODO: Add POST request here
            // https://github.com/allenai/olmo-ui/issues/327
            return;
        }
        setActiveStep(activeStep + 1);
        formContext.reset();
    }, [activeStep]);

    const handlePrevious = useCallback(() => {
        setActiveStep(Math.max(activeStep - 1, 0));
        formContext.reset();
    }, [activeStep]);

    const section = sections[activeStep];
    return (
        <StandardModal open={open}>
            <Stack gap={2}>
                <DialogTitle id="modal-title" variant="h1" sx={{ p: 0, m: 0 }}>
                    Getting Started
                </DialogTitle>
                <DialogContent
                    sx={{ p: 0, m: 0, display: 'flex', flexDirection: 'column', gap: 2 }}>
                    <Typography
                        id="modal-description"
                        variant="h4"
                        color={(theme) => theme.palette.primary.main}
                        m={0}>
                        Please read carefully.
                    </Typography>
                    <Typography
                        variant="h3"
                        color={(theme) => theme.color.N9.hex}
                        sx={{ m: 0, alignItems: 'center', display: 'inline-flex' }}>
                        {section.icon}
                        {section.title}
                    </Typography>
                    <Typography variant="body1">{section.contents}</Typography>
                </DialogContent>
                <DialogActions sx={{ p: 0, justifyContent: 'flex-start' }}>
                    <FormContainer formContext={formContext} onSuccess={handleSubmit}>
                        <FormControlLabel
                            sx={{ alignItems: 'flex-start', gap: 2 }}
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
                        <Stack gap={2} direction="row" mt={2}>
                            {activeStep > 0 && (
                                <Button
                                    variant="outlined"
                                    fullWidth
                                    onClick={handlePrevious}
                                    sx={{
                                        height: 'fit-content',
                                        width: 'fit-content',
                                        paddingX: 3,
                                        paddingY: 1,
                                        whiteSpace: 'nowrap',
                                    }}>
                                    Previous
                                </Button>
                            )}
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
                    </FormContainer>
                </DialogActions>
                <ProgressIndicator steps={sections.length} activeStep={activeStep} />
            </Stack>
        </StandardModal>
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

const GrayLink = styled(Link)`
    color: inherit;
    text-decoration: underline;
`;

const Section1: TermsAndServiceSection = {
    title: 'Research Purposes',
    icon: <ScienceOutlinedIcon fontSize="large" sx={{ mr: 2 }} />,
    contents: (
        <>
            OLMo Platform is a research tool designed to allow for interaction with the OLMo model
            and its pipeline. The goal of the platform is to foster exploration, collaboration, and
            greater understanding of how large language models (LLMs) work. By taking a step in this
            direction, we hope to create a more open environment and community for LLM development.
        </>
    ),
    acknowledgement:
        'I understand the OLMo Platform is a research tool for the ongoing research and development of AI systems',
    submitButtonText: 'Next',
};

const Section2: TermsAndServiceSection = {
    title: 'Limitations',
    icon: <DangerousOutlinedIcon fontSize="large" sx={{ mr: 2 }} />,
    contents: (
        <>
            Large pretrained language models, such as OLMo, are trained on mostly{' '}
            <GrayLink to="https://arxiv.org/abs/2104.08758">unfiltered internet data</GrayLink>, and
            therefore are extremely quick to produce{' '}
            <GrayLink to="https://spectrum.ieee.org/open-ais-powerful-text-generating-tool-is-ready-for-business">
                toxic
            </GrayLink>
            , <GrayLink to="https://arxiv.org/abs/2009.06807">unethical</GrayLink>, and
            <GrayLink to="https://aclanthology.org/D19-1339/"> harmful</GrayLink> content,
            especially about minority groups. We have tried to mitigate this when designing OLMo,
            but it may still contain biases. Thus, some responses from OLMo may contain
            inappropriate or offensive results.
        </>
    ),
    acknowledgement:
        'I understand that OLMo may produce unintended, inappropriate, or offensive results.',
    submitButtonText: 'Next',
};

const Section3: TermsAndServiceSection = {
    title: 'Privacy and Data Collection',
    icon: <PrivacyTipOutlinedIcon fontSize="large" sx={{ mr: 2 }} />,
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
        'I understand that OLMo may produce unintended, inappropriate, or offensive results.',
    submitButtonText: "Let's Go!",
};

const sections = [Section1, Section2, Section3];
