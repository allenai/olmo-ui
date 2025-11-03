import { AddBoxOutlined } from '@mui/icons-material';
import { alpha } from '@mui/material';
import { useParams, useSearchParams } from 'react-router-dom';

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
    const { id: threadId } = useParams();
    const isDesktop = useDesktopOrUp();

    const [searchParams] = useSearchParams();
    const modelId = searchParams.get(PARAM_SELECTED_MODEL);

    const urlToGoto =
        modelId && includeModelIdParam
            ? `${links.playground}?${PARAM_SELECTED_MODEL}=${modelId}`
            : links.playground;

    if (isDesktop) {
        return null;
    }

    return (
        <IconButtonWithTooltip
            desktopPlacement="left"
            disabled={!threadId}
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
