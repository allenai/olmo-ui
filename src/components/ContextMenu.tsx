import React, { useState, useEffect, useRef } from 'react';
import { SpeedDial, SpeedDialAction, SpeedDialIcon } from '@mui/material';

import SearchIcon from '@mui/icons-material/Search';
import ContentCopyIcon from '@mui/icons-material/ContentCopy';

import { useFeatureToggles } from '../FeatureToggleContext';

export interface MenuOption {
    label: string;
    icon: JSX.Element;
    action: (selectedText: string, mouseX?: number, mouseY?: number) => void;
}

// default implementation of searching the training datasets on the selected text
export const SearchTrainingDatasetMenuOption: MenuOption = {
    label: 'Search Pretraining Data',
    icon: <SearchIcon />,
    action: (selectedText: string) => {
        const params = new URLSearchParams();
        selectedText = selectedText.replace(/[/"/']/g, '\\"');
        if (selectedText.indexOf(' ') !== -1) {
            selectedText = `"${selectedText}"`;
        }
        params.set('query', selectedText);
        window.location.href = `/search?${params}`;
    },
};

// default implementation of copy of the selected text
export const CopyMenuOption: MenuOption = {
    label: 'Copy',
    icon: <ContentCopyIcon />,
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

    const [contextPos, setContextPos] = useState<{
        mouseX: number;
        mouseY: number;
    }>({
        mouseX: 0,
        mouseY: 0,
    });

    const [showDial, setShowDial] = useState<boolean>(false);

    const divRef = useRef<HTMLDivElement | null>(null);

    const getSelectionText = (): string | undefined => {
        if (!window.getSelection) {
            return undefined;
        }
        return window.getSelection()?.toString();
    };

    const handleOpen = (event: MouseEvent) => {
        let clientX = event.clientX;
        let clientY = event.clientY;
        const elementOffset = divRef.current?.getBoundingClientRect();
        if (elementOffset) {
            clientX -= elementOffset.x;
            clientY -= elementOffset.y;
        }
        setContextPos({
            mouseX: clientX,
            mouseY: clientY,
        });
        setShowDial(true);
    };

    const handleClose = () => {
        setShowDial(false);
    };

    const handleMouseUp = (event: MouseEvent) => {
        const text = getSelectionText();
        if (text) {
            handleOpen(event);
        } else {
            handleClose();
        }
    };

    const handleMouseDown = (_event: MouseEvent) => {
        handleClose();
    };

    useEffect(() => {
        window.addEventListener('mouseup', handleMouseUp);
        window.addEventListener('mousedown', handleMouseDown);
        return () => {
            window.removeEventListener('mouseup', handleMouseUp);
            window.removeEventListener('mousedown', handleMouseDown);
        };
    }, []);

    return (
        <div ref={divRef}>
            {children}
            <SpeedDial
                ariaLabel="Options for selected text"
                hidden={!showDial}
                FabProps={{ size: 'small' }}
                sx={{
                    position: 'absolute',
                    top: contextPos?.mouseY,
                    left: contextPos?.mouseX,
                }}
                icon={<SpeedDialIcon />}>
                {menuOptions.map((action) => (
                    <SpeedDialAction
                        key={action.label}
                        icon={action.icon}
                        tooltipTitle={action.label}
                        onClick={() =>
                            action.action(
                                getSelectionText() || '',
                                contextPos?.mouseX,
                                contextPos?.mouseY
                            )
                        }
                    />
                ))}
            </SpeedDial>
        </div>
    );
};
