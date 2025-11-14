import { css, cx } from '@allenai/varnish-panda-runtime/css';
import {
    Button,
    Checkbox,
    ModalActions,
    ModalBase,
    ModalContent,
    ModalHeading,
} from '@allenai/varnish-ui';
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
        <ModalBase
            className={modalClass}
            overlayClassName={css({ padding: '3' })} // this is in lieu of margin on the modal
            isOpen={isOpen}
            isDismissable={false}
            isKeyboardDismissDisabled={true}>
            <div className={containerClass}>
                <img
                    className={imgClass}
                    src="/getting-started-section-1.png"
                    alt="Terms and Conditions"
                />
                <div className={modalContainer}>
                    <ModalHeading className={cx(modalHeaderClass)} closeButton={false}>
                        <img
                            src="/playground-logo.svg"
                            alt="Return to the Playground home page"
                            fetchPriority="high"
                            className={playgroundLogoClassName}
                        />
                        Terms of Use & Publication Consent
                    </ModalHeading>
                    <FadeOverflowContent>
                        <ModalContent className={modalContentClass}>
                            <p>
                                By using Playground, you agree to Ai2&apos;s{' '}
                                <TermAndConditionsLink link={links.terms}>
                                    Terms of Use
                                </TermAndConditionsLink>{' '}
                                and{' '}
                                <TermAndConditionsLink link={links.responsibleUseGuidelines}>
                                    Responsible Use Guidelines
                                </TermAndConditionsLink>{' '}
                                and have read Ai2&apos;s{' '}
                                <TermAndConditionsLink link={links.privacyPolicy}>
                                    Privacy Policy
                                </TermAndConditionsLink>
                                . By accepting these terms, you agree{' '}
                                <strong>
                                    not to submit any personal, sensitive, proprietary, or
                                    confidential information to Playground,
                                </strong>
                                and agree that Ai2 may use your interactions for AI training and
                                scientific research.
                            </p>
                            <p>
                                To accelerate scientific discovery, Ai2 may publish your{' '}
                                <strong>de-identified</strong> Playground interactions in a public
                                research dataset as part of its commitment to open science if you
                                consent by checking the box below.
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
                                                <strong>Help improve open science!</strong> I
                                                consent to the inclusion of my{' '}
                                                <strong>de-identified</strong> interactions with
                                                Playground in a public research dataset.
                                            </p>
                                        </Checkbox>
                                    )}
                                />
                            </form>
                            <p>
                                If you do not wish to agree to these terms, exit this page. You can
                                still use Playground if you choose not to participate in the public
                                research dataset.
                            </p>
                        </ModalContent>
                    </FadeOverflowContent>

                    <ModalActions className={modalActionsClass}>
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
                    </ModalActions>
                </div>
            </div>
        </ModalBase>
    );
};

const modalClass = css({
    borderRadius: 'lg',
    maxWidth: '[970px]',
    minWidth: '[300px]',
    // the modal margin math is not good, disable auto
    // we have padding on the overlay to compensate
    '--modal-margin': '0px',
});

const containerClass = css({
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

const modalHeaderClass = css({
    display: 'grid',
    gridTemplateRows: 'auto 1fr',
    gap: '2',
    fontSize: {
        base: '2xl',
        md: '4xl',
    },
    lineHeight: '[1.2em]',
    padding: {
        base: '4',
        md: '0',
    },
    paddingBlockEnd: '2',
});
const modalContentClass = css({
    display: 'flex',
    flexDirection: 'column',
    gap: '4',
    paddingInline: {
        base: '4',
        md: '0',
    },
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
