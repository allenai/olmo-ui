import { css } from '@allenai/varnish-panda-runtime/css';
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

const group = css({
    display: 'flex',
    alignItems: 'center',
    border: '1px solid',
    borderColor: 'gray.60',
    width: '[fit-content]',
});

const input = css({
    border: 'none',
});

const popover = css({
    width: '[20rem]',
});

const button = css({
    border: '2px solid',
    borderColor: 'gray.100',
    borderRadius: 'sm',
    padding: '[0]',
    color: 'text',
});

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
            <AriaGroup className={group}>
                <Input className={input} />
                <Button className={button}>▼</Button>
            </AriaGroup>
            <Popover className={popover}>
                <ListBox>
                    {items.map((item) => (
                        <ListBoxItem key={itemToKey(item)}>{itemToLabel(item)}</ListBoxItem>
                    ))}
                </ListBox>
            </Popover>
        </AriaComboBox>
    );
};
