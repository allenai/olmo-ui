import { css } from '@allenai/varnish-panda-runtime/css';
import { Button, Checkbox } from '@allenai/varnish-ui';
import { Dialog, DialogActions, DialogContent, DialogTitle } from '@mui/material';
import { useState } from 'react';
import { Controller, useForm } from 'react-hook-form';

import { useAppContext } from '@/AppContext';
import { links } from '@/Links';
import type { UpdateUserTermsAndDataCollectionPayload } from '@/slices/UserSlice';

import { TermAndConditionsLink } from './TermsAndConditionsLink';
import { FadeOverflowContent } from './widgets/FadeOverflowContent';

type FormValues = {
    termsAccepted: boolean;
    dataCollectionAccepted: boolean;
    mediaCollectionAccepted: boolean;
};

interface TermsAndDataCollectionModalProps {
    onClose?: () => void;
    initialTermsAndConditionsValue?: boolean;
    initialDataCollectionValue?: boolean;
    initialMediaCollectionValue?: boolean;
}

export const TermsAndDataCollectionModal = ({
    onClose,
    initialTermsAndConditionsValue,
    initialDataCollectionValue,
    initialMediaCollectionValue,
}: TermsAndDataCollectionModalProps) => {
    const [isOpen, setIsOpen] = useState<boolean>(true);

    const updateTermsAndOrConsent = useAppContext(
        (state) => state.updateUserTermsAndDataCollection
    );

    const formContext = useForm<FormValues>({
        defaultValues: {
            dataCollectionAccepted: initialDataCollectionValue,
            mediaCollectionAccepted: initialMediaCollectionValue,
        },
    });

    const handleSubmit = async (formValues: FormValues) => {
        if (!formContext.formState.isValid) return;
        const payload = {
            hasAcceptedTermsAndConditions:
                formValues.termsAccepted !== initialTermsAndConditionsValue ? true : undefined,
            hasAcceptedDataCollection:
                formValues.dataCollectionAccepted !== initialDataCollectionValue
                    ? formValues.dataCollectionAccepted
                    : undefined,
            hasAcceptedMediaCollection:
                formValues.mediaCollectionAccepted !== initialMediaCollectionValue
                    ? formValues.mediaCollectionAccepted
                    : undefined,
        } satisfies UpdateUserTermsAndDataCollectionPayload;

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
                    margin: {
                        xs: 1,
                        md: 4,
                    },
                    padding: 0,
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
                        <form id={formId} onSubmit={formContext.handleSubmit(handleSubmit)}>
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
                                <p>By using Playground, you agree:</p>
                                <div>
                                    <ul className={termsAndConditionsListClass}>
                                        <li>
                                            to Ai2’s{' '}
                                            <TermAndConditionsLink link={links.terms}>
                                                Terms of Use
                                            </TermAndConditionsLink>
                                            ,{` `}
                                            <TermAndConditionsLink
                                                link={links.responsibleUseGuidelines}>
                                                Responsible Use Guidelines
                                            </TermAndConditionsLink>
                                            {` `}
                                            and acknowledge Ai2’s{` `}
                                            <TermAndConditionsLink link={links.privacyPolicy}>
                                                Privacy Policy
                                            </TermAndConditionsLink>
                                            ;
                                        </li>
                                        <li>
                                            you will not submit or upload personal, sensitive,
                                            confidential, or proprietary information to Playground;
                                        </li>
                                        <li>
                                            you possess all necessary rights and authority to upload
                                            content to Playground;
                                        </li>
                                        <li>
                                            none of your uploaded content will violate any
                                            third-party intellectual property or privacy rights; and
                                        </li>
                                        <li>
                                            Ai2 may use your conversations and uploaded content to
                                            train, evaluate, and improve AI models.
                                        </li>
                                    </ul>
                                </div>
                                <div>
                                    <p>
                                        <strong>Optional Consents:</strong> Help the community by
                                        allowing Ai2 to publish your Playground interactions in
                                        open, public datasets curated for scientific research.
                                    </p>
                                </div>
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
                                                <strong>Yes, I contribute my conversations.</strong>{' '}
                                                I consent to having my de-identified text
                                                conversations with Playground published in an open,
                                                public research dataset.
                                            </p>
                                        </Checkbox>
                                    )}
                                />
                                <Controller
                                    name="mediaCollectionAccepted"
                                    control={formContext.control}
                                    render={({ field: { onChange, value } }) => (
                                        <Checkbox
                                            className={checkboxClass}
                                            color="default"
                                            size="large"
                                            isSelected={Boolean(value)}
                                            onChange={onChange}>
                                            <p>
                                                <strong>Yes, I contribute my uploads.</strong> I
                                                consent to having content I upload to Playground
                                                published in an open, public research dataset. I
                                                affirm that I possess all necessary rights and
                                                authority to consent to the publication of this
                                                uploaded content.
                                            </p>
                                        </Checkbox>
                                    )}
                                />
                            </DialogContent>
                        </form>
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
