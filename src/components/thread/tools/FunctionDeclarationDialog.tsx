import { css, cx } from '@allenai/varnish-panda-runtime/css';
import { Button, IconButton, Modal, ModalActions, Tab, TabPanel } from '@allenai/varnish-ui';
import * as varnishUi from '@allenai/varnish-ui';
import CloseIcon from '@mui/icons-material/Close';
import { type ReactElement, useState , useEffect} from 'react';
import type { Key } from 'react-aria-components';
import { Control, useForm } from 'react-hook-form';
import * as z from 'zod';

import { Model } from '@/api/playgroundApi/additionalTypes';
import { SchemaToolDefinition } from '@/api/playgroundApi/playgroundApiSchema';
import { useColorMode } from '@/components/ColorModeProvider';
import { ControlledTextArea } from '@/components/form/TextArea/ControlledTextArea';

import { ControlledToolToggleTable } from './ToolToggleDialog';

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
    '& textarea': {
        fontFamily: 'monospace',
        fontSize: 'md',
        textWrap: 'nowrap',
    },
});

interface DataFields {
    declaration: string;
    tools: string[];
}

export interface FunctionDeclarationDialogProps {
    tools: Model['available_tools'];
    jsonData?: string;
    isOpen?: boolean;
    isDisabled?: boolean;
    onSave: (data: DataFields) => void;
    onReset?: () => void;
    onClose?: () => void;
}

export function FunctionDeclarationDialog({
    jsonData = '',
    tools,
    isOpen,
    isDisabled,
    onSave,
    onReset,
    onClose,
}: FunctionDeclarationDialogProps) {
    const { colorMode } = useColorMode();
    const { handleSubmit, reset, setValue, control } = useForm<DataFields>({
        values: {
            declaration: jsonData,
            tools: (tools || []).map((t) => t.name),
                },
        mode: 'onSubmit',
    });


    useEffect(() => {
        // Can't rely on default, if model changes we need to set the value.
        setValue(
            'tools',
            (tools || []).map((t) => t.name)
        );
    }, [tools]);


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
            heading="Function Declarations"
            headingClassName={modalHeading}
            closeButton={
                <IconButton onClick={onClose} aria-label="Close function declarations dialog">
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
                        aria-label="Save function declarations"
                        isDisabled={isDisabled}>
                        Save
                    </Button>
                </ModalActions>
            }>
            <form id={formId} onSubmit={handleSave}>
                <TabbedContent isDisabled={isDisabled} control={control} tools={[]} />
                {!isDisabled && (
                    <ModalActions className={exampleButtons} fullWidth>
                        <Button
                            size="small"
                            color="secondary"
                            onClick={() => {
                                setValue('declaration', EXAMPLE_DECLARATIONS.getWeather.trim());
                            }}>
                            getWeather
                        </Button>
                        <Button
                            size="small"
                            color="secondary"
                            onClick={() => {
                                setValue('declaration', EXAMPLE_DECLARATIONS.getStockIndex.trim());
                            }}>
                            getStockIndex
                        </Button>
                    </ModalActions>
                )}
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
    isDisabled?: boolean;
    control: Control<DataFields>;
    tools: Model['available_tools'];
};

const TabbedContent = ({ control, isDisabled, tools }: TabbedContentProps) => {
    const [tabSelected, setTabSelect] = useState<Key>('user-functions');

    const items: Items[] = [
        {
            id: 'user-functions',
            header: (props) => <varnishUi.Tab {...props}>User Defined Functions</varnishUi.Tab>,
            content: (props) => (
                <varnishUi.TabPanel {...props}>
                    <p className={labelStyle}>
                        Enter a JSON array of function declarations the model can call. Each
                        function should include a name, description, and JSON Schema parameters.
                        Start with an example below or see the API docs for more.
                    </p>
                    <ControlledTextArea
                        className={modalInput}
                        name="declaration"
                        isDisabled={isDisabled}
                        minRows={18}
                        maxRows={18}
                        controllerProps={{
                            control,
                            rules: {
                                validate: validateToolDefinitions,
                            },
                        }}
                    />
                </varnishUi.TabPanel>
            ),
        },
        {
            id: 'system-functions',
            header: (props) => <varnishUi.Tab {...props}>System Functions</varnishUi.Tab>,
            content: (props) => (
                <varnishUi.TabPanel {...props}>
                    <p className={labelStyle}>Tools below will be added to the conversation.</p>
                    <ControlledToolToggleTable controllerProps={{control}} tools={tools} />
                </varnishUi.TabPanel>
            ),
        },
    ] as const;

    return (
        <varnishUi.Tabs onSelectionChange={setTabSelect} selectedKey={tabSelected} items={items} />
    );
};

const validateToolDefinitions = (value: string) => {
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
