import { Agent } from '@/api/playgroundApi/additionalTypes';
import placeholderImage from '@/assets/dolma-research.jpg';

export const agentLinks: Agent[] = [
    {
        id: 'asta',
        name: 'Asta',
        information_url: 'https://asta.allenai.org/',
        shortDescription: 'Paper finder description',
        description: 'Paper finder description',
    },
];

export const agentImages: Record<string, string> = {
    'deep-research': placeholderImage,
    asta: placeholderImage,
};
