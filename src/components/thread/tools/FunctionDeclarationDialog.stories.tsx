import type { Meta, StoryObj } from '@storybook/react';
import { fn } from '@storybook/test';

import { FunctionDeclarationDialog } from './FunctionDeclarationDialog';

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
        jsonData,
        isOpen: true,
        isPending: false,
        isDisabled: false,
        onSave: fn(),
        onReset: fn(),
    },
};

export const Disabled: Story = {
    args: {
        jsonData,
        isOpen: true,
        isPending: false,
        isDisabled: true,
        onSave: fn(),
        onReset: fn(),
    },
};
