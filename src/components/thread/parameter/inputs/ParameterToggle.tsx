import { stack } from '@allenai/varnish-panda-runtime/patterns';
import { Button, Switch } from '@allenai/varnish-ui';

import { ParameterDrawerInputWrapper } from './ParameterDrawerInputWrapper';

interface Props {
    label: string;
    value?: boolean;
    dialogContent: string;
    dialogTitle: string;
    disableEditButton?: boolean;
    disableToggle?: boolean;
    onEditClick?: () => void;
    onToggleChange?: (value: boolean) => void;
    id: string;
}

export const ParameterToggle = ({
    label,
    value = false,
    dialogContent,
    dialogTitle,
    disableEditButton = false,
    disableToggle = false,
    onEditClick,
    onToggleChange,
    id,
}: Props) => {
    const viewOnly = disableToggle && !disableEditButton;

    return (
        <ParameterDrawerInputWrapper
            inputId={id}
            label={label}
            gridTemplateRows="auto"
            gridTemplateColumns="2fr 1fr"
            gridTemplateAreas="'label input'"
            aria-label={`Show description for ${label}`}
            tooltipContent={dialogContent}
            tooltipTitle={dialogTitle}>
            {({ inputLabelId }) => (
                <div
                    className={stack({
                        direction: 'row',
                        justify: 'end',
                        align: 'center',
                        gap: '1',
                    })}>
                    <Button
                        size="small"
                        color="primary"
                        variant="text"
                        onClick={onEditClick}
                        isDisabled={disableEditButton}
                        aria-label={`Edit ${label}`}>
                        {viewOnly ? 'View' : 'Edit'}
                    </Button>
                    <Switch
                        size="large"
                        isSelected={value}
                        isDisabled={disableToggle}
                        onChange={onToggleChange}
                        aria-labelledby={inputLabelId}
                    />
                </div>
            )}
        </ParameterDrawerInputWrapper>
    );
};
