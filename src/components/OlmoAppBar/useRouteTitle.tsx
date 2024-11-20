import { useMatches } from 'react-router-dom';

interface HandleWithTitle {
    title: string;
    showTitle?: boolean;
}

export const useRouteTitle = () => {
    const matches = useMatches();
    const handles = matches
        // This is unfortunately the recommended way to handle this typing.
        // I don't think there's a way to properly type this
        .filter((match) => Boolean(match.handle) && (match.handle as HandleWithTitle).title != null)
        .map((match) => match.handle as HandleWithTitle);

    const lowestHandle = handles[handles.length - 1];

    return { ...lowestHandle, showTitle: lowestHandle.showTitle ?? true };
};
