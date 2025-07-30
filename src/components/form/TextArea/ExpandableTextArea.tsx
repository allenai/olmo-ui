import { css } from '@allenai/varnish-panda-runtime/css';
import { Button, DialogCloseButton, Modal, ModalTrigger } from '@allenai/varnish-ui';

import { ControlledTextArea, ControlledTextAreaProps } from './ControlledTextArea';

const modalTriggerButton = css({
    marginTop: '1',
});

const expandableTextAreaWrapper = css({ width: '[100%]' });

const modalWrapper = css({
    paddingY: '2',
});

type ExpandableTextAreaProps = Omit<ControlledTextAreaProps, 'fullWidth'>;

export const ExpandableTextArea = (props: ExpandableTextAreaProps) => {
    return (
        <div className={expandableTextAreaWrapper}>
            <ControlledTextArea fullWidth {...props} minRows={3} maxRows={3} />
            <ModalTrigger>
                <Button variant="text" className={modalTriggerButton}>
                    Expand
                </Button>
                <Modal
                    isDismissable
                    closeButton={true}
                    fullWidth
                    size="large"
                    className={modalWrapper}
                    buttons={<DialogCloseButton variant="text">Close</DialogCloseButton>}>
                    <ControlledTextArea fullWidth {...props} minRows={20} maxRows={20} />
                </Modal>
            </ModalTrigger>
        </div>
    );
};
