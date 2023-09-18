import React, { useState } from 'react';
import { Menu, MenuItem } from '@mui/material';

import { useFeatureToggles } from '../FeatureToggleContext';

export interface MenuOption {
    label: string;
    action: (selectedText: string, mouseX?: number, mouseY?: number) => void;
}

// default implementation of searching the training datasets on the selected text
export const SearchTrainingDatasetMenuOption: MenuOption = {
    label: 'Search Training Datasets',
    action: (selectedText: string) => {
        window.location.href = `/search?query="${selectedText}"`;
    },
};

// default implementation of copy of the selected text
export const CopyMenuOption: MenuOption = {
    label: 'Copy',
    action: (selectedText: string) => {
        navigator.clipboard.writeText(selectedText);
    },
};

interface Props extends React.PropsWithChildren {
    // ordered list of menu options
    menuOptions?: MenuOption[];
}

export const ContextMenu = ({
    menuOptions = [SearchTrainingDatasetMenuOption, CopyMenuOption],
    children,
}: Props) => {
    const toggles = useFeatureToggles();

    if (!toggles.contextMenu || !menuOptions.length) {
        return <>{children}</>;
    }

    const [contextMenu, setContextMenu] = useState<{
        mouseX: number;
        mouseY: number;
    } | null>(null);

    const getSelectionText = () => {
        let text = '';
        if (window.getSelection) {
            const sel = window.getSelection();
            text = sel?.toString() || '';
        }
        return text;
    };

    const handleContextMenu = (event: React.MouseEvent) => {
        event.preventDefault();
        setContextMenu(
            contextMenu === null
                ? {
                      mouseX: event.clientX + 2,
                      mouseY: event.clientY - 6,
                  }
                : // repeated contextmenu when it is already open closes it with Chrome 84 on Ubuntu
                  // Other native context menus might behave different.
                  // With this behavior we prevent contextmenu from the backdrop to re-locale existing context menus.
                  null
        );
    };

    const handleClose = () => {
        setContextMenu(null);
    };

    return (
        // eslint-disable-next-line jsx-a11y/no-static-element-interactions
        <div onContextMenu={handleContextMenu} style={{ cursor: 'context-menu' }}>
            {children}
            <Menu
                open={contextMenu !== null}
                onClose={handleClose}
                anchorReference="anchorPosition"
                anchorPosition={
                    contextMenu !== null
                        ? { top: contextMenu.mouseY, left: contextMenu.mouseX }
                        : undefined
                }>
                {menuOptions.map((mo) => (
                    <MenuItem
                        key={mo.label}
                        onClick={() => {
                            handleClose();
                            mo.action(getSelectionText(), contextMenu?.mouseX, contextMenu?.mouseY);
                        }}>
                        {mo.label}
                    </MenuItem>
                ))}
            </Menu>
        </div>
    );
};
