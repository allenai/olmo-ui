import { css } from '@allenai/varnish-panda-runtime/css';
import { Button, DialogCloseButton, Modal, ModalTrigger } from '@allenai/varnish-ui';

import { ControlledTextArea, ControlledTextAreaProps } from './ControlledTextArea';

const modalTriggerButton = css({
    marginTop: '1',
});

const modal = css({ width: 'screen', maxW: 'screen' });

const expandableTextAreaWrapper = css({ width: '[100%]' });

const closeButtonWrapper = css({
    display: 'flex',
    flexDir: 'column',
    alignItems: 'end',
    paddingY: '2',
    gap: '2',
});

type ExpandableTextAreaProps = ControlledTextAreaProps;

export const ExpandableTextArea = (props: ExpandableTextAreaProps) => {
    return (
        <div className={expandableTextAreaWrapper}>
            <ControlledTextArea {...props} minRows={3} maxRows={3} />
            <ModalTrigger>
                <Button variant="text" className={modalTriggerButton}>
                    Expand
                </Button>
                <Modal isDismissable closeButton={true} className={modal} size="large">
                    <div className={closeButtonWrapper}>
                        <ControlledTextArea {...props} minRows={20} maxRows={20} />
                        <DialogCloseButton variant="text">Close</DialogCloseButton>
                    </div>
                </Modal>
            </ModalTrigger>
        </div>
    );
};
