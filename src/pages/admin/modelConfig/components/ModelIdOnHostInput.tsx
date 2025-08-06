import type { ComponentProps, ReactNode } from 'react';
import { useFormContext } from 'react-hook-form';

import { ControlledInput } from '@/components/form/ControlledInput';

import { modelHostMeta } from '../modelHostMeta';
import type { ModelConfigFormValues } from './ModelConfigForm';

interface ModelIdOnHostInputProps {
    name: string;
    // TODO: I want to make this configurable but I don't want to tinker with the TS types to make it so we match something in ModelConfigFormValues but only allow keys with a string value
    hostKey: 'host';
    className?: string;
    fullWidth?: boolean;
    controllerProps?: ComponentProps<typeof ControlledInput>['controllerProps'];
}

export const ModelIdOnHostInput = ({
    name,
    className,
    hostKey,
    fullWidth,
    controllerProps,
}: ModelIdOnHostInputProps): ReactNode => {
    const formContext = useFormContext<ModelConfigFormValues>();

    const modelHostSelection = formContext.watch(hostKey);
    const hostMeta = modelHostSelection ? modelHostMeta[modelHostSelection].hostIdMeta : null;

    const modelHostIdLabel = (modelHostSelection && hostMeta?.label) ?? 'Model Host Id';
    const modelHostIdDescription =
        (modelHostSelection && hostMeta?.description) ?? 'The ID of this model on the host';

    return (
        <ControlledInput
            name={name}
            label={modelHostIdLabel}
            fullWidth={fullWidth}
            // @ts-expect-error: description can be a ReactNode, not just string
            description={modelHostIdDescription}
            className={className}
            controllerProps={controllerProps}
        />
    );
};
