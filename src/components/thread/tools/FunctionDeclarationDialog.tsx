import { css, cx } from '@allenai/varnish-panda-runtime/css';
import { Button, IconButton, Modal, ModalActions } from '@allenai/varnish-ui';
import CloseIcon from '@mui/icons-material/Close';
import { useForm } from 'react-hook-form';
import * as z from 'zod';

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
    '& textarea': {
        fontFamily: 'monospace',
        fontSize: 'md',
        textWrap: 'nowrap',
    },
});

interface DataFields {
    declaration: string;
}

export interface FunctionDeclarationDialogProps {
    jsonData?: string;
    isOpen?: boolean;
    isDisabled?: boolean;
    onSave: (data: DataFields) => void;
    onReset?: () => void;
    onClose?: () => void;
}

export function FunctionDeclarationDialog({
    jsonData = '',
    isOpen,
    isDisabled,
    onSave,
    onReset,
    onClose,
}: FunctionDeclarationDialogProps) {
    const { colorMode } = useColorMode();
    const { handleSubmit, reset, setValue, control } = useForm<DataFields>({
        defaultValues: {
            declaration: jsonData,
        },
        mode: 'onSubmit',
    });

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
                <p className={labelStyle}>
                    Enter a JSON array of function declarations the model can call. Each function
                    should include a name, description, and JSON Schema parameters. Start with an
                    example below or see the API docs for more.
                </p>
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
            </form>
        </Modal>
    );
}

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
