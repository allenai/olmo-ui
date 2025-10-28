import { type ReactNode } from 'react';

import { MessageId } from '@/api/playgroundApi/thread';

import { useSpanHighlighting } from '../attribution/highlighting/useSpanHighlighting';
import { MarkdownRenderer } from '../Markdown/MarkdownRenderer';

export interface MessageProps {
    messageId: MessageId;
}
export const StandardMessage = ({ messageId }: MessageProps): ReactNode => {
    const contentWithMarks = useSpanHighlighting(messageId);

    return <MarkdownRenderer>{contentWithMarks}</MarkdownRenderer>;
};
