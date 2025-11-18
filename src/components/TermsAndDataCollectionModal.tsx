import { css } from '@allenai/varnish-panda-runtime/css';
import { Button, Checkbox } from '@allenai/varnish-ui';
import { Dialog, DialogActions, DialogContent, DialogTitle } from '@mui/material';
import { useState } from 'react';
import { Controller, useForm } from 'react-hook-form';

import { useAppContext } from '@/AppContext';
import { links } from '@/Links';

import { TermAndConditionsLink } from './TermsAndConditionsLink';
import { FadeOverflowContent } from './widgets/FadeOverflowContent';

type FormValues = {
    termsAccepted: boolean;
    dataCollectionAccepted: boolean;
};

interface TermsAndDataCollectionModalProps {
    onClose?: () => void;
    initialTermsAndConditionsValue?: boolean;
    initialDataCollectionValue?: boolean;
}

export const TermsAndDataCollectionModal = ({
    onClose,
    initialTermsAndConditionsValue,
    initialDataCollectionValue,
}: TermsAndDataCollectionModalProps) => {
    const [isOpen, setIsOpen] = useState<boolean>(true);

    const updateTermsAndOrConsent = useAppContext(
        (state) => state.updateUserTermsAndDataCollection
    );

    const formContext = useForm<FormValues>({
        defaultValues: {
            dataCollectionAccepted: initialDataCollectionValue,
        },
    });

    const handleSubmit = async (formValues: FormValues) => {
        if (!formContext.formState.isValid) return;
        const payload = {
            hasAcceptedTermsAndConditions:
                formValues.termsAccepted !== initialTermsAndConditionsValue ? true : undefined,
            hasAcceptedDataCollection:
                !formValues.dataCollectionAccepted !== initialDataCollectionValue
                    ? formValues.dataCollectionAccepted
                    : undefined,
        };

        await updateTermsAndOrConsent(payload);
        onClose?.();
        setIsOpen(false);
        formContext.reset();
    };

    const handleClose = () => {
        onClose?.();
        setIsOpen(false);
        formContext.reset();
    };

    const formId = 'terms-and-conditions-form';

    return (
        <Dialog
            open={isOpen}
            PaperProps={{
                sx: {
                    display: 'flex',
                    background: 'transparent',
                    maxWidth: '970px',
                    minWidth: '300px',
                    overflow: 'hidden',
                    backgroundImage: 'none',
                    padding: {
                        xs: 1.5,
                        md: 4,
                    },
                    margin: 0,
                    maxHeight: '100%',
                },
            }}>
            <div className={containerClass}>
                <img
                    className={imgClass}
                    src="/getting-started-section-1.png"
                    alt="Terms and Conditions"
                />
                <div className={modalContainer}>
                    <DialogTitle
                        sx={(theme) => ({
                            backgroundColor: 'transparent',
                            display: 'grid',
                            gridTemplateRows: 'auto 1fr',
                            gap: 2,
                            fontSize: {
                                // eslint-disable-next-line @typescript-eslint/no-deprecated
                                xs: theme.font.size['2xl'],
                                // eslint-disable-next-line @typescript-eslint/no-deprecated
                                md: theme.font.size['4xl'],
                            },
                            lineHeight: '[1.2em]',
                            padding: {
                                xs: 2,
                                md: 0,
                            },
                            paddingBlockEnd: 1,
                        })}>
                        <img
                            src="/playground-logo.svg"
                            alt="Return to the Playground home page"
                            fetchPriority="high"
                            className={playgroundLogoClassName}
                        />
                        Terms of Use & Data Consent
                    </DialogTitle>
                    <FadeOverflowContent>
                        <DialogContent
                            sx={{
                                display: 'flex',
                                flexDirection: 'column',
                                gap: 2,
                                paddingInline: {
                                    xs: 2,
                                    md: 0,
                                },
                                // The combo of this start padding + the title margin made it look like there was too much space between them
                                paddingBlockStart: 0,
                            }}>
                            <p>
                                By using Playground, you agree:
                                <ul className={termsAndConditionsListClass}>
                                    <li>
                                        to Ai2&apos;s full{' '}
                                        <TermAndConditionsLink link={links.terms}>
                                            Terms of Use
                                        </TermAndConditionsLink>{' '}
                                        and{' '}
                                        <TermAndConditionsLink
                                            link={links.responsibleUseGuidelines}>
                                            Responsible Use Guidelines
                                        </TermAndConditionsLink>{' '}
                                        and acknowledge Ai2&apos;s{' '}
                                        <TermAndConditionsLink link={links.privacyPolicy}>
                                            Privacy Policy
                                        </TermAndConditionsLink>
                                    </li>
                                    <li>
                                        not to{' '}
                                        <strong>
                                            submit any personal, sensitive, proprietary, or
                                            confidential information
                                        </strong>
                                    </li>
                                    <li>
                                        Ai2 may use your conversations to train or evaluate AI
                                        systems.
                                    </li>
                                </ul>
                            </p>
                            <p>
                                <u>Optional Consent</u>: If you choose, you may also contribute your
                                Playground conversations to a public dataset curated by Ai2 for
                                scientific research.
                            </p>
                            <form id={formId} onSubmit={formContext.handleSubmit(handleSubmit)}>
                                <Controller
                                    name="dataCollectionAccepted"
                                    control={formContext.control}
                                    render={({ field: { onChange, value } }) => (
                                        <Checkbox
                                            className={checkboxClass}
                                            color="default"
                                            size="large"
                                            isSelected={Boolean(value)}
                                            onChange={onChange}>
                                            <p>
                                                Yes, I consent to including my conversations in a{' '}
                                                <strong>de-identified</strong> public research
                                                dataset.
                                            </p>
                                        </Checkbox>
                                    )}
                                />
                            </form>
                        </DialogContent>
                    </FadeOverflowContent>

                    <DialogActions className={modalActionsClass}>
                        {initialTermsAndConditionsValue && (
                            <Button variant="outlined" onClick={handleClose}>
                                Cancel
                            </Button>
                        )}
                        <Button
                            className={noWrapClass}
                            variant="contained"
                            type="submit"
                            form={formId}
                            isDisabled={!formContext.formState.isValid}
                            onClick={formContext.handleSubmit(handleSubmit)}>
                            Accept terms & use Playground
                        </Button>
                    </DialogActions>
                </div>
            </div>
        </Dialog>
    );
};

const containerClass = css({
    backgroundColor: 'background',
    overflow: 'hidden',
    height: '[100%]',
    display: 'grid',
    gridTemplateColumns: {
        base: '1fr',
        md: '380px 1fr',
    },
    padding: {
        // base=0 padding on content for mobile
        md: '8',
    },
});
const imgClass = css({
    width: '[380px]',
    paddingRight: '[36px]',
    height: '[100%]',
    display: {
        base: 'none',
        md: 'block',
    },
});

const playgroundLogoClassName = css({
    height: '[50px]',
    display: {
        base: 'block',
        md: 'none',
    },
});

const modalContainer = css({
    display: 'flex',
    flexDirection: 'column',
    maxHeight: '[100%]',
    overflow: 'hidden',
    gap: '2',
    fontSize: '[1rem]',
    lineHeight: '[1.5em]',
    '--background-color': '{colors.background}',
});

const modalActionsClass = css({
    justifyContent: 'flex-start',
    padding: '4',
    md: {
        paddingInlineStart: '0',
    },
});
const checkboxClass = css({
    alignItems: 'flex-start',
    '& p': {
        // aligns checkbox with top of text instead of top of lineheight
        marginTop: '[-0.2em]',
    },
});
const noWrapClass = css({
    whiteSpace: 'nowrap',
});

const termsAndConditionsListClass = css({
    padding: '[revert]',
    listStyle: '[revert]',
});
