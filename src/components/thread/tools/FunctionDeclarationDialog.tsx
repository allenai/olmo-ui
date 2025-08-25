import { css } from '@allenai/varnish-panda-runtime/css';
import { DialogCloseButton, Modal, ModalActions, ModalCloseIconButton } from '@allenai/varnish-ui';
import { DevTool } from '@hookform/devtools';
import CloseIcon from '@mui/icons-material/Close';
import { useForm } from 'react-hook-form';

import { ControlledTextArea } from '@/components/form/TextArea/ControlledTextArea';

const modalBase = css({
    paddingTop: '4',
    paddingBottom: '6',
    paddingLeft: '2',
    paddingRight: '2',
});

const modalHeading = css({
    color: 'accent.primary',
    fontSize: 'sm',
    fontWeight: 'regular',
});

const modalInput = css({
    '& textarea': {
        fontFamily: 'monospace',
        fontSize: 'md',
    },
    '& label': {
        marginTop: '4',
        marginBottom: '8',
    },
});

interface DataFields {
    declaration: string;
}

interface FunctionDeclarationDialogProps {
    jsonData?: string;
    isOpen?: boolean;
    isPending?: boolean;
    isDisabled?: boolean;
    onSave: (data: DataFields) => void;
    onReset: () => void;
}

export function FunctionDeclarationDialog({
    jsonData = '',
    isOpen,
    isPending,
    isDisabled,
    onSave,
    onReset,
}: FunctionDeclarationDialogProps) {
    const { handleSubmit, control, formState } = useForm<DataFields>({
        defaultValues: {
            declaration: jsonData,
        },
        mode: 'onSubmit',
    });

    const handleReset = () => {
        onReset();
    };

    return (
        <Modal
            className={modalBase}
            isOpen={isOpen}
            isDismissable
            fullWidth
            size="large"
            heading="Function Declarations"
            headingClassName={modalHeading}
            closeButton={
                <ModalCloseIconButton>
                    <CloseIcon />
                </ModalCloseIconButton>
            }
            buttons={
                <ModalActions>
                    <DialogCloseButton color="secondary" shape="rounded" onClick={handleReset}>
                        Reset
                    </DialogCloseButton>
                    <DialogCloseButton
                        color="secondary"
                        shape="rounded"
                        variant="contained"
                        type="submit"
                        form="jsonForm"
                        isPending={isPending}
                        isDisabled={!formState.isValid || isDisabled}>
                        Save
                    </DialogCloseButton>
                </ModalActions>
            }>
            <DevTool control={control} />
            <form id="jsonForm" onSubmit={handleSubmit(onSave)}>
                <ControlledTextArea
                    className={modalInput}
                    name="declaration"
                    label="Enter a list of function declarations for the model to call upon. See the API documentation for examples."
                    isDisabled={isDisabled}
                    minRows={18}
                    maxRows={18}
                    controllerProps={{
                        control,
                        rules: {
                            validate: (value) => {
                                try {
                                    console.log(value);
                                    JSON.parse(value);
                                } catch {
                                    return 'Invalid JSON format';
                                }

                                return true;
                            },
                        },
                    }}
                />
            </form>
        </Modal>
    );
}
