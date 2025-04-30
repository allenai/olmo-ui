import { ReactNode } from 'react';
import {
    GridListItem as AriaGridListItem,
    GridListItemProps as AriaGridListItemProps,
} from 'react-aria-components';

type GridListItemProps<T extends object> = {
    children?: ReactNode;
    className?: string;
} & AriaGridListItemProps<T>;

export const GridListItem = <T extends object>({
    className,
    children,
    ...rest
}: GridListItemProps<T>) => (
    <AriaGridListItem className={className} {...rest}>
        {children}
    </AriaGridListItem>
);
