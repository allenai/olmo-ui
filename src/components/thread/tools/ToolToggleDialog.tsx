import { css, cx } from '@allenai/varnish-panda-runtime/css';
import { Button, Checkbox, IconButton, Modal, ModalActions } from '@allenai/varnish-ui';
import CloseIcon from '@mui/icons-material/Close';
import { type ReactNode, useEffect } from 'react';
import { Control, useController, useForm } from 'react-hook-form';

import { Model } from '@/api/playgroundApi/additionalTypes';
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
    tools: Model['available_tools'];
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
    const { handleSubmit, reset, control, setValue } = useForm<DataFields>({
        defaultValues: {
            tools: (tools || []).map((t) => t.name),
        },
        mode: 'onSubmit',
    });

    useEffect(() => {
        setValue(
            'tools',
            (tools || []).map((t) => t.name)
        );
    }, [tools]);

    const handleSave = handleSubmit((data) => {
        console.log(data);
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
                <ControlledToggleTable control={control} tools={tools} />
            </form>
        </Modal>
    );
}

interface ControlledToggleTableProps {
    control: Control<DataFields>;
    tools: Model['available_tools'];
}

export const ControlledToggleTable = ({
    control,
    tools,
}: ControlledToggleTableProps): ReactNode => {
    const { field } = useController({
        name: 'tools',
        control,
    });

    const handleToggle = (tool: string, isChecked: boolean) => {
        const currentTools = field.value || [];
        if (isChecked) {
            if (!currentTools.includes(tool)) {
                field.onChange([...currentTools, tool]);
            }
        } else {
            field.onChange(currentTools.filter((t) => t !== tool));
        }
    };

    return (
        <div>
            {(tools || []).map((tool) => (
                <div
                    key={tool.name}
                    style={{ marginBottom: '8px', display: 'flex', alignItems: 'center' }}>
                    <Checkbox
                        isSelected={field.value.includes(tool.name) || false}
                        onChange={(isChecked) => {
                            handleToggle(tool.name, isChecked);
                        }}
                        aria-label={`Toggle ${tool} tool`}
                    />
                    <span style={{ marginLeft: '8px' }}>{tool.name}</span>
                    <span style={{ marginLeft: '8px' }}>{tool.description}</span>
                </div>
            ))}
        </div>
    );
};
