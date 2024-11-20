import { IconButtonWithTooltip } from "@/components/IconButtonWithTooltip";
import { links } from "@/Links";
import { AddBoxOutlined } from "@mui/icons-material";

export const NewThreadIconButton = () => {
    return (
        <IconButtonWithTooltip href={links.playground} label="Create a new thread">
            <AddBoxOutlined />
        </IconButtonWithTooltip>
    );
};
