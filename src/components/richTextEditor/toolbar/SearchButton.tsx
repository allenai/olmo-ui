import React from 'react';
import SearchIcon from '@mui/icons-material/Search';

import { ToolbarButton } from './ToolbarButton';

// custom button added to toolbar to search the pretraining data
export const SearchButton = ({
    selection,
    className,
}: {
    selection?: string;
    className?: string;
}) => {
    const onClick = () => {
        // Get block for current selection
        let selectedText = selection || '';
        const params = new URLSearchParams();
        selectedText = selectedText.replace(/"/g, '\\"');
        if (selectedText.indexOf(' ') !== -1) {
            selectedText = `"${selectedText}"`;
        }
        params.set('query', selectedText);
        // open in a new window
        window.open(`https://dolma.allen.ai/search?${params}`, '_blank');
    };

    return (
        <ToolbarButton tooltip="Search Pretraining Data" onClick={onClick} className={className}>
            <SearchIcon />
        </ToolbarButton>
    );
};
