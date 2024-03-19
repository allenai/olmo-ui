import { MenuItem, TextField } from '@mui/material';
import { useState } from 'react';
import { useFormContext } from 'react-hook-form-mui';

import { usePromptTemplate } from '../../contexts/promptTemplateContext';

import { DefaultPromptTemplate } from '../../api/PromptTemplate';

import { Confirm } from '../Confirm';

interface TemplateSelectProps {
    disabled?: boolean;
    onChange: (templateId: string) => void;
}

export const TemplateSelect = ({ disabled, onChange }: TemplateSelectProps): JSX.Element => {
    const { promptTemplateList } = usePromptTemplate();
    const { formState, getFieldState } = useFormContext();

    const [isPromptAlertOpen, setIsPromptAlertOpen] = useState(false);
    const [selectedPromptTemplateId, setSelectedPromptTemplateId] = useState<string>(
        DefaultPromptTemplate.id
    );

    const handleChange = (selectedPromptTemplateId: string) => {
        const templateContent = promptTemplateList.find(
            (template) => template.id === selectedPromptTemplateId
        )?.content;

        if (templateContent == null) {
            // TODO: Handle this edge case. What do we want to do if a template disappears?
            return;
        }

        onChange(templateContent);
        setSelectedPromptTemplateId(selectedPromptTemplateId);
    };

    return (
        <>
            <TextField
                select
                label="Prompt template"
                defaultValue={DefaultPromptTemplate.id}
                disabled={disabled}
                // this keeps the label at the top. it makes it look nicer since the models and templates can arrive at separate times
                InputLabelProps={{ shrink: true }}
                sx={{
                    flex: '1 1 auto',
                }}
                onChange={(event) => {
                    if (formState.isDirty && getFieldState('content').isDirty) {
                        // we have a dirty prompt, ask the user if they're sure they want to replace their prompt
                        setSelectedPromptTemplateId(event.target.value);
                        setIsPromptAlertOpen(true);
                    } else {
                        handleChange(event.target.value);
                    }
                }}>
                {promptTemplateList.map((pt) => {
                    return (
                        <MenuItem key={pt.id} value={pt.id}>
                            {pt.name}
                        </MenuItem>
                    );
                })}
            </TextField>

            <Confirm
                title="Lose changes?"
                contentText="You have prompt edits that will be lost if you continue."
                open={isPromptAlertOpen}
                onSuccess={() => {
                    setIsPromptAlertOpen(false);
                    handleChange(selectedPromptTemplateId);
                }}
                onCancel={() => setIsPromptAlertOpen(false)}
                successText="Continue"
            />
        </>
    );
};
