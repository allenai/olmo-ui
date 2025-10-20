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
            gridTemplateAreas: '"label ." "input button" "error ."',
            gridTemplateColumns: '1fr auto',
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
            backgroundColor: 'elements.overrides.form.input.fill',
            borderColor: 'elements.overrides.form.input.stroke',
        },
        label: {
            gridArea: 'label',
            _groupInvalid: {
                color: 'text', // just prevents error reda
            },
        },
        input: {
            color: {
                // white passes AAA (default text in dark mode is only AA)
                base: 'text',
                _dark: 'white',
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
    const labelAndPlaceholder = 'Enter tool response:';

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
                        // TODO: https://github.com/allenai/varnish/issues/1209
                        // @ts-expect-error placeholder not in prop types, but is passed to component
                        placeholder="Tool response"
                        variant="contained"
                        label={labelAndPlaceholder}
                        labelClassName={classNames.label}
                        containerClassName={classNames.inputContainer}
                        inputClassName={classNames.input}
                        errorClassName={classNames.error}
                        isDisabled={isPending}
                    />
                    <QueryFormButton
                        sx={{
                            color: 'secondary.main',
                            '&:hover': {
                                // should this be the default for this control?
                                color: 'secondary.dark',
                            },
                            alignSelf: 'center',
                            gridArea: 'button',
                        }}
                        type="submit"
                        aria-label="Submit function response"
                        disabled={isPending}>
                        <Send />
                    </QueryFormButton>
                </CollapsibleWidgetContent>
            </form>
        </FormProvider>
    );
};

export { ToolCallUserResponse };
