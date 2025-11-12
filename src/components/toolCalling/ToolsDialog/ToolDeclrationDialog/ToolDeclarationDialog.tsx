import { css } from '@allenai/varnish-panda-runtime/css';
import { Button, IconButton, Modal, ModalActions, Switch } from '@allenai/varnish-ui';
import CloseIcon from '@mui/icons-material/Close';
import { useEffect, useId, useState } from 'react';
import { Key } from 'react-aria-components';
import { Resolver, useForm } from 'react-hook-form';

import { Model } from '@/api/playgroundApi/additionalTypes';

import { TabbedContent } from './TabbedContent';
import { validateToolDefinitions } from './toolDeclarationUtils';

const modalBase = css({
    fontSize: 'sm',
    paddingTop: '4',
    paddingBottom: '6',
    paddingInline: '2',
    height: '[750px]',
});

const modalHeading = css({
    color: 'accent.primary',
    fontSize: 'sm',
    fontWeight: 'regular',
});

const modalContentContainerClassName = css({
    paddingInline: '0',
    overflowY: 'hidden',
    flexGrow: '1',
});

export interface DataFields {
    declaration: string;
    tools: string[];
}
export interface ToolDeclarationDialogProps {
    availableTools: Model['available_tools'];
    selectedTools: string[];
    isToolCallingEnabled?: boolean;
    jsonData?: string;
    isOpen?: boolean;
    isDisabled?: boolean;
    onSave: (data: DataFields, toolCallingEnabled: boolean) => void;
    onReset?: () => void;
    onClose?: () => void;
}

interface ToolCallSwitchProps {
    isSelected: boolean;
    onChange: () => void;
}

const ToolCallSwitch = ({ isSelected, onChange }: ToolCallSwitchProps) => {
    return (
        <div
            className={css({
                display: 'flex',
                gap: '3',
                alignItems: 'center',
            })}>
            <label htmlFor="form-actions-tool-calling-switch">Enable tool calling</label>
            <Switch
                id="form-actions-tool-calling-switch"
                size="large"
                isSelected={isSelected}
                onChange={onChange}
            />
        </div>
    );
};

export function ToolDeclarationDialog({
    jsonData = '[]',
    availableTools: tools,
    selectedTools,
    isToolCallingEnabled,
    isOpen,
    isDisabled,
    onSave,
    onReset,
    onClose,
}: ToolDeclarationDialogProps) {
    const initialTab = tools && tools.length > 0 ? 'system-functions' : 'user-functions';
    const [tabSelected, setTabSelect] = useState<Key>(initialTab);
    const [isSwitchSelected, setSwitchSelected] = useState(!!isToolCallingEnabled);

    const resolver: Resolver<DataFields> = (data) => {
        const validJson = validateToolDefinitions(data.declaration);
        if (validJson === true) return { values: data, errors: {} };

        setTabSelect('user-functions');
        return {
            values: {},
            errors: {
                declaration: { type: 'value', message: validJson },
            },
        };
    };

    const { handleSubmit, reset, setValue, control } = useForm<DataFields>({
        values: {
            declaration: jsonData,
            tools: (tools || []).map((t) => t.name),
        },
        mode: 'onSubmit',
        resolver,
    });

    useEffect(() => {
        // Can't rely on default, if model changes we need to set the value.
        setValue('tools', selectedTools);
    }, [selectedTools, setValue]);

    const handleSave = handleSubmit((data) => {
        onSave(data, isSwitchSelected);
        onClose?.();
    });

    const handleReset = () => {
        reset();
        onReset?.();
    };

    const handleToolCallEnabled = () => {
        setSwitchSelected(!isSwitchSelected);
    };

    const uniqueId = useId();
    const formId = `function-declaration-form-${uniqueId}`;

    return (
        <>
            <Modal
                className={modalBase}
                contentClassName={modalContentContainerClassName}
                isOpen={isOpen}
                isDismissable
                fullWidth
                size="large"
                heading="Tool declarations"
                headingClassName={modalHeading}
                dialogClassName={css({ height: '[100%]' })}
                closeButton={
                    <IconButton onClick={onClose} aria-label="Close tool declarations dialog">
                        <CloseIcon />
                    </IconButton>
                }
                buttons={
                    <ModalActions
                        fullWidth
                        className={css({
                            display: 'flex',
                            justifyContent: 'space-between',
                            width: '[100%]',
                        })}>
                        <Button
                            shape="rounded"
                            color="secondary"
                            onClick={handleReset}
                            aria-label="Reset form"
                            isDisabled={isDisabled}>
                            Reset
                        </Button>
                        <div
                            className={css({
                                display: 'flex',
                                gap: '6',
                            })}>
                            <ToolCallSwitch
                                isSelected={isSwitchSelected}
                                onChange={handleToolCallEnabled}
                            />
                            <Button
                                shape="rounded"
                                color="secondary"
                                variant="contained"
                                form={formId}
                                aria-label="Save tool declarations"
                                onClick={handleSave}>
                                Save
                            </Button>
                        </div>
                    </ModalActions>
                }>
                <form id={formId} onSubmit={handleSave} className={css({ height: '[100%]' })}>
                    <TabbedContent
                        tabSelected={tabSelected}
                        setTabSelect={setTabSelect}
                        isDisabled={isDisabled}
                        control={control}
                        tools={tools}
                        setValue={setValue}
                    />
                </form>
            </Modal>
        </>
    );
}
