import React, { useState, useEffect } from 'react';
import {
    Button,
    Dialog,
    DialogActions,
    DialogContent,
    DialogTitle,
    FormControl,
    FormLabel,
    OutlinedInput,
    Stack,
    FilledInput,
} from '@mui/material';

import { PromptTemplate } from '../../api/PromptTemplate';
import { ArchivedAlert, Metadata } from './Shared';

interface Props {
    onSuccess: (name: string, content: string) => void;
    onCancel: () => void;
    onRestore: () => void;
    open: boolean;
    promptTemplate?: PromptTemplate;
}

export const PromptTemplateEditor = ({
    onSuccess,
    onCancel,
    onRestore,
    open,
    promptTemplate,
}: Props) => {
    const [name, setName] = useState<string>('');
    const [content, setContent] = useState<string>('');
    useEffect(() => {
        setName(promptTemplate?.name || '');
        setContent(promptTemplate?.content || '');
    }, [open]);
    return (
        <Dialog fullWidth maxWidth="md" onClose={onCancel} open={open}>
            {promptTemplate && promptTemplate.deleted ? (
                <ArchivedAlert onRestore={onRestore} />
            ) : null}
            <DialogTitle>
                {!promptTemplate ? 'Create New Prompt Template' : 'Prompt Template Details'}
            </DialogTitle>
            <DialogContent>
                <Stack component="form" noValidate autoComplete="off" spacing={1}>
                    <FormControl>
                        <FormLabel>Name</FormLabel>
                        {promptTemplate ? (
                            <FilledInput
                                multiline
                                maxRows={10}
                                value={promptTemplate.name}
                                readOnly={true}
                                disableUnderline={true}
                                hiddenLabel={true}
                            />
                        ) : (
                            <OutlinedInput
                                inputProps={{
                                    // prevents 1password from trying to populate this field
                                    form: {
                                        autocomplete: 'off',
                                    },
                                }}
                                placeholder="Enter a name for the Prompt Template..."
                                value={name}
                                onChange={(v) => setName(v.target.value)}
                            />
                        )}
                    </FormControl>
                    <FormControl>
                        <FormLabel>Content</FormLabel>
                        {promptTemplate ? (
                            <FilledInput
                                multiline
                                maxRows={10}
                                value={promptTemplate.content}
                                readOnly={true}
                                disableUnderline={true}
                                hiddenLabel={true}
                            />
                        ) : (
                            <OutlinedInput
                                multiline
                                minRows={6}
                                maxRows={10}
                                placeholder="Enter full content for the Prompt Template..."
                                value={content}
                                onChange={(v) => setContent(v.target.value)}
                            />
                        )}
                        <Metadata
                            data={[
                                promptTemplate
                                    ? promptTemplate.created.toDateString()
                                    : new Date().toDateString(),
                                `${
                                    promptTemplate
                                        ? promptTemplate.content.length
                                        : content?.length || 0
                                } characters`,
                            ]}
                        />
                    </FormControl>
                </Stack>
            </DialogContent>
            <DialogActions sx={{ justifyContent: 'start' }}>
                {!promptTemplate ? (
                    <>
                        <Button
                            disabled={!name || !content}
                            variant="contained"
                            onClick={() => onSuccess(name!, content!)}>
                            Save
                        </Button>
                        <Button onClick={onCancel}>Cancel</Button>
                    </>
                ) : (
                    <Button onClick={onCancel}>Close</Button>
                )}
            </DialogActions>
        </Dialog>
    );
};
