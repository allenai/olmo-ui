import { css } from '@allenai/varnish-panda-runtime/css';
import { Button, IconButton, Modal, ModalActions } from '@allenai/varnish-ui';
import CloseIcon from '@mui/icons-material/Close';
import { useEffect, useState } from 'react';
import { Key } from 'react-aria-components';
import { Resolver, useForm } from 'react-hook-form';

import { Model } from '@/api/playgroundApi/additionalTypes';
import { useQueryContext } from '@/contexts/QueryContext';

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
    jsonData?: string;
    isOpen?: boolean;
    isDisabled?: boolean;
    onSave: (data: DataFields) => void;
    onReset?: () => void;
    onClose?: () => void;
}

export function ToolDeclarationDialog({
    jsonData = '[]',
    availableTools: tools,
    selectedTools,
    isOpen,
    isDisabled,
    onSave,
    onReset,
    onClose,
}: ToolDeclarationDialogProps) {
    const initialTab = tools && tools.length > 0 ? 'system-functions' : 'user-functions';
    const [tabSelected, setTabSelect] = useState<Key>(initialTab);

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
        onSave(data);
        onClose?.();
    });

    const handleReset = () => {
        reset();
        onReset?.();
    };

    const formId = 'function-declaration-form';

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
                        {/* <DropdownButton formId={formId} reset={handleReset} save={save} /> */}
                        <div
                            className={css({
                                isolation: 'isolate',
                                display: 'flex',
                                gap: '3',
                            })}>
                            <SaveAndEnable onClick={handleSave} formId={formId} />
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

const SaveAndEnable = ({ formId, onClick: saveForm }: { formId: string; onClick: () => void }) => {
    const { updateIsToolCallingEnabled, isToolCallingEnabled } = useQueryContext();

    const handleSave = () => {
        saveForm();
        updateIsToolCallingEnabled(!isToolCallingEnabled);
    };

    return (
        <Button
            shape="rounded"
            color="secondary"
            variant="contained"
            form={formId}
            aria-label="Save tool declarations"
            onClick={handleSave}>
            Save and {isToolCallingEnabled ? 'disable' : 'enable'}
        </Button>
    );
};
