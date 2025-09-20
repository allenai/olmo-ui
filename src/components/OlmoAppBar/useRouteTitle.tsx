import { useMemo } from 'react';
import { useMatches } from 'react-router';

interface HandleWithTitle {
    title?: string;
}

export const useRouteTitle = () => {
    const matches = useMatches();

    const lowestHandle = useMemo(
        () =>
            matches
                // This is unfortunately the recommended way to handle this typing.
                // I don't think there's a way to properly type this
                .filter(
                    (match) =>
                        Boolean(match.handle) && (match.handle as HandleWithTitle).title != null
                )
                .map((match) => match.handle as HandleWithTitle)
                .at(-1),
        [matches]
    );

    return lowestHandle?.title;
};
