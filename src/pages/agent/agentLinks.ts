import { Agent } from '@/api/playgroundApi/additionalTypes';
import placeholderImage from '@/assets/dolma-research.jpg';

export const agentLinks: Agent[] = [
    {
        id: 'paper-finder',
        name: 'Paper Finder',
        information_url: 'https://asta.allenai.org/',
        description: 'Paper finder description',
    },
    {
        id: 'data-voyager',
        name: 'Data Voyager',
        information_url: 'https://asta.allenai.org/',
        description: 'Data Voyager description',
    },
];

export const agentImages: Record<string, string> = {
    'deep-research': placeholderImage,
    'paper-finder': placeholderImage,
    'data-voyager': placeholderImage,
};
