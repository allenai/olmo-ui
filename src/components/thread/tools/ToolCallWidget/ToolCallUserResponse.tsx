import { sva } from '@allenai/varnish-panda-runtime/css';
import { Input } from '@allenai/varnish-ui';
import { SendOutlined } from '@mui/icons-material';
import { IconButton } from '@mui/material';
import { useReCaptcha } from '@wojtekmaj/react-recaptcha-v3';

import { analyticsClient } from '@/analytics/AnalyticsClient';
import { CollapsibleWidgetContent } from '@/components/widgets/CollapsibleWidget/CollapsibleWidgetContent';
import { useQueryContext } from '@/contexts/QueryContext';

import { QueryFormValues } from '../../QueryForm/QueryFormController';

const toolCallResponseRecipe = sva({
    slots: ['widget', 'wrapper', 'inputContainer', 'input'],
    base: {
        widget: {
            display: 'flex',
            gap: '2',
            alignItems: 'center',
        },
        wrapper: {
            flexGrow: '1',
        },
        inputContainer: {
            backgroundColor: '[transparent]',
        },
        input: {
            width: '[100%]',
        },
    },
});

const ToolCallUserResponse = ({ toolCallId }: { toolCallId: string }) => {
    const classNames = toolCallResponseRecipe();

    const { executeRecaptcha } = useReCaptcha();

    const queryContext = useQueryContext();

    const handleSubmit = async (data: QueryFormValues) => {
        await queryContext.onSubmit(data);
    };

    const handleSubmitController = async (data: object) => {
        // handle weather this is possible or not

        // if (!canEditThread || isSelectedThreadLoading) {
        //     return;
        // }
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
                role: 'tool_call_response',
                toolCallId,
                captchaToken: token,
            });
        } catch (e) {
            // handleFormSubmitException(e, formContext);
            console.error(e);
        }
    };

    return (
        <>
            <CollapsibleWidgetContent contrast="low" className={classNames.widget}>
                <Input
                    variant="contained"
                    className={classNames.wrapper}
                    containerClassName={classNames.inputContainer}
                    inputClassName={classNames.input}
                    // @ts-expect-error - This does get passed correctly, but the type is missing from varnish
                    placeholder="Function response"
                />
                <IconButton onClick={handleSubmitController} aria-label="Submit response">
                    <SendOutlined />
                </IconButton>
            </CollapsibleWidgetContent>
        </>
    );
};

export { ToolCallUserResponse };
