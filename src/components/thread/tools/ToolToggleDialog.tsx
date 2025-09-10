import { css, cx } from '@allenai/varnish-panda-runtime/css';
import { Button, Checkbox, IconButton, Modal, ModalActions } from '@allenai/varnish-ui';
import CloseIcon from '@mui/icons-material/Close';
import type { ReactNode } from 'react';
import { useController, useForm } from 'react-hook-form';
import { type UseControllerProps, useFieldArray } from 'react-hook-form';

import { useColorMode } from '@/components/ColorModeProvider';

const modalBase = css({
    fontSize: 'sm',
    paddingTop: '4',
    paddingBottom: '6',
    paddingInline: '2',
});

const modalHeading = css({
    color: 'accent.primary',
    fontSize: 'sm',
    fontWeight: 'regular',
});

const labelStyle = css({
    marginBottom: '2',
});
interface DataFields {
    tools: string[];
}

export interface ToolToggleDialogProps {
    tools: string[];
    isOpen?: boolean;
    isDisabled?: boolean;
    onSave: (data: DataFields) => void;
    onReset?: () => void;
    onClose?: () => void;
}

export function ToolToggleDialog({
    tools,
    isOpen,
    isDisabled,
    onSave,
    onReset,
    onClose,
}: ToolToggleDialogProps) {
    const { colorMode } = useColorMode();
    const { handleSubmit, reset, setValue, control } = useForm<DataFields>({
        values: {
            tools: [],
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

    const formId = 'tool-toggle-form';

    return (
        <Modal
            className={cx(colorMode, modalBase)}
            isOpen={isOpen}
            isDismissable
            fullWidth
            size="large"
            heading="Active Tools"
            headingClassName={modalHeading}
            closeButton={
                <IconButton onClick={onClose} aria-label="Close active tools dialog">
                    <CloseIcon />
                </IconButton>
            }
            buttons={
                <ModalActions fullWidth>
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
                        isDisabled={isDisabled}>
                        Save
                    </Button>
                </ModalActions>
            }>
            <form id={formId} onSubmit={handleSave}>
                <p className={labelStyle}>Tools below will be added to the conversation.</p>
                {tools.map((tool) => (
                    <div>{tool}</div>
                ))}
                <ControlledToggleTable options={tools} name="toggle" controllerProps={control} />
            </form>
        </Modal>
    );
}

interface ControlledSwitchProps {
    name: string;
    controllerProps?: UseControllerProps;
    options: string[];
}

export const ControlledToggleTable = ({
    name,
    controllerProps,
    options,
}: ControlledSwitchProps): ReactNode => {
    const { field } = useController({ name, ...controllerProps, defaultValue: [] });

    console.log(field.value);
    return (
        <div>
            {options.map((name) => (
                <div>
                    <Checkbox
                        {...field}
                        onChange={(selected) => {
                            if (selected) {
                                field.onChange([...field.value, name]);
                            }
                        }}>
                        {name}
                    </Checkbox>
                </div>
            ))}
        </div>
    );
};
