import * as z from 'zod';

import { Model } from '@/api/playgroundApi/additionalTypes';
import { SchemaAvailableTool, SchemaToolDefinition } from '@/api/playgroundApi/playgroundApiSchema';
import { MCP_SERVER_NAME } from '@/components/toolCalling/mcpServerName';

export const allToolsInGroupSelected = (selectedTools: string[], tools: string[]): boolean => {
    return new Set(tools).isSubsetOf(new Set(selectedTools));
};

export const removeToolsFromSelected = (
    selectedTools: string[],
    toolsToRemove: string[]
): string[] => {
    return Array.from(new Set(selectedTools).difference(new Set(toolsToRemove)));
};

export const addToolsToSelected = (selectedTools: string[], toolsToAdd: string[]): string[] => {
    return Array.from(new Set([...selectedTools, ...toolsToAdd]));
};

export const isMcpServer = (mcpId: string): mcpId is keyof typeof MCP_SERVER_NAME =>
    Boolean(mcpId in MCP_SERVER_NAME);

export const toolGroupNameFromTool = (tool: SchemaAvailableTool) => {
    const mcpServerId = tool.mcpServerId;
    if (mcpServerId) {
        if (isMcpServer(mcpServerId)) {
            return MCP_SERVER_NAME[mcpServerId];
        }
        return 'Unknown';
    }
    return 'Internal';
};

type GroupedToolList = Record<string, SchemaAvailableTool[]>;

export const groupTools = (tools: Model['available_tools'] = []): GroupedToolList => {
    const groupedTools: GroupedToolList = {};
    if (tools) {
        for (const tool of tools) {
            const toolGroupName = toolGroupNameFromTool(tool);
            groupedTools[toolGroupName] ??= [];
            groupedTools[toolGroupName].push(tool);
        }
    }
    return groupedTools;
};

export const toSpacedCase = (str: string) => {
    return (
        str
            // Handle camelCase: insert space before uppercase letters
            .replace(/([a-z])([A-Z])/g, '$1 $2')
            // Handle snake_case: replace underscores with spaces
            .replace(/_/g, ' ')
            // Convert to lowercase
            .toLowerCase()
            // Capitalize the first letter
            .replace(/^./, (char) => char.toUpperCase())
            // Clean up any extra spaces
            .replace(/\s+/g, ' ')
            .trim()
    );
};
export const validateToolDefinitions = (value: string | string[]) => {
    if (Array.isArray(value)) {
        return 'Expected string not array';
    }

    const definitionSchema = z.strictObject({
        name: z.string().min(1, { error: 'Name is required' }),
        description: z.string().min(1, { error: 'Description is required' }),
        parameters: z.record(z.string(), z.unknown()),
    });
    const toolsSchema = z.array(definitionSchema);

    try {
        const toolDefs = JSON.parse(value) as SchemaToolDefinition[];
        toolsSchema.parse(toolDefs);
    } catch (e) {
        if (e instanceof SyntaxError) {
            return `Invalid JSON format: ${e.message}`;
        }
        if (e instanceof z.core.$ZodError) {
            // Return the first issue message for simplicity
            const message = `[${e.issues[0].path.toString()}]: ${e.issues[0].message}`;
            return `Invalid definition: ${message}`;
        }
        return 'Unknown parsing error';
    }

    return true;
};
