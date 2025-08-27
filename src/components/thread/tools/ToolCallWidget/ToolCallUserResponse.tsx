import { sva } from '@allenai/varnish-panda-runtime/css';
import { Send } from '@mui/icons-material';
import { useReCaptcha } from '@wojtekmaj/react-recaptcha-v3';
import { FormProvider, type SubmitHandler, useForm } from 'react-hook-form';

import { analyticsClient } from '@/analytics/AnalyticsClient';
import { SchemaToolCall } from '@/api/playgroundApi/playgroundApiSchema';
import { ControlledInput } from '@/components/form/ControlledInput';
import { handleFormSubmitException } from '@/components/thread/QueryForm/handleFormSubmitException';
import { QueryFormButton } from '@/components/thread/QueryForm/QueryFormButton';
import { QueryFormValues } from '@/components/thread/QueryForm/QueryFormController';
import { CollapsibleWidgetContent } from '@/components/widgets/CollapsibleWidget/CollapsibleWidgetContent';
import { useQueryContext } from '@/contexts/QueryContext';

interface ToolCallUserResponseFormValues {
    content: string;
    private: boolean;
    role: 'tool_call_result';
    toolCallId: SchemaToolCall['toolCallId'];
}

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
    const { executeRecaptcha } = useReCaptcha();

    const formContext = useForm<ToolCallUserResponseFormValues>({
        defaultValues: {
            content: '',
            private: false,
            role: 'tool_call_result',
            toolCallId,
        },
    });

    const queryContext = useQueryContext();

    const handleSubmit = async (data: QueryFormValues) => {
        await queryContext.onSubmit(data);
    };

    const handleSubmitController: SubmitHandler<ToolCallUserResponseFormValues> = async (data) => {
        const isReCaptchaEnabled = process.env.IS_RECAPTCHA_ENABLED;

        if (isReCaptchaEnabled === 'true' && executeRecaptcha == null) {
            analyticsClient.trackCaptchaNotLoaded();
        }

        // TODO: Make sure executeRecaptcha is present when we require recaptchas
        const token =
            isReCaptchaEnabled === 'true'
                ? await executeRecaptcha?.('user_tool_response')
                : undefined;

        try {
            await handleSubmit({
                ...data,
                captchaToken: token,
            });
        } catch (e) {
            handleFormSubmitException(e, formContext);
            console.error(e);
        }
    };

    const classNames = toolCallResponseRecipe();

    return (
        <FormProvider {...formContext}>
            <form onSubmit={formContext.handleSubmit(handleSubmitController)}>
                <CollapsibleWidgetContent contrast="medium" className={classNames.widget}>
                    <ControlledInput
                        name="content"
                        className={classNames.wrapper}
                        fullWidth
                        controllerProps={{ rules: { required: true, minLength: 1 } }}
                        variant="contained"
                        containerClassName={classNames.inputContainer}
                        inputClassName={classNames.input}
                        aria-label="Fucntion response"
                        // @ts-expect-error Placeholder is appearantly not on the varnish-ui component, but it _does_get passed
                        placeholder="Function response"
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
                                disabled={!formContext.formState.isValid}>
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
