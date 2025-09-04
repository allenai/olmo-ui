import { SelectListBoxItem, SelectListBoxSection } from '@allenai/varnish-ui';
import type { ComponentProps } from 'react';

import { ControlledSelect } from '@/components/form/ControlledSelect';

import { modelHostMeta } from '../../../modelHostMeta';

interface ModelHostSelectProps {
    name: string;
    label: string;
    controllerProps?: ComponentProps<typeof ControlledSelect>['controllerProps'];
}
export const ModelHostSelect = ({ name, label, controllerProps }: ModelHostSelectProps) => {
    return (
        <ControlledSelect name={name} label={label} controllerProps={controllerProps}>
            <SelectListBoxSection>
                {Object.entries(modelHostMeta).map(([id, meta]) => (
                    <SelectListBoxItem text={meta.friendlyName} id={id} key={id} />
                ))}
            </SelectListBoxSection>
        </ControlledSelect>
    );
};
