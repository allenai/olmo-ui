import { css } from '@allenai/varnish-panda-runtime/css';
import { Button, IconButton, Modal, ModalActions } from '@allenai/varnish-ui';
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

export interface FunctionDeclarationDialogProps {
    jsonData?: string;
    isOpen?: boolean;
    isDisabled?: boolean;
    onSave: (data: DataFields) => void;
    onReset?: () => void;
    onClose?: () => void;
}

export function FunctionDeclarationDialog({
    jsonData = '',
    isOpen,
    isDisabled,
    onSave,
    onReset,
    onClose,
}: FunctionDeclarationDialogProps) {
    const { handleSubmit, reset, control, formState } = useForm<DataFields>({
        defaultValues: {
            declaration: jsonData,
        },
        mode: 'onSubmit',
    });

    const handleSave = handleSubmit((data) => {
        onSave(data);
        onClose?.();
    });

    const handleReset = () => {
        reset();
        onReset?.();
    };

    const formId = 'function-declaration-form';

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
                <IconButton onClick={onClose} aria-label="Close function declarations dialog">
                    <CloseIcon />
                </IconButton>
            }
            buttons={
                <ModalActions>
                    <Button
                        color="secondary"
                        shape="rounded"
                        onClick={handleReset}
                        aria-label="Reset form"
                        isDisabled={isDisabled}>
                        Reset
                    </Button>
                    <Button
                        color="secondary"
                        shape="rounded"
                        variant="contained"
                        type="submit"
                        form={formId}
                        aria-label="Save function declarations"
                        isDisabled={!formState.isValid || isDisabled}>
                        Save
                    </Button>
                </ModalActions>
            }>
            <DevTool control={control} />
            <form id={formId} onSubmit={handleSave}>
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
