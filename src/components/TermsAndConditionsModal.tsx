import CircleIcon from '@mui/icons-material/Circle';
import TripOriginSharp from '@mui/icons-material/TripOriginSharp';
import {
    Box,
    Button,
    Checkbox,
    DialogActions,
    DialogContent,
    DialogTitle,
    FormControlLabel,
    Radio,
    RadioGroup,
    Stack,
    Typography,
    useMediaQuery,
    useTheme as useMuiTheme,
} from '@mui/material';
import React, { useCallback, useEffect, useMemo, useState } from 'react';
import { Controller, FormContainer, useForm, useFormState } from 'react-hook-form-mui';

import { useAppContext } from '@/AppContext';
import { SMALL_LAYOUT_BREAKPOINT } from '@/constants';
import { links } from '@/Links';

import { StandardModal } from './StandardModal';
import { TermAndConditionsLink } from './TermsAndConditionsLink';
import { useTermsAndConditionsContext } from './TermsAndConditionsModalContext';

export type SectionTitle = 'Limitations' | 'Notice & Consent' | 'Terms of Use' | 'Data Consent';

export type OptionValues = 'opt-in' | 'opt-out';

export interface TermsAndConditionsSection {
    eyebrow?: string;
    title: SectionTitle;
    image: string;
    notice?: string;
    contents: string | React.ReactNode;
    acknowledgements: (string | React.ReactNode)[];
    optionGroups: {
        label?: string | React.ReactNode;
        options: { label: React.ReactNode; value: string }[];
    }[];
    endNote?: string | React.ReactNode;
    submitButtonText: string;
}
interface FormValues {
    acknowledgements: boolean[];
    optionGroups: {
        selectedOption?: OptionValues;
    }[];
}

export interface TermsAndConditionsModalProps {
    onClose?: () => void;
    initialTermsAndConditionsValue?: boolean;
    initialDataCollectionValue?: OptionValues;
}

export const TermsAndConditionsModal = ({
    onClose,
    initialTermsAndConditionsValue = false,
    initialDataCollectionValue = undefined,
}: TermsAndConditionsModalProps) => {
    const theme = useMuiTheme();
    const greaterThanLg = useMediaQuery(theme.breakpoints.up('lg'));
    const [open, setOpen] = useState<boolean>(true);

    const sections = !initialTermsAndConditionsValue ? AllSections : [DataConsentSection];

    const updateTermsAndConditions = useAppContext((state) => state.updateTermsAndConditions);
    const updateDataCollection = useAppContext((state) => state.updateDataCollection);

    const {
        step: activeStep,
        setStep,
        responses: formResponses,
        updateStepData,
        reset,
    } = useTermsAndConditionsContext();

    const section = sections[activeStep];

    const defaultValues: FormValues = useMemo(() => {
        return (
            formResponses[section.title] ?? {
                acknowledgements: section.acknowledgements.map(
                    () => initialTermsAndConditionsValue
                ),
                optionGroups: section.optionGroups.map(() => ({
                    selectedOption: initialDataCollectionValue,
                })),
            }
        );
    }, [
        formResponses,
        initialDataCollectionValue,
        initialTermsAndConditionsValue,
        section.acknowledgements,
        section.optionGroups,
        section.title,
    ]);

    const formContext = useForm({ defaultValues });

    useEffect(() => {
        formContext.reset(defaultValues);
        // eslint-disable-next-line react-hooks/exhaustive-deps
    }, [activeStep]);

    const { isValid } = useFormState({
        control: formContext.control,
        name: ['acknowledgements', 'optionGroups'],
    });

    const handleSubmit = useCallback(
        async (formValues: FormValues) => {
            updateStepData(section.title, formValues);

            const isFinalStep = activeStep + 1 === sections.length;
            if (isFinalStep) {
                // stage the updated responses since context update is async
                const stagedResponses = {
                    ...formResponses,
                    [section.title]: formValues,
                };
                const dataCollectionOpt =
                    stagedResponses['Data Consent'].optionGroups[0]?.selectedOption ?? '';

                const hasTermsSection = sections.some((s) => s.title === 'Terms of Use');

                if (hasTermsSection) {
                    const termsAccepted =
                        stagedResponses['Terms of Use'].acknowledgements.every(Boolean) ?? false;

                    if (termsAccepted !== initialTermsAndConditionsValue) {
                        await updateTermsAndConditions(termsAccepted);
                    }
                }

                if (dataCollectionOpt !== initialDataCollectionValue) {
                    await updateDataCollection(dataCollectionOpt === 'opt-in');
                }

                onClose?.();
                setOpen(false);
                reset();
            } else {
                setStep(activeStep + 1);
            }
        },
        [activeStep, formResponses]
    );

    const handlePrevious = useCallback(() => {
        setStep(Math.max(activeStep - 1, 0));
    }, [activeStep, setStep]);

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
                        {section.eyebrow ? (
                            <Typography
                                variant="overline"
                                color={(theme) => theme.palette.text.primary}>
                                {section.eyebrow}
                            </Typography>
                        ) : null}
                        <Typography
                            id="modal-description"
                            variant="h1"
                            color={(theme) => theme.palette.text.primary}
                            mt={1}>
                            {section.title}
                        </Typography>
                        {section.notice ? (
                            <Typography
                                variant="body1"
                                color={(theme) => theme.palette.text.drawer.secondary}
                                sx={{ mt: 1.5, alignItems: 'center', display: 'inline-flex' }}>
                                {section.notice}
                            </Typography>
                        ) : null}
                    </DialogTitle>
                    <DialogContent sx={{ p: 0, m: 0, flex: '0 1 auto' }}>
                        <Typography component="div" variant="body1">
                            {section.contents}
                        </Typography>
                    </DialogContent>
                    <DialogActions
                        sx={{
                            p: 0,
                            justifyContent: 'flex-start',
                            '&>form': {
                                flex: 1,
                            },
                        }}>
                        <FormContainer
                            formContext={formContext}
                            onSuccess={(data) => handleSubmit(data)}>
                            <Stack direction="column">
                                {section.acknowledgements.map((acknowledgement, index) => (
                                    <FormControlLabel
                                        key={index}
                                        sx={{ alignItems: 'center' }}
                                        control={
                                            <Controller
                                                rules={{ required: true }}
                                                control={formContext.control}
                                                render={({ field: { onChange, value } }) => (
                                                    <Checkbox
                                                        checked={!!value}
                                                        onChange={onChange}
                                                        sx={{
                                                            '&.Mui-checked': {
                                                                color: (theme) =>
                                                                    theme.palette.primary
                                                                        .contrastText,
                                                            },
                                                        }}
                                                    />
                                                )}
                                                name={`acknowledgements.${index}`}
                                            />
                                        }
                                        label={acknowledgement}
                                    />
                                ))}
                                {section.optionGroups.map((optionGroup, index) => (
                                    <FormControlLabel
                                        key={index}
                                        sx={{
                                            flexDirection: 'column-reverse',
                                            alignItems: 'start',
                                            ml: '2px',
                                        }}
                                        control={
                                            <Controller
                                                name={`optionGroups.${index}.selectedOption`}
                                                control={formContext.control}
                                                rules={{ required: true }}
                                                render={({ field }) => {
                                                    return (
                                                        <RadioGroup
                                                            value={field.value || ''}
                                                            onChange={field.onChange}>
                                                            {optionGroup.options.map(
                                                                (option, innerIndex) => (
                                                                    <FormControlLabel
                                                                        key={innerIndex}
                                                                        value={option.value}
                                                                        control={
                                                                            <Radio
                                                                                sx={{
                                                                                    '&.Mui-checked':
                                                                                        {
                                                                                            color: (
                                                                                                theme
                                                                                            ) =>
                                                                                                theme
                                                                                                    .palette
                                                                                                    .primary
                                                                                                    .contrastText,
                                                                                        },
                                                                                }}
                                                                            />
                                                                        }
                                                                        label={option.label}
                                                                        sx={{
                                                                            alignItems: 'center',
                                                                        }}
                                                                    />
                                                                )
                                                            )}
                                                        </RadioGroup>
                                                    );
                                                }}
                                            />
                                        }
                                        label={optionGroup.label}
                                    />
                                ))}
                                {section.endNote ? (
                                    <Typography
                                        variant="body1"
                                        sx={{
                                            mt: 1.5,
                                            alignItems: 'center',
                                            display: 'inline-flex',
                                        }}>
                                        {section.endNote}
                                    </Typography>
                                ) : null}
                            </Stack>
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
                        {sections.length > 1 ? (
                            <ProgressIndicator steps={sections.length} activeStep={activeStep} />
                        ) : null}
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

const LimitationsSection: TermsAndConditionsSection = {
    eyebrow: 'Getting Started',
    title: 'Limitations',
    image: '/getting-started-section-1.png',
    contents: (
        <Stack gap={2}>
            <Typography
                variant="body1"
                sx={{
                    fontVariantLigatures: 'none', // This avoids font-family to replace '(c)' with a copyright mark
                }}>
                As a nonprofit 501(c)(3) organization, Ai2 offers the Ai2 Playground at no cost to
                educate the general public and advance scientific research in AI.
            </Typography>
            <Typography variant="body1">
                Models served in the Playground may generate inaccurate or misleading information,
                or produce offensive or unwelcome outputs.
            </Typography>
            <Typography variant="body1">
                Never use the Playground as a provider of critical information or for legal,
                medical, financial, or other professional advice. Always fact-check model results.
            </Typography>
        </Stack>
    ),
    acknowledgements: ['Acknowledge'],
    optionGroups: [],
    submitButtonText: 'Next',
};

const TermsSection: TermsAndConditionsSection = {
    eyebrow: 'Getting Started',
    title: 'Terms of Use',
    image: '/getting-started-section-2.png',
    contents: (
        <>
            <Typography variant="body1">
                To use the Playground, you agree to the following:
            </Typography>
        </>
    ),
    acknowledgements: [
        <Typography variant="body1" key="privacy-policy">
            You have read{' '}
            <TermAndConditionsLink link={links.privacyPolicy}>
                Ai2&apos;s Privacy Policy
            </TermAndConditionsLink>{' '}
            and agree that Ai2 may use your inputs for model training
        </Typography>,
        <Typography variant="body1" key="terms-of-use">
            You accept{' '}
            <TermAndConditionsLink link={links.terms}>
                Ai2&apos;s Terms of Use
            </TermAndConditionsLink>
        </Typography>,
        <Typography variant="body1" key="responsible-use-guidelines">
            You accept{' '}
            <TermAndConditionsLink link={links.responsibleUseGuidelines}>
                Ai2&apos;s Responsible Use Guidelines
            </TermAndConditionsLink>
        </Typography>,
        <Typography variant="body1" key="personal-information">
            You agree not to submit any personal information, intellectual property or trade
            secrets, or sensitive and confidential information to the Playground.
        </Typography>,
    ],
    optionGroups: [],
    endNote: 'If you do not wish to agree to these terms, exit this page.',
    submitButtonText: 'Next',
};

const DataConsentSection: TermsAndConditionsSection = {
    title: 'Data Consent',
    image: '/getting-started-section-1.png',
    contents: (
        <>
            <Typography variant="body1">
                Help us with the future of scientific research by contributing to public datasets
                based on user interactions with the Playground.
            </Typography>
            <Typography variant="body1">
                If you opt-in, Ai2 may curate and publish de-identified data about your interactions
                with the Playground to help researchers understand how AI models are used by the
                general public.
            </Typography>
            <Typography variant="body1">
                You are not required to contribute to public datasets and you can still use the
                Playground if you opt-out.
            </Typography>
        </>
    ),
    acknowledgements: [],
    optionGroups: [
        {
            options: [
                {
                    label: "Yes, I'll help! I OPT-IN to publication of de-identified data about my interactions with the Playground.",
                    value: 'opt-in',
                },
                { label: 'No thanks — I OPT-OUT of dataset publication.', value: 'opt-out' },
            ],
        },
    ],
    endNote: (
        <span>
            <Typography variant="body1">
                You can change your publication election at any time in the Playground&apos;s
                Privacy Settings menu. You may request{' '}
                <TermAndConditionsLink link="https://docs.google.com/forms/d/e/1FAIpQLSfJtodWsoT_3wo3UBSXNZIaq4ItQGD-0CxyNJpERG84N1PsgA/viewform">
                    Personal Data Removal
                </TermAndConditionsLink>{' '}
                at any time.
            </Typography>
        </span>
    ),
    submitButtonText: "Let's Go!",
};

export const AllSections = [LimitationsSection, TermsSection, DataConsentSection];
