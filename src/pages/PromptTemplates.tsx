/*
TODO:
  1- (blocked on api) need to be able to restore templates
  2- (blocked) archived templates are currently being filtered out by the backend
*/

import React, { useState, useEffect } from 'react';
import { Box, Button, IconButton, Typography } from '@mui/material';
import {
    DataGrid,
    GridColDef,
    GridRenderCellParams,
    GridValueGetterParams,
} from '@mui/x-data-grid';
import dayjs from 'dayjs';

import VisibilityIcon from '@mui/icons-material/Visibility';
import VisibilityOffIcon from '@mui/icons-material/VisibilityOffOutlined';
import AddIcon from '@mui/icons-material/Add';
import TuneIcon from '@mui/icons-material/Tune';

import { useAppContext } from '../AppContext';
import { PromptTemplate } from '../api/PromptTemplate';
import { PromptTemplateEditor } from '../components/ModalEditors/PromptTemplateEditor';
import { dateTimeFormat } from '../olmoTheme';

export const PromptTemplates = ({ hideTitle }: { hideTitle?: boolean }) => {
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

    const [editorOpen, setEditorOpen] = useState(false);
    const [focusedPromptTemplate, setFocusedPromptTemplate] = useState<PromptTemplate>();

    const promptTemplateColumns: GridColDef<PromptTemplate>[] = [
        {
            field: 'name',
            headerName: 'Name',
            minWidth: 170,
            flex: 2,
        },
        {
            field: 'content',
            headerName: 'Content',
            renderCell: (params: GridRenderCellParams<PromptTemplate>) => (
                <Typography sx={{ fontWeight: 'bold' }} noWrap>
                    {params.value}
                </Typography>
            ),
            minWidth: 170,
            flex: 5,
        },
        {
            field: 'characters',
            headerName: 'Characters',
            align: 'right',
            sortComparator: (a: number, b: number) => a - b,
            valueGetter: (params: GridValueGetterParams<PromptTemplate>) =>
                params.row.content.length,
            renderCell: (params: GridRenderCellParams<PromptTemplate>) =>
                params.value.toLocaleString(),
            minWidth: 100,
            flex: 1,
        },
        {
            field: 'creator',
            headerName: 'Creator',
            minWidth: 150,
            flex: 1,
        },
        {
            field: 'created',
            headerName: 'Created',
            align: 'right',
            valueGetter: (params: GridValueGetterParams) =>
                dayjs(params.value).format(dateTimeFormat),
            minWidth: 150,
            flex: 1,
        },
        {
            field: 'actions',
            headerName: 'Actions',
            filterable: false,
            sortable: false,
            disableColumnMenu: true,
            renderCell: (params: GridRenderCellParams<PromptTemplate>) => (
                <>
                    {!params.row.deleted ? (
                        <IconButton
                            aria-label="visible"
                            onClick={() => setArchivePromptTemplate(params.row, true)}>
                            <VisibilityIcon />
                        </IconButton>
                    ) : (
                        <IconButton
                            aria-label="hidden"
                            onClick={() => setArchivePromptTemplate(params.row, false)}>
                            <VisibilityOffIcon />
                        </IconButton>
                    )}
                    <IconButton
                        aria-label="hidden"
                        onClick={() => {
                            setFocusedPromptTemplate(params.row);
                            setEditorOpen(true);
                        }}>
                        <TuneIcon />
                    </IconButton>
                </>
            ),
            minWidth: 90,
            flex: 1,
        },
    ];

    const createPromptTemplate = (name: string, content: string) => {
        postPromptTemplates({
            name,
            content,
        });
    };

    const setArchivePromptTemplate = (
        promptTemplate: PromptTemplate | undefined,
        value: boolean
    ) => {
        if (promptTemplate) {
            if (value) {
                deletePromptTemplate(promptTemplate.id);
            } else {
                // todo: we need the ability to restore
            }
        }
    };

    return (
        <Box sx={{ width: '100%', background: 'white', p: 2 }}>
            <PromptTemplateEditor
                promptTemplate={focusedPromptTemplate}
                open={editorOpen}
                onCancel={() => setEditorOpen(false)}
                onSuccess={(name: string, content: string) => {
                    setEditorOpen(false);
                    createPromptTemplate(name, content);
                }}
                onRestore={() => setArchivePromptTemplate(focusedPromptTemplate, false)}
            />

            {!hideTitle ? (
                <Typography variant="h1" sx={{ m: 0 }}>
                    Prompt Templates
                </Typography>
            ) : null}

            <DataGrid
                loading={
                    deletedPromptTemplateInfo.loading ||
                    postPromptTemplateInfo.loading ||
                    allPromptTemplateInfo.loading
                }
                rows={allPromptTemplateInfo.data || []}
                columns={promptTemplateColumns}
                initialState={{
                    pagination: {
                        paginationModel: {
                            pageSize: 25,
                        },
                    },
                }}
                pageSizeOptions={[10, 25, 50, 100]}
                disableRowSelectionOnClick
                slots={{
                    footer: () => (
                        <Box alignSelf="end" sx={{ mt: 2 }}>
                            <Button
                                variant="contained"
                                endIcon={<AddIcon />}
                                aria-label="Create New"
                                onClick={() => {
                                    setFocusedPromptTemplate(undefined);
                                    setEditorOpen(true);
                                }}>
                                Create New Prompt Template
                            </Button>
                        </Box>
                    ),
                }}
            />
        </Box>
    );
};
