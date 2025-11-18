import { type PropsWithChildren, useContext } from 'react';
import { Button, DisclosureStateContext } from 'react-aria-components';

/*
 * The react-aria button slot="target" doesn't work inside the panel
 *   So this component hooks into state and handles it "manually"
 */
export const CollapseButton = ({
    className,
    children,
}: PropsWithChildren<{ className?: string }>) => {
    const disclosureState = useContext(DisclosureStateContext);

    const toggleDisclosure = () => {
        disclosureState?.toggle();
    };

    return (
        <Button onPress={toggleDisclosure} className={className}>
            {children}
        </Button>
    );
};
