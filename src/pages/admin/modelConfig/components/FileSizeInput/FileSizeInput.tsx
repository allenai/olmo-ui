import { SelectListBoxItem, Stack } from '@allenai/varnish-ui';

import { ControlledInput } from '@/components/form/ControlledInput';
import { ControlledSelect } from '@/components/form/ControlledSelect';

export const FileSizeInput = () => {
    return (
        <Stack direction="row" spacing={10}>
            <ControlledInput
                name="fileSize.amount"
                label="File Size"
                controllerProps={{ rules: { required: true } }}
            />
            <ControlledSelect
                name="fileSize.unit"
                label="Unit"
                controllerProps={{ rules: { required: true } }}>
                <SelectListBoxItem id="kib" text="KiB" textValue="KiB" />
                <SelectListBoxItem id="mib" text="MiB" textValue="MiB" />
            </ControlledSelect>
        </Stack>
    );
};
