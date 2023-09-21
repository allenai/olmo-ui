import React from 'react';
import styled from 'styled-components';
import { Dialog, DialogTitle, Tooltip } from '@mui/material';
import { ToolbarChildrenProps } from '@draft-js-plugins/inline-toolbar/lib/components/Toolbar';
import { convertToRaw } from 'draft-js';

import LibraryBooksIcon from '@mui/icons-material/LibraryBooks';

import { CustomButton, CustomButtonWrapper } from './Toolbar';

// custom button added to toolbar to search the pretraining data
export const LogRawButton = (props: ToolbarChildrenProps) => {
    const [rawModalOpen, setMetadataModalOpen] = React.useState(false);
    const handleModalOpen = () => setMetadataModalOpen(true);
    const handleModalClose = () => setMetadataModalOpen(false);

    const RawModal = () => {
        return (
            <Dialog disableRestoreFocus onClose={handleModalClose} open={rawModalOpen}>
                <Metadata>
                    {JSON.stringify(
                        convertToRaw(props.getEditorState().getCurrentContent()),
                        null,
                        4
                    )}
                </Metadata>
            </Dialog>
        );
    };

    // When using a click event inside overridden content, mouse down
    // events needs to be prevented so the focus stays in the editor
    // and the toolbar remains visible
    const onMouseDown = (event: React.MouseEvent) => event.preventDefault();

    const onClick = () => {
        handleModalOpen();
    };

    return (
        <>
            <CustomButtonWrapper onMouseDown={onMouseDown}>
                <CustomButton onClick={onClick}>
                    <Tooltip title="Copy Raw Data">
                        <LibraryBooksIcon />
                    </Tooltip>
                </CustomButton>
            </CustomButtonWrapper>
            <RawModal />
        </>
    );
};

const Metadata = styled(DialogTitle)`
    white-space: pre;
`;
