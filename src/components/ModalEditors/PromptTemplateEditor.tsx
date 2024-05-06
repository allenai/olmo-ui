import {
    Button,
    Dialog,
    DialogActions,
    DialogContent,
    DialogTitle,
    FilledInput,
    FormControl,
    FormLabel,
    OutlinedInput,
    Stack,
} from '@mui/material';
import { useEffect, useState } from 'react';

import { PromptTemplate } from '../../api/PromptTemplate';
import { ArchivedAlert, Metadata } from './Shared';

interface Props {
    onSuccess: (name: string, content: string) => void;
    onCancel: () => void;
    onRestore: () => void;
    open: boolean;
    promptTemplate?: PromptTemplate;
    // is the dialog busy
    isLoading?: boolean;
}

export const PromptTemplateEditor = ({
    onSuccess,
    onCancel,
    onRestore,
    open,
    promptTemplate,
    isLoading,
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
                <ArchivedAlert onRestore={onRestore} disabled={isLoading} />
            ) : null}
            <DialogTitle>
                {!promptTemplate ? 'Create New Prompt Template' : 'Prompt Template Details'}
            </DialogTitle>
            <DialogContent>
                <Stack component="form" noValidate autoComplete="off" spacing={1}>
                    <FormControl disabled={isLoading}>
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
                                onChange={(v) => {
                                    setName(v.target.value);
                                }}
                            />
                        )}
                    </FormControl>
                    <FormControl disabled={isLoading}>
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
                                onChange={(v) => {
                                    setContent(v.target.value);
                                }}
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
                                        : content.length || 0
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
                            disabled={isLoading || !name || !content}
                            variant="contained"
                            onClick={() => {
                                onSuccess(name, content);
                            }}>
                            Save
                        </Button>
                        <Button onClick={onCancel}>Cancel</Button>
                    </>
                ) : (
                    <Button disabled={isLoading} onClick={onCancel}>
                        Close
                    </Button>
                )}
            </DialogActions>
        </Dialog>
    );
};
