import type { SchemaPromptTemplateResponseList } from '@/api/playgroundApi/playgroundApiSchema';

import { v5TypedHttp } from './v5TypedHttp';

const facePromptTemplatesResponse = [
    {
        id: 'p_tpl_12345',
        name: 'test prompt template',
        content: 'Tell me about lions',
        creator: 'taylor',
        opts: {},
        modelType: 'chat',
        fileUrls: null,
        toolDefinitions: [],
        created: '2024-10-10T12:00:00Z',
        updated: '2024-10-10T12:00:00Z',
    },
    {
        id: 'p_tpl_tool_definitions',
        name: 'prompt template with tool definitions',
        content: 'Tell me the weather',
        creator: 'taylor',
        opts: {},
        modelType: 'chat',
        fileUrls: null,
        toolDefinitions: [
            {
                name: 'get_weather',
                description: 'Get the current weather in a given location',
                parameters: {
                    type: 'object',
                    default: null,
                    required: ['location'],
                    properties: {
                        location: {
                            type: 'string',
                            default: { string_value: 'Boston, MA' },
                            required: [],
                            properties: null,
                            description:
                                'The city name of the location for which to get the weather.',
                            propertyOrdering: null,
                        },
                    },
                    description: null,
                    propertyOrdering: null,
                },
                toolSource: 'user_defined',
            },
        ],
        created: '2024-10-10T12:00:00Z',
        updated: '2024-10-10T12:00:00Z',
    },
] satisfies SchemaPromptTemplateResponseList;

const v5PromptTemplatesHandler = v5TypedHttp.get('/v5/prompt-templates/', ({ response }) => {
    return response(200).json(facePromptTemplatesResponse);
});

export const v5PromptTemplatesHandlers = [v5PromptTemplatesHandler];
