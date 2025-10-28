import { Agent } from '@/api/playgroundApi/additionalTypes';
import placeholderImage from '@/assets/dolma-research.jpg';

export const agentLinks: Agent[] = [
    {
        id: 'paper-finder',
        name: 'Paper Finder',
        information_url: 'https://asta.allenai.org/',
        description: '',
        shortDescription: 'Paper finder short description',
    },
    {
        id: 'data-voyager',
        name: 'Data Voyager',
        information_url: 'https://asta.allenai.org/',
        description: '',
        shortDescription: 'Data Voyager short description',
    },
];

export const agentImages: Record<string, string> = {
    'deep-research': placeholderImage,
    'paper-finder': placeholderImage,
    'data-voyager': placeholderImage,
};
