import { ReactNode, useMemo } from 'react';
import { useMatches } from 'react-router-dom';

interface HandleWithRouteControls {
    pageControls?: ReactNode;
}

export const useRouteControls = () => {
    const matches = useMatches();

    const lowestHandle = useMemo(
        () =>
            matches
                // This is unfortunately the recommended way to handle this typing.
                // I don't think there's a way to properly type this
                .filter(
                    (match) =>
                        Boolean(match.handle) &&
                        (match.handle as HandleWithRouteControls).pageControls != null
                )
                .map((match) => match.handle as HandleWithRouteControls)
                .at(-1),
        [matches]
    );

    return lowestHandle?.pageControls;
};
