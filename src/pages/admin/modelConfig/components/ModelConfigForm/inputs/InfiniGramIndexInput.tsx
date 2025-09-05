import { SelectListBoxItem } from '@allenai/varnish-ui';
import type { ComponentProps } from 'react';

import { availableInfiniGramIndexIdValues } from '@/api/playgroundApi/playgroundApiSchema';
import { ControlledSelect } from '@/components/form/ControlledSelect';

interface InfiniGramIndexInputProps
    extends Omit<ComponentProps<typeof ControlledSelect>, 'children' | 'label'> {
    label?: string;
}

export const InfiniGramIndexInput = ({
    label = 'Infini-gram index',
    ...rest
}: InfiniGramIndexInputProps) => {
    return (
        <ControlledSelect label={label} {...rest}>
            {availableInfiniGramIndexIdValues.map((id) => (
                <SelectListBoxItem key={id} id={id} text={id} textValue={id} />
            ))}
        </ControlledSelect>
    );
};
