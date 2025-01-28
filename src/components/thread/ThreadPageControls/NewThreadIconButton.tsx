import { AddBoxOutlined } from '@mui/icons-material';

import { useAppContext } from '@/AppContext';
import { IconButtonWithTooltip } from '@/components/IconButtonWithTooltip';
import { links } from '@/Links';

export const NewThreadIconButton = () => {
    // Checking for falsey here because the initial value is an empty string
    const shouldHideNewThreadButton = useAppContext((state) => !state.selectedThreadRootId);

    if (shouldHideNewThreadButton) {
        return null;
    }

    return (
        <IconButtonWithTooltip
            desktopPlacement="left"
            href={links.playground}
            label="Create a new thread">
            <AddBoxOutlined />
        </IconButtonWithTooltip>
    );
};
