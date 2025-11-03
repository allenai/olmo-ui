import { AddBoxOutlined } from '@mui/icons-material';
import { alpha } from '@mui/material';
import { useSearchParams } from 'react-router-dom';

import { useAppContext } from '@/AppContext';
import { useDesktopOrUp } from '@/components/dolma/shared';
import { IconButtonWithTooltip } from '@/components/IconButtonWithTooltip';
import { DESKTOP_LAYOUT_BREAKPOINT } from '@/constants';
import { links } from '@/Links';
import { PARAM_SELECTED_MODEL } from '@/pages/queryParameterConsts';

export const NewThreadIconButton = ({
    includeModelIdParam = true,
}: {
    includeModelIdParam?: boolean;
}) => {
    // Checking for falsey here because the initial value is an empty string
    const shouldHideNewThreadButton = useAppContext((state) => !state.selectedThreadRootId);
    const isDesktop = useDesktopOrUp();

    const [searchParams] = useSearchParams();
    const modelId = searchParams.get(PARAM_SELECTED_MODEL);

    const urlToGoto =
        modelId && includeModelIdParam ? `${links.playground}?model=${modelId}` : links.playground;

    if (shouldHideNewThreadButton && isDesktop) {
        return null;
    }

    return (
        <IconButtonWithTooltip
            desktopPlacement="left"
            disabled={shouldHideNewThreadButton}
            href={urlToGoto}
            label="Create a new thread"
            sx={(theme) => ({
                [theme.breakpoints.down(DESKTOP_LAYOUT_BREAKPOINT)]: {
                    '&.Mui-disabled': {
                        color: alpha(theme.palette.common.white, 0.26),
                    },
                },
            })}>
            <AddBoxOutlined />
        </IconButtonWithTooltip>
    );
};
