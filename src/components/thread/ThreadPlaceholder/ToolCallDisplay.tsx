import { css } from '@allenai/varnish-panda-runtime/css';

import { useQueryContext } from '@/contexts/QueryContext';
import { RemoteState } from '@/contexts/util';

import { ToolCallingToggle } from '../parameter/ToolCallingInput';

const toolCallDisplayContainer = css({
    backgroundColor: 'elements.overlay.background',
    paddingInline: '6',
    borderRadius: 'lg',
});

export const ToolCallDisplay = () => {
    const { canCallTools, remoteState } = useQueryContext();

    const isLoading = remoteState === RemoteState.Loading;

    if (!canCallTools) {
        return null;
    }

    return (
        <div aria-disabled={true} className={toolCallDisplayContainer}>
            <ToolCallingToggle
                label="This model allows tool calling."
                tooltipPlacement="bottom"
                disabled={isLoading}
            />
        </div>
    );
};
