import { QueryClient } from '@tanstack/react-query';
import { LoaderFunction } from 'react-router-dom';

import { Agent } from '@/api/playgroundApi/additionalTypes';

import { agentLinks } from './agentLinks';
import { useAgents } from './useAgents';

// Mocking potential types for needs
export type AgentLoaderData = {
    agents: Agent[];
    agentLinks: Agent[];
};

export const agentPageLoader =
    (_queryClient: QueryClient): LoaderFunction =>
    async ({ params: _params, request: _request }) => {
        const agents = useAgents();

        // Mocking potential data
        const loaderData: AgentLoaderData = {
            agents,
            agentLinks,
        };

        return Promise.resolve(loaderData);
    };
