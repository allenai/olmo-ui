import { generatePath } from 'react-router-dom';

import { links } from '@/Links';

type AgentTemplatePathParams = {
    agentId: string;
    templateId: string;
};

export const makeAgentTemplatePath = ({ agentId, templateId }: AgentTemplatePathParams) => {
    const path = generatePath(links.agent.agent, {
        agentId,
    });
    return `${path}?template=${templateId}`;
};
