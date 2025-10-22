import { sva } from '@allenai/varnish-panda-runtime/css';
import { Send } from '@mui/icons-material';
import { FormProvider, useForm } from 'react-hook-form';

import { ControlledInput } from '@/components/form/ControlledInput';
import { QueryFormButton } from '@/components/thread/QueryForm/QueryFormButton';
import { CollapsibleWidgetContent } from '@/components/widgets/CollapsibleWidget/CollapsibleWidgetContent';

import { ToolCallUserResponseFormValues, useToolCallUserResponse } from './useToolCallUserResponse';

const toolCallResponseRecipe = sva({
    slots: ['widget', 'wrapper', 'inputContainer', 'label', 'input', 'error'],
    base: {
        widget: {
            display: 'grid',
            gridTemplateAreas: '"label" "input" "error"',
            gridTemplateRows: 'repeat(3, min-content)',
            gap: '2',
            alignItems: 'center',
            paddingInline: 'var(--padding-inline)',
            paddingBlock: '2',
        },
        wrapper: {
            display: 'grid',
            gridTemplateColumns: 'subgrid',
            gridTemplateRows: 'subgrid',
            gap: '2',
            gridArea: 'label / label / error / label',
        },
        inputContainer: {
            gridArea: 'input',
            paddingInlineEnd: '1',
            backgroundColor: 'elements.overrides.form.input.fill',
            borderColor: 'elements.overrides.form.input.hovered.stroke',
        },
        label: {
            gridArea: 'label',
            _groupInvalid: {
                // just prevents error red - seems like overkill with error message being red too
                color: 'text',
            },
        },
        input: {
            color: {
                // white passes AAA (default text in dark mode is only AA)
                base: 'text',
                _dark: 'white',
            },
            // text.placeholder-more-contrast from varnish-theme
            _placeholder: {
                color: 'gray.70',
            },
            _dark: {
                _placeholder: {
                    color: 'cream.100/55',
                },
            },
        },
        error: {
            gridArea: 'error',
        },
    },
});

const ToolCallUserResponse = ({ toolCallId }: { toolCallId: string }) => {
    const formContext = useForm<ToolCallUserResponseFormValues>({
        defaultValues: {
            content: '',
            private: false,
            role: 'tool_call_result',
            toolCallId,
        },
    });

    const { submitToolCallResponse, isPending } = useToolCallUserResponse(formContext);

    const classNames = toolCallResponseRecipe();

    return (
        <FormProvider {...formContext}>
            <form onSubmit={formContext.handleSubmit(submitToolCallResponse)}>
                <CollapsibleWidgetContent contrast="medium" className={classNames.widget}>
                    <ControlledInput
                        name="content"
                        className={classNames.wrapper}
                        fullWidth
                        controllerProps={{
                            rules: { required: 'A tool response is required', minLength: 1 },
                        }}
                        variant="contained"
                        // TODO: https://github.com/allenai/varnish/issues/1209
                        // @ts-expect-error placeholder not in prop types, but is passed to component
                        placeholder="Tool response"
                        label="Enter tool response:"
                        labelClassName={classNames.label}
                        containerClassName={classNames.inputContainer}
                        inputClassName={classNames.input}
                        errorClassName={classNames.error}
                        isDisabled={isPending}
                        endControls={
                            <QueryFormButton
                                sx={{
                                    color: 'secondary.main',
                                    '&:hover': {
                                        // should this be the default for this control?
                                        color: 'secondary.dark',
                                    },
                                }}
                                type="submit"
                                aria-label="Submit function response"
                                disabled={isPending}>
                                <Send />
                            </QueryFormButton>
                        }
                    />
                </CollapsibleWidgetContent>
            </form>
        </FormProvider>
    );
};

export { ToolCallUserResponse };
