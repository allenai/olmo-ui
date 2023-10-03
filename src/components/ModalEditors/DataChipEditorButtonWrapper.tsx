import React, { useState } from 'react';
import { ButtonProps } from '@mui/material';

import { DataChip } from '../../api/DataChip';
import { DataChipEditor } from './DataChipEditor';

// pass in a control, and when they user clicks on it, we pop open the modal
// using the seedContent as default content.
export interface Props {
    seedContent?: string;
    chip?: DataChip;
    renderButton: (props: ButtonProps) => React.ReactElement<ButtonProps>;
}
export const DataChipEditorButtonWrapper = ({ seedContent, chip, renderButton }: Props) => {
    const [editorOpen, setEditorOpen] = useState(false);

    // likely to be replaced with a direct call to app context
    const createChip = (name: string, content: string) => {
        console.log(`todo: make new chip: ${name}`, content);
    };

    // likely to be replaced with a direct call to app context
    const setArchiveChip = (chip: DataChip | undefined, value: boolean) => {
        if (chip) {
            console.log(`todo: ${value ? 'archive' : 'restore'} chip: ${chip.name}`);
        }
    };

    return (
        <>
            {renderButton({
                onClick: () => {
                    setEditorOpen(true);
                },
            })}
            <DataChipEditor
                chip={chip}
                seedContent={seedContent}
                open={editorOpen}
                onCancel={() => setEditorOpen(false)}
                onSuccess={(name: string, content: string) => {
                    setEditorOpen(false);
                    createChip(name, content);
                }}
                onRestore={() => setArchiveChip(chip, false)}
            />
        </>
    );
};
