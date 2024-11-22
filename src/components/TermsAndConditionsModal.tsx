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

import { analyticsClient } from '@/analytics/AnalyticsClient';
import { useAppContext } from '@/AppContext';
import { links } from '@/Links';

import { StandardModal } from './StandardModal';
import { TermAndConditionsLink } from './TermsAndConditionsLink';

interface TermsAndConditionsSection {
    title: string;
    image: string;
    contents: React.ReactNode;
    acknowledgement: React.ReactNode;
    submitButtonText: string;
}

export const TermsAndConditionsModal = () => {
    const theme = useMuiTheme();
    const greaterThanLg = useMediaQuery(theme.breakpoints.up('lg'));
    const [open, setOpen] = useState<boolean>(true);
    const [activeStep, setActiveStep] = useState<number>(0);
    const formContext = useForm({
        defaultValues: {
            checked: false,
        },
    });
    const { isValid } = useFormState({ control: formContext.control });
    const acceptTermsAndConditions = useAppContext((state) => state.acceptTermsAndConditions);

    const handleSubmit = useCallback(async () => {
        if (activeStep + 1 === sections.length) {
            await acceptTermsAndConditions();
            setOpen(false);
        } else {
            setActiveStep(activeStep + 1);
            formContext.reset();
        }
    }, [activeStep, formContext, acceptTermsAndConditions]);

    const handlePrevious = useCallback(() => {
        setActiveStep(Math.max(activeStep - 1, 0));
        formContext.reset();
    }, [activeStep, formContext]);

    const section = sections[activeStep];
    return (
        <StandardModal open={open}>
            <Stack
                direction="row"
                spacing={2.5}
                sx={{
                    display: 'flex',
                    maxHeight: '520px',
                }}>
                {greaterThanLg && (
                    <Box
                        component="img"
                        src={section.image}
                        sx={{ width: '380px', maxHeight: '100%' }}
                    />
                )}
                <Stack
                    sx={{
                        display: 'flex',
                        flexDirection: 'column',
                        flex: 1,
                    }}
                    gap={1}>
                    <DialogTitle component="div" id="modal-title" sx={{ p: 0, m: 0 }}>
                        <Typography
                            variant="overline"
                            color={(theme) => theme.palette.text.primary}>
                            Getting Started
                        </Typography>
                        <Typography
                            id="modal-description"
                            variant="h1"
                            color={(theme) => theme.palette.text.primary}
                            mt={1}>
                            {section.title}
                        </Typography>
                        <Typography
                            variant="body1"
                            color={(theme) => theme.palette.text.drawer.secondary}
                            sx={{ mt: 1.5, alignItems: 'center', display: 'inline-flex' }}>
                            Please read carefully
                        </Typography>
                    </DialogTitle>
                    <DialogContent sx={{ p: 0, m: 0 }}>
                        <Typography component="div" variant="body1">
                            {section.contents}
                        </Typography>
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
                                            <Checkbox
                                                checked={value}
                                                onChange={onChange}
                                                sx={{
                                                    '&.Mui-checked': {
                                                        color: (theme) =>
                                                            theme.palette.primary.contrastText,
                                                    },
                                                }}
                                            />
                                        )}
                                        name="checked"
                                    />
                                }
                                label={section.acknowledgement}
                            />
                            <Stack gap={2} direction="row" mt={2} justifyContent="space-between">
                                <Stack direction="row" gap={2}>
                                    <Button
                                        fullWidth
                                        variant="outlined"
                                        onClick={handlePrevious}
                                        disabled={activeStep === 0}
                                        sx={{
                                            height: 'fit-content',
                                            width: 'fit-content',
                                            whiteSpace: 'nowrap',
                                            color: 'inherit',
                                            borderColor: (theme) =>
                                                theme.palette.primary.contrastText,
                                            '&:hover': {
                                                backgroundColor: theme.palette.action.hover,
                                                borderColor: (theme) =>
                                                    theme.palette.primary.contrastText,
                                            },
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
                                            whiteSpace: 'nowrap',
                                            backgroundColor: (theme) => theme.palette.text.primary,
                                            color: 'text.reversed',
                                            '&:hover': {
                                                backgroundColor: theme.palette.text.primary,
                                            },
                                            ':focus-visible': {
                                                outlineStyle: 'solid',
                                                outlineWidth: 2,
                                            },
                                        }}>
                                        {section.submitButtonText}
                                    </Button>
                                </Stack>
                                <Button
                                    component={Link}
                                    href={links.logout}
                                    onClick={() => {
                                        analyticsClient.trackTermsLogOut();
                                    }}
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
                    <Stack
                        sx={
                            greaterThanLg
                                ? { marginTop: 1 }
                                : {
                                      display: 'flex',
                                      justifyContent: 'center',
                                      alignItems: 'center',
                                  }
                        }>
                        <ProgressIndicator steps={sections.length} activeStep={activeStep} />
                    </Stack>
                </Stack>
            </Stack>
        </StandardModal>
    );
};

const ProgressIndicator = ({ steps, activeStep }: { steps: number; activeStep: number }) => {
    return (
        <Stack direction="row" gap={2} mt={1}>
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
    title: 'Limitations',
    image: '/getting-started-section-1.png',
    contents: (
        <>
            <p>
                Large pretrained language models are trained on data scraped from the internet,
                including potentially toxic, unethical, and harmful language. Ai2 uses several
                strategies to mitigate these behaviors, but model outputs may contain unwelcome or
                offensive language and inaccurate results. Never use Playground as a provider of
                critical information or professional advice (e.g. legal, medical, financial or
                similar advice).
            </p>
        </>
    ),
    acknowledgement:
        'I understand that models in the Ai2 Playground, including OLMo, may output unintended, inaccurate, or offensive results.',
    submitButtonText: 'Next',
};

const Section2: TermsAndConditionsSection = {
    title: 'Privacy and Data Collection',
    image: '/getting-started-section-2.png',
    contents: (
        <>
            <p
                style={{
                    fontVariantLigatures: 'none', // This avoids font-family to replace '(c)' with a copyright mark
                }}>
                The Ai2 Playground is designed for scientific research and educational use and
                offered to the general public at no cost pursuant to Ai2&apos;s mission as a
                501(c)(3) nonprofit organization , By using Playground, you agree to our Terms of
                Use, Responsible Use Guidelines, and Privacy Policy. Your prompt history and user
                data may be disclosed outside Ai2, to the extent permitted by applicable laws.
                Exercise discretion and never submit personal, sensitive, or confidential
                information on the Ai2 Playground.
            </p>
        </>
    ),
    acknowledgement: (
        <>
            I agree to Ai2’s{' '}
            <TermAndConditionsLink link="https://allenai.org/terms">
                Terms of Use
            </TermAndConditionsLink>
            ,{' '}
            <TermAndConditionsLink link="https://allenai.org/responsible-use">
                Responsible Use Guidelines
            </TermAndConditionsLink>
            , and{' '}
            <TermAndConditionsLink link="https://allenai.org/privacy-policy">
                Privacy Policy
            </TermAndConditionsLink>
            .
        </>
    ),
    submitButtonText: "Let's Go!",
};

export const sections = [Section1, Section2];
