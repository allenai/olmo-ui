import { css } from '@allenai/varnish-panda-runtime/css';
import { Switch } from '@allenai/varnish-ui';
import InfoOutlinedIcon from '@mui/icons-material/InfoOutlined';
import { IconButton } from '@mui/material';
import Typography from '@mui/material/Typography';
import { useRef, useState } from 'react';

import { ResponsiveTooltip } from '@/components/thread/ResponsiveTooltip';
import { useQueryContext } from '@/contexts/QueryContext';

import { TOOL_CALLING_INFO } from './toolCallingConsts';

const TOOL_CALL_DISPLAY_LABEL = 'This model allows tool calling';
const TOOL_CALL_TOOLTIP_LABEL = 'Tool calling';

const ToolCallDisplayToggle = () => {
    const { isToolCallingEnabled, updateIsToolCallingEnabled } = useQueryContext();

    const containerRef = useRef<HTMLElement>();
    const inputLabelId = 'tool-call-display-label';
    const inputId = 'tool-call-display';

    const [isTooltipOpen, setIsTooltipOpen] = useState(false);
    const toggleTooltipOpen = () => {
        setIsTooltipOpen(!isTooltipOpen);
    };

    const handleTooltipClose = () => {
        setIsTooltipOpen(false);
    };

    return (
        <div>
            <Typography variant="body1" component="label" htmlFor={inputId} id={inputLabelId}>
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
            <Switch
                size="large"
                isSelected={isToolCallingEnabled}
                onChange={updateIsToolCallingEnabled}
                aria-labelledby={inputLabelId}
            />
        </div>
    );
};

const toolCallDisplayContainer = css({
    backgroundColor: 'elements.overlay.background',
    paddingInline: '6',
    borderRadius: 'lg',
});

export const ToolCallDisplay = () => {
    const { canCallTools } = useQueryContext();

    if (!canCallTools) {
        return null;
    }

    return (
        <div aria-disabled={true} className={toolCallDisplayContainer}>
            <ToolCallDisplayToggle />
        </div>
    );
};
