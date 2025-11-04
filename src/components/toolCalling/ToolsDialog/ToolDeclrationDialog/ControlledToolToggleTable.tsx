import { css } from '@allenai/varnish-panda-runtime/css';
import { type ReactNode } from 'react';
import { type UseControllerProps } from 'react-hook-form';

import { Model } from '@/api/playgroundApi/additionalTypes';

import { DataFields } from './ToolDeclarationDialog';
import { groupTools } from './toolDeclarationUtils';
import { ToolGroupSection } from './ToolGroupSection';

interface ControlledToggleTableProps {
    control?: Omit<UseControllerProps<DataFields>, 'name'>;
    tools: Model['available_tools'];
    isDisabled?: boolean;
}

const toolGroupWrapperClassName = css({
    display: 'grid',
    gap: '4',
});

export const ControlledToolToggleTable = ({
    control,
    tools,
    isDisabled,
}: ControlledToggleTableProps): ReactNode => {
    const groupedTools = groupTools(tools);

    return (
        <div className={toolGroupWrapperClassName}>
            {Object.entries(groupedTools).map(([toolGroupName, tools]) => (
                <ToolGroupSection
                    key={toolGroupName}
                    toolGroupName={toolGroupName}
                    groupTools={tools}
                    isDisabled={isDisabled}
                    control={control}
                />
            ))}
        </div>
    );
};
