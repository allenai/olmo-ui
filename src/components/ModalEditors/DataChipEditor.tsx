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
    onSuccess: (name: string, content: string) => void;
    onCancel: () => void;
    onRestore: () => void;
    open: boolean;
    chip?: DataChip;
}

export const DataChipEditor = ({ onSuccess, onCancel, onRestore, open, chip }: Props) => {
    const [name, setName] = useState<string>('');
    const [content, setContent] = useState<string>('');
    useEffect(() => {
        setName(chip?.name || '');
        setContent(chip?.content || '');
    }, [open]);
    return (
        <Dialog fullWidth maxWidth="md" onClose={onCancel} open={open}>
            {chip && chip.deleted ? <ArchivedAlert onRestore={onRestore} /> : null}
            <DialogTitle>{!chip ? 'Create New Data Chip' : 'Data Chip Details'}</DialogTitle>
            <DialogContent>
                <Stack component="form" noValidate autoComplete="off" spacing={1}>
                    <FormControl>
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
                                placeholder="Enter a name for the Data Chip..."
                                value={name}
                                onChange={(v) => setName(v.target.value)}
                            />
                        )}
                    </FormControl>
                    <FormControl>
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
                                placeholder="Enter full content for the Data Chip..."
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
