import { MenuItem, Select } from '@mui/material';
import { useState } from 'react';
import { useFormContext } from 'react-hook-form-mui';

import { DefaultPromptTemplate, PromptTemplate } from '../../api/PromptTemplate';

import { Confirm } from '../Confirm';

interface TemplateSelectProps {
    defaultTemplate?: string;
    promptTemplates: PromptTemplate[];
    disabled?: boolean;
    onChange: (templateId: string) => void;
}

export const TemplateSelect = ({
    promptTemplates,
    disabled,
    defaultTemplate = DefaultPromptTemplate.id,
    onChange,
}: TemplateSelectProps): JSX.Element => {
    const { formState } = useFormContext();

    const [isPromptAlertOpen, setIsPromptAlertOpen] = useState(false);
    const [selectedPromptTemplateId, setSelectedPromptTemplateId] =
        useState<string>(defaultTemplate);

    return (
        <>
            <Select
                defaultValue={defaultTemplate}
                disabled={disabled}
                sx={{
                    flex: '1 1 min-content',
                }}
                onChange={(event) => {
                    if (formState.isDirty) {
                        // we have a dirty prompt, ask the user if they're sure they want to replace their prompt
                        setSelectedPromptTemplateId(event.target.value);
                        setIsPromptAlertOpen(true);
                    } else {
                        onChange(event.target.value);
                        setSelectedPromptTemplateId(event.target.value);
                    }
                }}>
                {promptTemplates.map((pt) => {
                    return (
                        <MenuItem key={pt.id} value={pt.id}>
                            {pt.name}
                        </MenuItem>
                    );
                })}
            </Select>

            <Confirm
                title="Lose changes?"
                contentText="You have prompt edits that will be lost if you continue."
                open={isPromptAlertOpen}
                onSuccess={() => {
                    setIsPromptAlertOpen(false);
                    onChange(selectedPromptTemplateId);
                }}
                onCancel={() => setIsPromptAlertOpen(false)}
                successText="Continue"
            />
        </>
    );
};
