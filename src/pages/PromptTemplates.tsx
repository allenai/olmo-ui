import { useState, useEffect } from 'react';
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
import { PromptTemplate, PromptTemplatePost } from '../api/PromptTemplate';
import { PromptTemplateEditor } from '../components/ModalEditors/PromptTemplateEditor';
import { dateTimeFormat } from '../util';
import { RemoteState } from '../contexts/util';

export const PromptTemplates = ({ hideTitle }: { hideTitle?: boolean }) => {
    const { userInfo } = useAppContext();
    const {
        remoteState,
        promptTemplateList,
        getPromptTemplateList,
        createPromptTemplate,
        patchPromptTemplate,
    } = useAppContext();

    const [isLoading, setIsLoading] = useState(false);
    const [filteredPromptTemplates, setFilteredPromptTemplates] = useState<PromptTemplate[]>([]);
    const [promptTemplatesLoading, setPromptTemplatesLoading] = useState(
        remoteState === RemoteState.Loading
    );
    const getPromptTemplates = async function () {
        setPromptTemplatesLoading(true);
        getPromptTemplateList(true).finally(() => {
            setPromptTemplatesLoading(false);
        });
    };

    useEffect(() => {
        getPromptTemplates();
    }, []);

    useEffect(() => {
        setFilteredPromptTemplates(
            promptTemplateList.filter((promptTemplate) => {
                return userInfo.data?.client === promptTemplate.creator || !promptTemplate.deleted;
            })
        );
    }, [promptTemplateList]);

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
            renderCell: (params: GridRenderCellParams<PromptTemplate>) => {
                return userInfo.data?.client === params.row.creator ? (
                    <>
                        {!params.row.deleted ? (
                            <IconButton
                                aria-label="visible"
                                onClick={() =>
                                    patchPromptTemplate(params.row.id, { deleted: true })
                                }>
                                <VisibilityIcon />
                            </IconButton>
                        ) : (
                            <IconButton
                                aria-label="hidden"
                                onClick={() =>
                                    patchPromptTemplate(params.row.id, { deleted: false })
                                }>
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
                ) : null;
            },
            minWidth: 90,
            flex: 1,
        },
    ];

    const updatePromptTemplate = (promptTemplateId: string | undefined, value: boolean) => {
        if (promptTemplateId) {
            setIsLoading(true);
            patchPromptTemplate(promptTemplateId, { deleted: value }).finally(() => {
                setIsLoading(false);
                setEditorOpen(false);
            });
        }
    };

    const newPromptTemplate = (newValue: PromptTemplatePost) => {
        setIsLoading(true);
        createPromptTemplate(newValue).finally(() => {
            setIsLoading(false);
            setEditorOpen(false);
        });
    };

    return (
        <Box sx={{ width: '100%', background: 'white', p: 2 }}>
            <PromptTemplateEditor
                isLoading={isLoading}
                promptTemplate={focusedPromptTemplate}
                open={editorOpen}
                onCancel={() => setEditorOpen(false)}
                onSuccess={(name: string, content: string) => {
                    newPromptTemplate({ name, content });
                }}
                onRestore={() => updatePromptTemplate(focusedPromptTemplate?.id, false)}
            />

            {!hideTitle ? (
                <Typography variant="h1" sx={{ m: 0 }}>
                    Prompt Templates
                </Typography>
            ) : null}

            <DataGrid
                loading={promptTemplatesLoading}
                rows={filteredPromptTemplates}
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
