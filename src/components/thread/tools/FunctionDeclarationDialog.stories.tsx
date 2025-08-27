import type { Meta, StoryObj } from '@storybook/react';
import { fn } from '@storybook/test';
import { useState } from 'react';
import { Button } from 'react-aria-components';

import {
    FunctionDeclarationDialog,
    FunctionDeclarationDialogProps,
} from './FunctionDeclarationDialog';

const meta = {
    component: FunctionDeclarationDialog,
} satisfies Meta<typeof FunctionDeclarationDialog>;

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

export const Default: Story = {
    args: {
        isOpen: true,
        isDisabled: false,
        onSave: fn(),
        onReset: fn(),
        jsonData,
    },
};

export const Disabled: Story = {
    args: {
        isOpen: true,
        isDisabled: true,
        onSave: fn(),
        onReset: fn(),
        jsonData,
    },
};

const Triggered = (props: FunctionDeclarationDialogProps) => {
    const [isOpen, setIsOpen] = useState(false);

    return (
        <div>
            <Button
                onClick={() => {
                    setIsOpen(true);
                }}>
                Open Dialog
            </Button>
            <FunctionDeclarationDialog
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
        onSave: fn(),
        onReset: fn(),
        jsonData,
    },
};
