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
import { SMALL_LAYOUT_BREAKPOINT } from '@/constants';
import { links } from '@/Links';

import { StandardModal } from './StandardModal';
import { TermAndConditionsLink } from './TermsAndConditionsLink';

interface TermsAndConditionsSection {
    title: string;
    image: string;
    notice: string;
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
                sx={(theme) => ({
                    display: 'flex',
                    [theme.breakpoints.up(SMALL_LAYOUT_BREAKPOINT)]: {
                        maxHeight: '520px',
                    },
                })}>
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
                            {section.notice}
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
                                sx={{ alignItems: 'center' }}
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
    notice: 'Things to remember before getting started',
    contents: (
        <>
            <p
                style={{
                    fontVariantLigatures: 'none', // This avoids font-family to replace '(c)' with a copyright mark
                }}>
                As a 501(c)(3) nonprofit organization, Ai2 offers the Ai2 Playground at no cost to
                educate the general public and advance scientific research in AI. Models served in
                the Ai2 Playground generate inaccurate or misleading information, or produce
                offensive or unwelcome outputs.
                <br />
                <br />
                Neither the Playground nor any models provided by Ai2 are intended to give advice.
                Never use Playground as a provider of critical information or for legal, medical,
                financial, or other professional advice. Always validate model outputs with your own
                independent research.
            </p>
        </>
    ),
    acknowledgement: 'Acknowledge',
    submitButtonText: 'Next',
};

const Section2: TermsAndConditionsSection = {
    title: 'Notice & Consent',
    image: '/getting-started-section-2.png',
    notice: 'Please read our terms carefully',
    contents: (
        <>
            <p>
                By selecting “Accept” below, you agree to our{' '}
                <TermAndConditionsLink link="https://allenai.org/terms">
                    Terms of Use
                </TermAndConditionsLink>{' '}
                and{' '}
                <TermAndConditionsLink link="https://allenai.org/responsible-use">
                    Responsible Use Guidelines
                </TermAndConditionsLink>
                . To the extent permitted by applicable laws, your interactions with Playground and
                logs of your activity may be collected by Ai2 and shared in accordance with our{' '}
                <TermAndConditionsLink link="https://allenai.org/privacy-policy">
                    Privacy Policy
                </TermAndConditionsLink>
                . Always exercise discretion and never submit personal, sensitive, or confidential
                information on the Playground.
                <br />
                <br />
                If you do not wish to agree to these terms, feel free to exit this page.
            </p>
        </>
    ),
    acknowledgement: 'Accept',
    submitButtonText: "Let's Go!",
};

export const sections = [Section1, Section2];
