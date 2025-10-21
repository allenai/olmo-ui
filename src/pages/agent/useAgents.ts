import type { Agent } from '@/api/playgroundApi/additionalTypes';

const availableAgents: Agent[] = [
    {
        id: 'deep-research',
        name: 'Deep Research',
        description: 'Deep Research agent',
        accepts_files: false,
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
