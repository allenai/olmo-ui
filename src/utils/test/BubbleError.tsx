import { useRouteError } from 'react-router-dom';

// Taken from https://github.com/remix-run/react-router/discussions/10166#discussioncomment-5985748
export const BubbleError = () => {
    const error = useRouteError();
    throw error;
};
