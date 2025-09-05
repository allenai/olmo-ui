import { css, cx } from '@allenai/varnish-panda-runtime/css';
import {
    Button,
    Checkbox,
    Modal,
    ModalActions,
    ModalContent,
    ModalHeading,
} from '@allenai/varnish-ui';
import { useState } from 'react';
import { Controller, useForm } from 'react-hook-form';

import { useAppContext } from '@/AppContext';
import { links } from '@/Links';

import { useColorMode } from './ColorModeProvider';
import { TermAndConditionsLink } from './TermsAndConditionsLink';

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
    const { colorMode } = useColorMode();
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
        <Modal
            className={cx(colorMode, modalClass)}
            isOpen={isOpen}
            isDismissable={false}
            isKeyboardDismissDisabled={true}>
            <div className={containerClass}>
                <img
                    className={imgClass}
                    src="/getting-started-section-1.png"
                    alt="Terms and Conditions"
                />
                <div>
                    <ModalHeading className={cx(modalHeaderClass)} closeButton={false}>
                        Terms of Use & Publication Consent
                    </ModalHeading>
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
                                not to submit any personal, sensitive, proprietary, or confidential
                                information to Playground,
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
                                        color="default"
                                        size="large"
                                        isSelected={Boolean(value)}
                                        onChange={onChange}>
                                        <p>
                                            <strong>Help improve open science!</strong> I consent to
                                            the inclusion of my <strong>de-identified</strong>{' '}
                                            interactions with Playground in a public research
                                            dataset.
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
                            Accept Terms & Use Playground
                        </Button>
                    </ModalActions>
                </div>
            </div>
        </Modal>
    );
};

const imgClass = css({
    display: 'none',
    width: '[380px]',
    maxHeight: '[100%]',
    md: {
        display: 'block',
    },
});

const containerClass = css({
    display: 'flex',
});

const modalClass = css({
    borderRadius: 'lg',

    maxWidth: '[970px]',
    minWidth: '[300px]',
    overflow: 'auto',
    padding: '4',
    paddingInline: '0',
    margin: '2',

    sm: {
        padding: '8',
        margin: '8',
    },
});

const modalHeaderClass = css({
    fontSize: '4xl',
    lineHeight: '[1.2em]',
    paddingInline: '0',
    sm: {
        paddingInline: '4',
    },
});

const modalContentClass = css({
    display: 'flex',
    flexDirection: 'column',
    gap: '2',
    paddingInline: '0',
    sm: {
        paddingInline: '4',
    },
});

const modalActionsClass = css({
    justifyContent: 'flex-start',
    paddingInline: '0',
    sm: {
        paddingInline: '4',
    },
});

const noWrapClass = css({
    whiteSpace: 'nowrap',
});
