import { css } from '@allenai/varnish-panda-runtime/css';
import { ReactNode } from 'react';

import { type MessageId, useMessage } from '@/api/playgroundApi/thread';
import { ThinkingWidget } from '@/components/widgets/ThinkingWidget';
import { useThreadView } from '@/pages/comparison/ThreadViewContext';

import { MarkdownRenderer } from '../Markdown/MarkdownRenderer';

interface MessageThinkingProps {
    messageId: MessageId;
}

export const MessageThinking = ({ messageId }: MessageThinkingProps): ReactNode => {
    const { threadId } = useThreadView();
    const { message } = useMessage(threadId, messageId);

    if (!message?.thinking) {
        return null;
    }

    return (
        <ThinkingWidget
            thinking={!message.final}
            className={css({ marginBottom: '2', maxHeight: '[536px]' })}>
            <MarkdownRenderer>{message.thinking}</MarkdownRenderer>
        </ThinkingWidget>
    );
};
