import { useMatches } from 'react-router-dom';

interface HandleWithTitle {
    title: string;
}

export const useRouteTitle = () => {
    const matches = useMatches();
    const titles = matches
        // This is unfortunately the recommended way to handle this typing.
        // I don't think there's a way to properly type this
        .filter((match) => Boolean(match.handle) && (match.handle as HandleWithTitle).title != null)
        .map((match) => (match.handle as HandleWithTitle).title);

    const lowestTitle = titles[titles.length - 1];

    return lowestTitle;
};
