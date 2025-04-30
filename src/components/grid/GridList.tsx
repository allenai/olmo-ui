import { ReactNode } from 'react';
import {
    GridList as AriaGridList,
    GridListProps as AriaGridListProps,
} from 'react-aria-components';

type GridListProps<T extends object> = {
    items: T[];
    className?: string;
    children: (item: T) => ReactNode;
} & AriaGridListProps<T>;

export const GridList = <T extends object>({
    items,
    className,
    children,
    ...rest
}: GridListProps<T>) => (
    <AriaGridList className={className} items={items} {...rest}>
        {children}
    </AriaGridList>
);
