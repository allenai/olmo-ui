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

import { DataChip } from '../../api/DataChip';
import { ArchivedAlert, Metadata } from './Shared';

interface Props {
    // called when the user saves
    onSuccess: (name: string, content: string) => void;
    // called whne the user cancels/leaves
    onCancel: () => void;
    // called when the user clicks restore on an archived chip
    onRestore: () => void;
    // conteols if the modal is open
    open: boolean;
    // if a chip is passed, it is the readonly chip
    chip?: DataChip;
    // if no chip is passed, the user can pass a seed content to start a new chip
    seedContent?: string;
    // is the dialog busy
    isLoading?: boolean;
}

export const DataChipEditor = ({
    onSuccess,
    onCancel,
    onRestore,
    open,
    chip,
    seedContent,
    isLoading,
}: Props) => {
    const [name, setName] = useState<string>('');
    const [content, setContent] = useState<string>('');
    useEffect(() => {
        setName(chip?.name || (seedContent && `${seedContent?.slice(0, 10)}…`) || '');
        setContent(chip?.content || seedContent || '');
    }, [open]);
    return (
        <Dialog fullWidth maxWidth="md" onClose={onCancel} open={open}>
            {chip && chip.deleted ? (
                <ArchivedAlert onRestore={onRestore} disabled={isLoading} />
            ) : null}
            <DialogTitle>{!chip ? 'Create New Data Chip' : 'Data Chip Details'}</DialogTitle>
            <DialogContent>
                <Stack component="form" noValidate autoComplete="off" spacing={1}>
                    <FormControl disabled={isLoading}>
                        <FormLabel>Name</FormLabel>
                        {chip ? (
                            <FilledInput
                                multiline
                                maxRows={10}
                                value={chip.name}
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
                                placeholder="Enter a name for the Data Chip…"
                                value={name}
                                onChange={(v) => setName(v.target.value)}
                            />
                        )}
                    </FormControl>
                    <FormControl disabled={isLoading}>
                        <FormLabel>Content</FormLabel>
                        {chip ? (
                            <FilledInput
                                multiline
                                maxRows={10}
                                value={chip.content}
                                readOnly={true}
                                disableUnderline={true}
                                hiddenLabel={true}
                            />
                        ) : (
                            <OutlinedInput
                                multiline
                                minRows={6}
                                maxRows={10}
                                placeholder="Enter full content for the Data Chip…"
                                value={content}
                                onChange={(v) => setContent(v.target.value)}
                            />
                        )}
                        <Metadata
                            data={[
                                chip ? chip.created.toDateString() : new Date().toDateString(),
                                `${chip ? chip.content.length : content?.length || 0} characters`,
                            ]}
                        />
                    </FormControl>
                </Stack>
            </DialogContent>
            <DialogActions sx={{ justifyContent: 'start' }}>
                {!chip ? (
                    <>
                        <Button
                            disabled={isLoading || !name || !content}
                            variant="contained"
                            onClick={() => onSuccess(name!, content!)}>
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
