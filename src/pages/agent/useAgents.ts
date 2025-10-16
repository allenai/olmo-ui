import type { Agent } from '@/api/playgroundApi/additionalTypes';

const availableAgents: Agent[] = [
    {
        id: 'deep-research',
        name: 'Deep Research',
        description: 'Deep Research agent',
        accepts_files: false,
    },
];

export const useAgents = () => {
    return availableAgents;
};
