import type { Meta, StoryObj } from '@storybook/react-vite';
import { useState } from 'react';
import { Button } from 'react-aria-components';
import { fn } from 'storybook/test';

import { ToolDeclarationDialog, ToolDeclarationDialogProps } from './ToolDeclarationDialog';

const meta = {
    component: ToolDeclarationDialog,
} satisfies Meta<typeof ToolDeclarationDialog>;

export default meta;

type Story = StoryObj<typeof meta>;

const jsonData = `[
  {
    "name": "getWeather",
    "description": "gets the weather for a requested city",
    "parameters": {
      "type": "object",
      "properties": {
        "city": {
          "type": "string"
        }
      }
    }
  }
]`;

const selectedTools = ['get_random_number'];

const availableTools = [
    { name: 'get_random_number', description: 'get a random number.' },

    { name: 'name with spaces', description: 'get a name with spaces.' },
    {
        name: 'long name function that is very long and could cause issues. keep in mind with mcp anyone could add a name long name function that is very long and could cause issues. keep in mind with mcp anyone could add a name',
        description:
            'long name function that is very long and could cause issues. keep in mind with mcp anyone could add a name long name function that is very long and could cause issues. keep in mind with mcp anyone could add a name long name function that is very long and could cause issues. keep in mind with mcp anyone could add a name long name function that is very long and could cause issues. keep in mind with mcp anyone could add a name long name function that is very long and could cause issues. keep in mind with mcp anyone could add a name long name function that is very long and could cause issues. keep in mind with mcp anyone could add a name long name function that is very long and could cause issues. keep in mind with mcp anyone could add a name long name function that is very long and could cause issues. keep in mind with mcp anyone could add a name long name function that is very long and could cause issues. keep in mind with mcp anyone could add a name long name function that is very long and could cause issues. keep in mind with mcp anyone could add a name',
        mcpServerId: 'asta',
    },
    {
        name: 'longnamefunctionthatasdfasdfasdfasdfasdfadsfasdfasdfasdfsadfasdfasdfasdfasfasdfdsafasdfasdfasdfsadfis very long and could cause issues. keep in mind with mcp anyone could add a name long name function that is very long and could cause issues. keep in mind with mcp anyone could add a name',
        description:
            'long name function that is very long and could cause issues. keep in mind with mcp anyone could add a name long name function that is very long and could cause issues. keep in mind with mcp anyone could add a name long name function that is very long and could cause issues. keep in mind with mcp anyone could add a name long name function that is very long and could cause issues. keep in mind with mcp anyone could add a name long name function that is very long and could cause issues. keep in mind with mcp anyone could add a name long name function that is very long and could cause issues. keep in mind with mcp anyone could add a name long name function that is very long and could cause issues. keep in mind with mcp anyone could add a name long name function that is very long and could cause issues. keep in mind with mcp anyone could add a name long name function that is very long and could cause issues. keep in mind with mcp anyone could add a name long name function that is very long and could cause issues. keep in mind with mcp anyone could add a name',
        mcpServerId: 'asta',
    },
];

export const Default: Story = {
    args: {
        isOpen: true,
        isToolCallingEnabled: true,
        isDisabled: false,
        onSave: fn(),
        onReset: fn(),
        jsonData,
        selectedTools,
        availableTools,
    },
};

export const Disabled: Story = {
    args: {
        isOpen: true,
        isToolCallingEnabled: true,
        isDisabled: true,
        onSave: fn(),
        onReset: fn(),
        jsonData,
        selectedTools: [],
        availableTools,
    },
};

const Triggered = (props: ToolDeclarationDialogProps) => {
    const [isOpen, setIsOpen] = useState(false);

    return (
        <div>
            <Button
                onClick={() => {
                    setIsOpen(true);
                }}>
                Open Dialog
            </Button>
            <ToolDeclarationDialog
                {...props}
                onClose={() => {
                    setIsOpen(false);
                }}
                isOpen={isOpen}
            />
        </div>
    );
};

export const WithTrigger: Story = {
    render: (props) => <Triggered {...props} />,
    args: {
        isOpen: false,
        isDisabled: false,
        isToolCallingEnabled: true,
        onSave: fn(),
        onReset: fn(),
        jsonData,
        availableTools,
        selectedTools,
    },
};
