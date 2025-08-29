import { sva } from '@allenai/varnish-panda-runtime/css';
import { Send } from '@mui/icons-material';
import { FormProvider, useForm } from 'react-hook-form';

import { ControlledInput } from '@/components/form/ControlledInput';
import { QueryFormButton } from '@/components/thread/QueryForm/QueryFormButton';
import { CollapsibleWidgetContent } from '@/components/widgets/CollapsibleWidget/CollapsibleWidgetContent';

import { ToolCallUserResponseFormValues, useToolCallUserResponse } from './useToolCallUserResponse';

const toolCallResponseRecipe = sva({
    slots: ['widget', 'wrapper', 'inputContainer', 'input'],
    base: {
        widget: {
            display: 'flex',
            gap: '2',
            alignItems: 'center',
            paddingInline: '0',
            paddingBlock: '0',
        },
        wrapper: {
            flexGrow: '1',
        },
        inputContainer: {
            backgroundColor: '[transparent]',
            paddingInlineEnd: 'var(--padding-inline)',
        },
        input: {
            width: '[100%]',
            paddingInlineStart: '4!', // this is poorly set in varnish-ui -- so I'm cheating
            paddingBlock: '3!', // also can't use important with var, so not re-using those vars()
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
    const labelAndPlaceholder = 'Function response';

    const isSubmitDisabled = isPending || !formContext.formState.isValid;

    return (
        <FormProvider {...formContext}>
            <form onSubmit={formContext.handleSubmit(submitToolCallResponse)}>
                <CollapsibleWidgetContent contrast="medium" className={classNames.widget}>
                    <ControlledInput
                        name="content"
                        className={classNames.wrapper}
                        fullWidth
                        controllerProps={{ rules: { required: true, minLength: 1 } }}
                        variant="contained"
                        containerClassName={classNames.inputContainer}
                        inputClassName={classNames.input}
                        aria-label={labelAndPlaceholder}
                        // @ts-expect-error Placeholder is appearantly not on the varnish-ui component, but it _does_get passed
                        placeholder={labelAndPlaceholder}
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
                                disabled={isSubmitDisabled}>
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
