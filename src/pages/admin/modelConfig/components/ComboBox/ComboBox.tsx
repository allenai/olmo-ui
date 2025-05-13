import { Button, Input, Label, Popover } from '@allenai/varnish-ui';
import {
    ComboBox as AriaComboBox,
    ComboBoxProps as AriaComboBoxProps,
    Group as AriaGroup,
    ListBox,
    ListBoxItem,
} from 'react-aria-components';

type ComboBoxProp<T extends object> = {
    label: string;
    items: T[];
    itemToKey: (item: T) => string;
    itemToLabel: (item: T) => string;
} & AriaComboBoxProps<T>;

export const ComboBox = <T extends object>({
    label,
    items,
    itemToKey,
    itemToLabel,
    ...rest
}: ComboBoxProp<T>) => {
    return (
        <AriaComboBox {...rest}>
            <Label>{label}</Label>
            <AriaGroup>
                <Input />
                <Button>▼</Button>
            </AriaGroup>
            <Popover>
                <ListBox>
                    {items.map((item) => (
                        <ListBoxItem key={itemToKey(item)}>{itemToLabel(item)}</ListBoxItem>
                    ))}
                </ListBox>
            </Popover>
        </AriaComboBox>
    );
};
