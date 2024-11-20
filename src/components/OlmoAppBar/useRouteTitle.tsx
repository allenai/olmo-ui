import { useMatches } from 'react-router-dom';

interface HandleWithTitle {
    title?: string;
}

export const useRouteTitle = () => {
    const matches = useMatches();
    const handles = matches
        // This is unfortunately the recommended way to handle this typing.
        // I don't think there's a way to properly type this
        // eslint-disable-next-line @typescript-eslint/no-unnecessary-condition
        .filter((match) => Boolean(match.handle) && (match.handle as HandleWithTitle).title != null)
        .map((match) => match.handle as HandleWithTitle);

    const lowestHandle = handles[handles.length - 1];

    return { ...lowestHandle };
};
