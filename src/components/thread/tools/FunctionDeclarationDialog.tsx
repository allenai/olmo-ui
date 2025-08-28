import { css, cx } from '@allenai/varnish-panda-runtime/css';
import {
    AriaMenu,
    Button,
    IconButton,
    MenuItem,
    MenuTrigger,
    Modal,
    ModalActions,
    Popover,
} from '@allenai/varnish-ui';
import CloseIcon from '@mui/icons-material/Close';
import { useForm } from 'react-hook-form';

import { useColorMode } from '@/components/ColorModeProvider';
import { ControlledTextArea } from '@/components/form/TextArea/ControlledTextArea';

const modalBase = css({
    paddingTop: '4',
    paddingBottom: '6',
    paddingLeft: '2',
    paddingRight: '2',
});

const modalHeading = css({
    color: 'accent.primary',
    fontSize: 'sm',
    fontWeight: 'regular',
});

const modalActions = css({
    display: 'flex',
    justifyContent: 'space-between',
    alignItems: 'center',
    width: '[100%]',
    '& > div': {
        gap: '2',
        display: 'flex',
    },
});

const modalInput = css({
    '& textarea': {
        fontFamily: 'monospace',
        fontSize: 'md',
    },
    '& label': {
        marginTop: '4',
        marginBottom: '8',
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
                <ModalActions className={modalActions}>
                    <MenuTrigger>
                        <Button
                            color="secondary"
                            shape="rounded"
                            variant="text"
                            aria-label="Cancel and close dialog">
                            Use example
                        </Button>
                        <Popover placement="top left">
                            <AriaMenu aria-label="Start with an example">
                                <MenuItem
                                    onAction={() => {
                                        setValue(
                                            'declaration',
                                            EXAMPLE_DECLARATIONS.getWeather.trim()
                                        );
                                    }}>
                                    getWeather
                                </MenuItem>
                                <MenuItem
                                    onAction={() => {
                                        setValue(
                                            'declaration',
                                            EXAMPLE_DECLARATIONS.getStockIndex.trim()
                                        );
                                    }}>
                                    getCurrentTime
                                </MenuItem>
                            </AriaMenu>
                        </Popover>
                    </MenuTrigger>
                    <div>
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
                    </div>
                </ModalActions>
            }>
            <form id={formId} onSubmit={handleSave}>
                <ControlledTextArea
                    className={modalInput}
                    name="declaration"
                    label="Enter a list of function declarations for the model to call upon. See the API documentation for examples."
                    isDisabled={isDisabled}
                    minRows={18}
                    maxRows={18}
                    controllerProps={{
                        control,
                        rules: {
                            validate: (value) => {
                                try {
                                    JSON.parse(value);
                                } catch {
                                    return 'Invalid JSON format';
                                }

                                return true;
                            },
                        },
                    }}
                />
            </form>
        </Modal>
    );
}

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
            }
        },
        "required": [
            "location"
        ]
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
