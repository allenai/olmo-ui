import SearchIcon from '@mui/icons-material/Search';
import { Box, Fab } from '@mui/material';
import { useEffect, useRef, useState } from 'react';
import * as React from 'react';

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
        selectedText = selectedText.replace(/"/g, '\\"');
        if (selectedText.includes(' ')) {
            selectedText = `"${selectedText}"`;
        }
        params.set('query', selectedText);
        window.location.href = `https://dolma.allen.ai/search?${params}`;
    },
};

interface Props extends React.PropsWithChildren {
    // ordered list of menu options
    menuOptions?: MenuOption[];
}

export const ContextMenu = ({
    menuOptions = [SearchTrainingDatasetMenuOption],
    children,
}: Props) => {
    const [contextPos, setContextPos] = useState<{
        mouseX: number;
        mouseY: number;
    }>({
        mouseX: 0,
        mouseY: 0,
    });

    const [showMenu, setShowMenu] = useState<boolean>(false);
    const [selText, setSelText] = useState<string>();

    const divRef = useRef<HTMLDivElement | null>(null);

    const getSelectionText = (): string | undefined => {
        if (!window.getSelection) {
            return undefined;
        }
        return window.getSelection()?.toString();
    };

    const buttonHeight = 56;
    const menuShiftY = buttonHeight * menuOptions.length;

    const handleOpen = (event: MouseEvent, text?: string) => {
        // only update pos if text has changed, this keeps us from movoing when we click click on the toggle menu
        if (selText !== text) {
            let clientX = event.clientX;
            let clientY = event.clientY;
            const elementOffset = divRef.current?.getBoundingClientRect();
            if (elementOffset) {
                clientX -= elementOffset.x;
                clientY -= elementOffset.y;
            }
            setContextPos({
                mouseX: clientX,
                mouseY: clientY - menuShiftY,
            });
        }
        setShowMenu(true);
    };

    const handleClose = () => {
        setShowMenu(false);
    };

    const handleMouseUp = (event: MouseEvent) => {
        const text = getSelectionText();
        if (text) {
            handleOpen(event, text);
        } else {
            handleClose();
        }
        setSelText(text);
    };

    useEffect(() => {
        const targetElement = divRef.current;
        if (targetElement && menuOptions.length > 0) {
            targetElement.addEventListener('mouseup', handleMouseUp);
            return () => {
                targetElement.removeEventListener('mouseup', handleMouseUp);
            };
        }
    }, [selText]);

    if (!menuOptions.length) {
        return <>{children}</>;
    }

    return (
        <Box sx={{ position: 'relative' }} ref={divRef}>
            {children}
            {showMenu
                ? menuOptions.map((action, i) => (
                      <Fab
                          sx={{
                              position: 'absolute',
                              top: contextPos.mouseY + i * buttonHeight,
                              left: contextPos.mouseX,
                          }}
                          size="small"
                          variant="extended"
                          aria-label={action.label}
                          key={action.label}
                          onClick={() => {
                              action.action(
                                  getSelectionText() || '',
                                  contextPos.mouseX,
                                  contextPos.mouseY
                              );
                          }}>
                          {action.icon}
                      </Fab>
                  ))
                : null}
        </Box>
    );
};
