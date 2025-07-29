import { css } from '@allenai/varnish-panda-runtime/css';
import { Button, DialogCloseButton, Modal, ModalTrigger } from '@allenai/varnish-ui';

import { ControlledTextArea, ControlledTextAreaProps } from './ControlledTextArea';

type ExpandableTextAreaProps = ControlledTextAreaProps;

export const ExpandableTextArea = (props: ExpandableTextAreaProps) => {
    return (
        <div className={css({ width: '[100%]' })}>
            <ControlledTextArea {...props} minRows={3} maxRows={3} />
            <ModalTrigger>
                <Button
                    variant="text"
                    className={css({
                        marginTop: '1',
                    })}>
                    Expand
                </Button>
                <Modal
                    isDismissable
                    heading="Modal Heading"
                    closeButton={true}
                    className={css({ width: 'screen', maxW: 'screen' })}
                    size="large">
                    <ControlledTextArea {...props} minRows={20} maxRows={20} />
                    <div
                        className={css({
                            display: 'flex',
                            justifyContent: 'flex-end',
                            paddingY: '2',
                        })}>
                        <DialogCloseButton variant="text">Close</DialogCloseButton>
                    </div>
                </Modal>
            </ModalTrigger>
        </div>
    );
};
