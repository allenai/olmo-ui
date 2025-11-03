import type { Agent } from '@/api/playgroundApi/additionalTypes';

const availableAgents: Agent[] = [
    {
        id: 'deep-research',
        name: 'Deep Research',
        shortDescription: 'Deep research short description',
        description: 'Deep Research agent long description',
    },
];

type AgentsSelectFunction<TData> = (data: Agent[]) => TData;

export const useAgents = <TData = Agent[]>({
    select,
}: {
    select?: AgentsSelectFunction<TData>;
} = {}): TData => {
    if (select != null) {
        return select(availableAgents);
    }

    // @ts-expect-error - IDK how to type this properly and don't care because it'll be replaced soon
    return availableAgents;
};
