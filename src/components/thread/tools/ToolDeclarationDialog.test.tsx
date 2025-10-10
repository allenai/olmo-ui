import { act, render, screen } from '@test-utils';
import userEvent from '@testing-library/user-event';

import { type SchemaAvailableTool } from '@/api/playgroundApi/playgroundApiSchema';

import { ToolDeclarationDialog } from './ToolDeclarationDialog';

const availableTools = [
    {
        toolGroupName: 'Internal',
        name: 'Get random number',
    },
    {
        toolGroupName: 'Internal',
        name: 'Get the number five',
    },
    {
        toolGroupName: 'External MCP',
        name: 'Get the temperature',
    },
    {
        toolGroupName: 'External MCP',
        name: 'Get the air pressure',
    },
    {
        toolGroupName: 'External MCP',
        name: 'Get wind direction',
    },
] satisfies SchemaAvailableTool[];

describe('ToolDeclarationDialog', () => {
    it('should show unselect all for a group with all checkboxes checked', async () => {
        render(
            <ToolDeclarationDialog
                isOpen={true}
                availableTools={availableTools}
                selectedTools={availableTools.map((t) => t.name)}
                onSave={() => {}}
            />
        );

        await act(async () => {
            await userEvent.click(screen.getByRole('tab', { name: 'System tools' }));
        });

        expect(
            screen.getByRole('link', { name: 'Unselect all from Internal' })
        ).toBeInTheDocument();
        expect(
            screen.getByRole('link', { name: 'Unselect all from External MCP' })
        ).toBeInTheDocument();
    });

    it('should show select all for a group that has checkboxes unselected', async () => {
        render(
            <ToolDeclarationDialog
                isOpen={true}
                availableTools={availableTools}
                selectedTools={availableTools.map((t) => t.name)}
                onSave={() => {}}
            />
        );

        await act(async () => {
            await userEvent.click(screen.getByRole('tab', { name: 'System tools' }));
            await userEvent.click(
                screen.getByRole('checkbox', { name: 'Toggle Get wind direction tool' })
            );
        });

        expect(
            screen.getByRole('link', { name: 'Unselect all from Internal' })
        ).toBeInTheDocument();
        expect(
            screen.getByRole('link', { name: 'Select all from External MCP' })
        ).toBeInTheDocument();
    });
});
