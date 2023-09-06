import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import {
    Box,
    Button,
    Dialog,
    DialogActions,
    DialogContent,
    DialogContentText,
    DialogTitle,
    Divider,
    LinearProgress,
    Stack,
    Table,
    TableBody,
    TableCell,
    TableHead,
    TableRow,
    TextField,
} from '@mui/material';

import { useAppContext } from '../AppContext';
import { PromptTemplate } from '../api/PromptTemplate';

export const PromptTemplates = () => {
    const {
        getAllPromptTemplates,
        allPromptTemplateInfo,
        deletePromptTemplate,
        deletedPromptTemplateInfo,
        postPromptTemplates,
        postPromptTemplateInfo,
    } = useAppContext();

    useEffect(() => {
        getAllPromptTemplates();
    }, []);

    const [newName, setNewName] = useState<string>();
    const [newContent, setNewContent] = useState<string>();
    const [openConfirm, setOpenConfirm] = React.useState(false);
    const [templateId, settemplateId] = React.useState<string>();

    const handleClickOpen = (templateId: string) => {
        settemplateId(templateId);
        setOpenConfirm(true);
    };

    const handleClose = (success: boolean) => {
        setOpenConfirm(false);
        if (success && templateId) {
            deletePromptTemplate(templateId);
        }
    };

    if (
        deletedPromptTemplateInfo.loading ||
        postPromptTemplateInfo.loading ||
        allPromptTemplateInfo.loading
    ) {
        return <LinearProgress />;
    }

    return (
        <Box sx={{ width: '100%', background: 'white', p: 2 }}>
            <Stack spacing={3}>
                <Table size="small">
                    <TableHead>
                        <TableRow>
                            <TableCell width="15%">Name</TableCell>
                            <TableCell width="85%">Content</TableCell>
                            <TableCell></TableCell>
                        </TableRow>
                    </TableHead>
                    <TableBody>
                        {allPromptTemplateInfo.data?.map((template: PromptTemplate) => (
                            <TableRow key={template.name}>
                                <TableCell component="th" scope="row">
                                    {template.name}
                                </TableCell>
                                <TableCell>
                                    <TextField
                                        InputProps={{ disableUnderline: true }}
                                        fullWidth
                                        size="small"
                                        variant="standard"
                                        multiline
                                        maxRows={6}
                                        value={template.content}></TextField>
                                </TableCell>
                                <TableCell>
                                    <Button
                                        variant="outlined"
                                        onClick={() => handleClickOpen(template.id)}>
                                        Delete
                                    </Button>
                                </TableCell>
                            </TableRow>
                        ))}

                        <TableRow>
                            <TableCell component="th" scope="row">
                                <TextField
                                    fullWidth
                                    size="small"
                                    value={newName}
                                    placeholder="Type name"
                                    onChange={(v) => setNewName(v.currentTarget.value)}
                                />
                            </TableCell>
                            <TableCell>
                                <TextField
                                    fullWidth
                                    size="small"
                                    multiline
                                    maxRows={5}
                                    value={newContent}
                                    placeholder="Type content"
                                    onChange={(v) => setNewContent(v.currentTarget.value)}
                                />
                            </TableCell>
                            <TableCell>
                                <Button
                                    variant="contained"
                                    disabled={!newName || !newContent}
                                    onClick={() =>
                                        postPromptTemplates({
                                            name: newName || '',
                                            content: newContent || '',
                                        })
                                    }>
                                    Add New
                                </Button>
                            </TableCell>
                        </TableRow>
                    </TableBody>
                </Table>
                <Divider />
                <Link to={'/'}>New Query</Link>
            </Stack>

            <Dialog open={openConfirm} onClose={() => handleClose(false)}>
                <DialogTitle>{'Are you sure?'}</DialogTitle>
                <DialogContent>
                    <DialogContentText>
                        This will affect all users and cannot be undone.
                    </DialogContentText>
                </DialogContent>
                <DialogActions>
                    <Button onClick={() => handleClose(false)}>Cancel</Button>
                    <Button onClick={() => handleClose(true)}>Continue</Button>
                </DialogActions>
            </Dialog>
        </Box>
    );
};
