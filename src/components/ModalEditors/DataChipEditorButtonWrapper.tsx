import React, { useState } from 'react';
import { ButtonProps } from '@mui/material';

import { DataChip, DataChipPost } from '../../api/DataChip';
import { DataChipEditor } from './DataChipEditor';
import { useDataChip } from '../../contexts/dataChipContext';
import { RemoteState } from '../../contexts/util';

// pass in a control, and when they user clicks on it, we pop open the modal
// using the seedContent as default content.
export interface Props {
    seedContent?: string;
    chip?: DataChip;
    renderButton: (props: ButtonProps) => React.ReactElement<ButtonProps>;
}

export const DataChipEditorButtonWrapper = ({ seedContent, chip, renderButton }: Props) => {
    const { remoteState, createDataChip, patchDataChip } = useDataChip();
    const [editorOpen, setEditorOpen] = useState(false);
    const [isLoading, setIsLoading] = useState(remoteState === RemoteState.Loading);

    const updateChip = (chipId: string | undefined, value: boolean) => {
        if (chipId) {
            setIsLoading(true);
            patchDataChip(chipId, { deleted: value }).finally(() => {
                setIsLoading(false);
                setEditorOpen(false);
            });
        }
    };

    const newChip = (newValue: DataChipPost) => {
        setIsLoading(true);
        createDataChip(newValue).finally(() => {
            setIsLoading(false);
            setEditorOpen(false);
        });
    };

    return (
        <>
            {renderButton({
                onClick: (event: React.MouseEvent) => {
                    setEditorOpen(true);
                    // if we click this button, not continue the event
                    event.stopPropagation();
                },
            })}
            <DataChipEditor
                isLoading={isLoading || remoteState === RemoteState.Loading}
                chip={chip}
                seedContent={seedContent}
                open={editorOpen}
                onCancel={() => setEditorOpen(false)}
                onSuccess={(name: string, content: string) => {
                    newChip({ name, content });
                }}
                onRestore={() => updateChip(chip?.id, false)}
            />
        </>
    );
};
