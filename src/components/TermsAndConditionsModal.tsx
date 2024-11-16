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
                            color={(theme) => theme.palette.primary.dark}
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
                Large pretrained language models, such as OLMo and Tulu, are trained on{' '}
                <TermAndConditionsLink link="https://arxiv.org/abs/2104.08758">
                    data scrapped from the internet
                </TermAndConditionsLink>
                , including potentially{' '}
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
                language, and therefore are quick to output similar content. Ai2 uses several
                strategies to mitigate these behaviors for the benefit of the general public, but
                model outputs in the Ai2 Playground will still contain biases, toxic content, or
                harmful language. These undesirable results have a legitimate research purpose,
                however, especially for researchers investigating the sources of bias, toxicity, and
                harmful language generated by LLMs.
            </p>
        </>
    ),
    acknowledgement:
        'I understand that models in the Ai2 Playground, including OLMo, may produce unintended, inappropriate, or offensive results.',
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
                The Ai2 Playground is intended for research and educational purposes in accordance
                with our{' '}
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
                . You will have 30 days to delete your queries. After that, they will be stored and
                used for future research and educational purposes in the public interest, consistent
                with Ai2’s mission as a 501(c)(3) nonprofit organization. All retained prompt
                history and user interaction data shared with the Ai2 Playground may be shared
                outside of Ai2, as permitted by applicable law and Ai2’s policies. Please use your
                discretion and best judgment when accessing and using the Ai2 Playground.{' '}
                <Typography sx={{ fontWeight: 'bold' }}>NEVER</Typography>
                submit any personal, sensitive, or confidential information in your use of the Ai2
                Playground.
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
