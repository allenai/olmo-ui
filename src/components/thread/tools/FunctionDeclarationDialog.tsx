import { css, cx } from '@allenai/varnish-panda-runtime/css';
import {
    Button,
    Checkbox,
    IconButton,
    Modal,
    ModalActions,
    Tab,
    TabPanel,
} from '@allenai/varnish-ui';
import * as varnishUi from '@allenai/varnish-ui';
import CloseIcon from '@mui/icons-material/Close';
import { type ReactElement, type ReactNode, useEffect, useState } from 'react';
import type { Key } from 'react-aria-components';
import {
    Control,
    Resolver,
    useController,
    type UseControllerProps,
    useForm,
    UseFormSetValue,
} from 'react-hook-form';
import * as z from 'zod';

import { Model } from '@/api/playgroundApi/additionalTypes';
import { SchemaToolDefinition } from '@/api/playgroundApi/playgroundApiSchema';
import { useColorMode } from '@/components/ColorModeProvider';
import { ControlledTextArea } from '@/components/form/TextArea/ControlledTextArea';

const modalBase = css({
    fontSize: 'sm',
    paddingTop: '4',
    paddingBottom: '6',
    paddingInline: '2',
});

const modalHeading = css({
    color: 'accent.primary',
    fontSize: 'sm',
    fontWeight: 'regular',
});

const labelStyle = css({
    marginBottom: '2',
});

const exampleButtons = css({
    display: 'flex',
    justifyContent: 'flex-start',
    paddingInline: '0',
    marginBottom: '4',
});

const modalInput = css({
    flex: '1',
    '& textarea': {
        fontFamily: 'monospace',
        fontSize: 'md',
        textWrap: 'nowrap',
    },
    '& > div:first-of-type': {
        // hack to select div inside of varnish text area
        height: '[100%]',
    },
});

const fullHeight = css({ height: '[100%]' });

const tabHeight = css({ height: '[min(60dvh, 600px)]' });

const textAreaContainer = css({
    display: 'flex',
    flexDirection: 'column',
    height: '[100%]',
});

interface DataFields {
    declaration: string;
    tools: string[];
}
export interface FunctionDeclarationDialogProps {
    availableTools: Model['available_tools'];
    selectedTools: string[];
    jsonData?: string;
    isOpen?: boolean;
    isDisabled?: boolean;
    onSave: (data: DataFields) => void;
    onReset?: () => void;
    onClose?: () => void;
}

export function FunctionDeclarationDialog({
    jsonData = '[]',
    availableTools: tools,
    selectedTools,
    isOpen,
    isDisabled,
    onSave,
    onReset,
    onClose,
}: FunctionDeclarationDialogProps) {
    const { colorMode } = useColorMode();
    const [tabSelected, setTabSelect] = useState<Key>('user-functions');

    const resolver: Resolver<DataFields> = (data) => {
        const validJson = validateToolDefinitions(data.declaration);
        if (validJson === true) return { values: data, errors: {} };

        setTabSelect('user-functions');
        return {
            values: {},
            errors: {
                declaration: { type: 'value', message: validJson },
            },
        };
    };

    const { handleSubmit, reset, setValue, control } = useForm<DataFields>({
        values: {
            declaration: jsonData,
            tools: (tools || []).map((t) => t.name),
        },
        mode: 'onSubmit',
        resolver,
    });

    useEffect(() => {
        // Can't rely on default, if model changes we need to set the value.
        setValue('tools', selectedTools);
    }, [selectedTools, setValue]);

    const handleSave = handleSubmit((data) => {
        onSave(data);
        onClose?.();
    });

    const handleReset = () => {
        reset();
        onReset?.();
    };

    const formId = 'function-declaration-form';

    return (
        <Modal
            className={cx(colorMode, modalBase)}
            isOpen={isOpen}
            isDismissable
            fullWidth
            size="large"
            heading="Tool Declarations"
            headingClassName={modalHeading}
            closeButton={
                <IconButton onClick={onClose} aria-label="Close tool declarations dialog">
                    <CloseIcon />
                </IconButton>
            }
            buttons={
                <ModalActions fullWidth>
                    <Button
                        color="secondary"
                        shape="rounded"
                        onClick={handleReset}
                        aria-label="Reset form"
                        isDisabled={isDisabled}>
                        Reset
                    </Button>
                    <Button
                        color="secondary"
                        shape="rounded"
                        variant="contained"
                        type="submit"
                        form={formId}
                        aria-label="Save tool declarations"
                        isDisabled={isDisabled}>
                        Save
                    </Button>
                </ModalActions>
            }>
            <form id={formId} onSubmit={handleSave}>
                <TabbedContent
                    tabSelected={tabSelected}
                    setTabSelect={setTabSelect}
                    isDisabled={isDisabled}
                    control={control}
                    tools={tools}
                    setValue={setValue}
                />
            </form>
        </Modal>
    );
}

type Items = {
    id: string;
    header: (props?: React.ComponentProps<typeof Tab>) => ReactElement;
    content: (props?: React.ComponentProps<typeof TabPanel>) => ReactElement;
    isDisabled?: boolean;
};

type TabbedContentProps = {
    tabSelected: Key;
    setTabSelect: (t: Key) => void;
    isDisabled?: boolean;
    control: Control<DataFields>;
    tools: Model['available_tools'];
    setValue: UseFormSetValue<DataFields>;
};

const TabbedContent = ({
    control,
    isDisabled,
    tools,
    setValue,
    setTabSelect,
    tabSelected,
}: TabbedContentProps) => {
    const items: Items[] = [
        {
            id: 'user-functions',
            header: (props) => <varnishUi.Tab {...props}>User Defined Tools</varnishUi.Tab>,
            content: (props) => (
                <varnishUi.TabPanel {...props}>
                    <div className={textAreaContainer}>
                        <p className={labelStyle}>
                            Enter a JSON array of tool declarations the model can call. Each tool
                            should include a name, description, and JSON Schema parameters. Start
                            with an example below or see the API docs for more.
                        </p>
                        <ControlledTextArea
                            className={modalInput}
                            textAreaClassName={fullHeight}
                            growContainerClassName={fullHeight}
                            name="declaration"
                            isDisabled={isDisabled}
                            controllerProps={{
                                control,
                                rules: {
                                    validate: validateToolDefinitions,
                                },
                            }}
                        />

                        {!isDisabled && (
                            <ModalActions className={exampleButtons} fullWidth>
                                <Button
                                    size="small"
                                    color="secondary"
                                    onClick={() => {
                                        setValue(
                                            'declaration',
                                            EXAMPLE_DECLARATIONS.getWeather.trim()
                                        );
                                    }}>
                                    getWeather
                                </Button>
                                <Button
                                    size="small"
                                    color="secondary"
                                    onClick={() => {
                                        setValue(
                                            'declaration',
                                            EXAMPLE_DECLARATIONS.getStockIndex.trim()
                                        );
                                    }}>
                                    getStockIndex
                                </Button>
                            </ModalActions>
                        )}
                    </div>
                </varnishUi.TabPanel>
            ),
        },
        {
            id: 'system-functions',
            header: (props) => <varnishUi.Tab {...props}>System Tools</varnishUi.Tab>,
            content: (props) => (
                <varnishUi.TabPanel {...props}>
                    <p className={labelStyle}>Tools below will be added to the conversation.</p>
                    <ControlledToolToggleTable
                        isDisabled={isDisabled}
                        control={{ control }}
                        tools={tools}
                    />
                </varnishUi.TabPanel>
            ),
        },
    ] as const;

    return (
        <varnishUi.Tabs
            className={tabHeight}
            onSelectionChange={setTabSelect}
            selectedKey={tabSelected}
            items={items}
        />
    );
};

interface ControlledToggleTableProps {
    control?: Omit<UseControllerProps<DataFields>, 'name'>;
    tools: Model['available_tools'];
    isDisabled?: boolean;
}

const toolNameGrid = css({
    display: 'grid',
    gridTemplateColumns: 'repeat(auto-fit, minmax(300px, 1fr))',
    gap: '4',
    paddingX: '2',
    paddingY: '4',
});

const toolName = css({
    whiteSpace: 'nowrap',
    overflow: 'hidden',
    textOverflow: 'ellipsis',
    fontSize: 'md',
    fontWeight: 'medium',
    maxWidth: '[300px]',
});

const realToolName = css({
    whiteSpace: 'nowrap',
    overflow: 'hidden',
    textOverflow: 'ellipsis',
    width: '[300px]',
    marginLeft: '[22px]',
    fontSize: 'sm',
    color: 'extra-dark-teal.70',
});

export const ControlledToolToggleTable = ({
    control,
    tools,
    isDisabled,
}: ControlledToggleTableProps): ReactNode => {
    const { field } = useController({
        name: 'tools',
        ...control,
        defaultValue: [],
        rules: {},
    });

    const handleToggle = (tool: string, isChecked: boolean) => {
        const currentTools = field.value;
        if (isChecked) {
            if (!currentTools.includes(tool)) {
                field.onChange([...currentTools, tool]);
            }
        } else {
            field.onChange(currentTools.filter((t) => t !== tool));
        }
    };

    return (
        <div className={toolNameGrid}>
            {(tools || []).map((tool) => (
                <div key={tool.name}>
                    <Checkbox
                        isDisabled={isDisabled}
                        isSelected={field.value.includes(tool.name) || false}
                        onChange={(isChecked) => {
                            handleToggle(tool.name, isChecked);
                        }}
                        aria-label={`Toggle ${tool.name} tool`}>
                        <span className={toolName}>{toSpacedCase(tool.name)}</span>
                    </Checkbox>
                    <div className={realToolName}>{tool.name}</div>
                </div>
            ))}
        </div>
    );
};

function toSpacedCase(str: string) {
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
}
const validateToolDefinitions = (value: string | string[]) => {
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
            const message = `[${e.issues[0].path}]: ${e.issues[0].message}`;
            return `Invalid definition: ${message}`;
        }
        return 'Unknown parsing error';
    }

    return true;
};

const EXAMPLE_DECLARATIONS = {
    getWeather: `
[
    {
        "name": "get_current_weather",
        "description": "Get the current weather in a given location",
        "parameters": {
            "type": "object",
            "properties": {
                "location": {
                    "type": "string",
                    "description": "The city name of the location for which to get the weather.",
                    "default": {
                        "string_value": "Boston, MA"
                    }
                }
            },
            "required": [
                "location"
            ]
        }
    }
]
`,
    getStockIndex: `
[
    {
        "name": "getStockIndexCloseValue",
        "description": "Get the value of a stock index at close on a particular day",
        "parameters": {
            "type": "object",
            "properties": {
                "stockIndex": {
                    "type": "string",
                    "description": "The stock index to get the value for. One of: Dow Jones, NASDAQ, S&P 500",
                    "enum": [
                        "Dow Jones",
                        "NASDAQ",
                        "S&P 500"
                    ]
                },
                "daysAgo": {
                    "type": "number",
                    "description": "The number of days ago to get the stock index value. For example, 0 means today, 1 means yesterday, 2 means the day before yesterday, and so on."
                }
            },
            "required": [
                "stockIndex"
            ]
        }
    }
]
`,
};
