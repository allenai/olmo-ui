import { css } from '@allenai/varnish-panda-runtime/css';
import { hstack } from '@allenai/varnish-panda-runtime/patterns';
import { Button, Switch } from '@allenai/varnish-ui';
import InfoOutlinedIcon from '@mui/icons-material/InfoOutlined';
import { IconButton } from '@mui/material';
import Typography from '@mui/material/Typography';
import { useRef, useState } from 'react';

import { ResponsiveTooltip } from '@/components/thread/ResponsiveTooltip';
import { useQueryContext } from '@/contexts/QueryContext';

import { TOOL_CALLING_INFO } from './toolCallingConsts';
import { ToolsDialog } from './ToolsDialog/ToolsDialog';

const TOOL_CALL_DISPLAY_LABEL = 'This model allows tool calling';
const TOOL_CALL_TOOLTIP_LABEL = 'Tool calling';

const toolCallDisplayContainer = css({
    backgroundColor: {
        base: 'white',
        _dark: 'elements.overlay.background',
    },
    paddingInline: '5',
    paddingBlockStart: '2', // icon has extra padding
    paddingBlockEnd: '3',
    borderRadius: 'lg',
    display: 'grid',
    gap: '2',
    justifyItems: 'center',
});

const toolEditControsls = css({
    display: 'flex',
    gap: '3',
    margin: 'auto',
    alignItems: 'center',
    fontSize: 'sm',
});

const buttonWrapperWithDivider = css({
    _before: {
        // this `/` separates the display from the screen reader text
        // which causes this, in particular, to be ignored
        content: '"|" / ""',
        display: 'inline-block',
        fontWeight: 'medium',
        fontSize: 'sm',
        paddingInlineEnd: '1',
    },
});

const ToolCallDisplayToggle = () => {
    const { isToolCallingEnabled, updateIsToolCallingEnabled } = useQueryContext();

    const [isToolsDialogOpen, setToolsDialogOpen] = useState(false);
    const handleClose = () => {
        setToolsDialogOpen(false);
    };

    const containerRef = useRef<HTMLDivElement>(null);
    const inputLabelId = 'tool-call-display-label';
    const inputId = 'tool-call-display';

    const [isTooltipOpen, setIsTooltipOpen] = useState(false);
    const toggleTooltipOpen = () => {
        setIsTooltipOpen(!isTooltipOpen);
    };

    const handleTooltipClose = () => {
        setIsTooltipOpen(false);
    };

    const handleToolDialogOpen = () => {
        setToolsDialogOpen(true);
    };

    return (
        <>
            <div ref={containerRef} className={toolCallDisplayContainer}>
                <div className={hstack({ alignItems: 'center' })}>
                    <Typography
                        variant="body1"
                        component="label"
                        htmlFor={inputId}
                        id={inputLabelId}>
                        {TOOL_CALL_DISPLAY_LABEL}
                    </Typography>
                    <ResponsiveTooltip
                        anchorEl={containerRef.current}
                        dialogTitle={TOOL_CALL_TOOLTIP_LABEL}
                        dialogContent={TOOL_CALLING_INFO}
                        isTooltipOpen={isTooltipOpen}
                        onTooltipClose={handleTooltipClose}
                        tooltipIdSuffix={`${inputId}-description`}
                        placement="left">
                        <IconButton
                            tabIndex={0}
                            aria-expanded={isTooltipOpen}
                            sx={{ color: 'inherit', justifySelf: 'left', opacity: '50%' }}
                            onClick={toggleTooltipOpen}
                            aria-label={`Show description for ${TOOL_CALL_TOOLTIP_LABEL}`}
                            onKeyDown={(event) => {
                                // This is currently used in the parameters drawer that has ESC handling as well
                                // we need to stop propagation so the drawer doesn't close when we  just want to close the tooltip
                                event.stopPropagation();

                                if (event.key === 'Escape') {
                                    handleTooltipClose();
                                }
                            }}>
                            <InfoOutlinedIcon />
                        </IconButton>
                    </ResponsiveTooltip>
                </div>
                <div className={toolEditControsls}>
                    <span>Enable</span>
                    <Switch
                        size="large"
                        isSelected={isToolCallingEnabled}
                        onChange={updateIsToolCallingEnabled}
                        aria-labelledby={inputLabelId}
                    />
                    <div className={buttonWrapperWithDivider}>
                        <Button
                            size="medium"
                            color="primary"
                            variant="text"
                            className={css({
                                paddingInline: '2',
                            })}
                            onClick={handleToolDialogOpen}>
                            Add or edit tools
                        </Button>
                    </div>
                </div>
            </div>
            <ToolsDialog isOpen={isToolsDialogOpen} onClose={handleClose} />
        </>
    );
};

export const ToolCallDisplay = () => {
    const { canCallTools } = useQueryContext();

    if (!canCallTools) {
        return null;
    }

    return <ToolCallDisplayToggle />;
};
