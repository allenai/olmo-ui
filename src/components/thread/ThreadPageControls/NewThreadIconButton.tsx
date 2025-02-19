import { AddBoxOutlined } from '@mui/icons-material';

import { useAppContext } from '@/AppContext';
import { useDesktopOrUp } from '@/components/dolma/shared';
import { IconButtonWithTooltip } from '@/components/IconButtonWithTooltip';
import { links } from '@/Links';

export const NewThreadIconButton = () => {
    // Checking for falsey here because the initial value is an empty string
    const shouldHideNewThreadButton = useAppContext((state) => !state.selectedThreadRootId);
    const isDesktop = useDesktopOrUp();

    if (shouldHideNewThreadButton && isDesktop) {
        return null;
    }

    return (
        <IconButtonWithTooltip
            desktopPlacement="left"
            disabled={shouldHideNewThreadButton}
            href={links.playground}
            label="Create a new thread">
            <AddBoxOutlined />
        </IconButtonWithTooltip>
    );
};
