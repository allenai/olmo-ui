import { createSearchParams, generatePath } from 'react-router-dom';

import { links } from '@/Links';
import { PARAM_SELECTED_TEMPLATE } from '@/pages/queryParameterConsts';

type AgentTemplatePathParams = {
    agentId: string;
    templateId: string;
};

export const makeAgentTemplatePath = ({ agentId, templateId }: AgentTemplatePathParams) => {
    const path = generatePath(links.agent.agent, {
        agentId,
    });
    const templateParam = createSearchParams({
        [PARAM_SELECTED_TEMPLATE]: templateId,
    });
    return `${path}?${templateParam}`;
};
