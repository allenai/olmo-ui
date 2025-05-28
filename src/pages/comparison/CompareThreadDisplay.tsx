import { css } from '@allenai/varnish-panda-runtime/css';

import { ModelSelect } from '@/components/thread/ModelSelect/ModelSelect';
import { ThreadDisplay } from '@/components/thread/ThreadDisplay/ThreadDisplay';

const containerStyle = css({
    gridArea: 'content',
    paddingInline: '5',
    paddingBlockEnd: '2',
    minWidth: '[0]',
    minHeight: '[0]',
    gap: '2',
    justifyContent: 'center',
    display: 'grid',
    gridAutoFlow: 'column',
});

// TODO Implement (columns degrate to tabs)
export const CompareThreadDisplay = () => {
    return (
        <div className={containerStyle}>
            <SingleThread />
            <SingleThread />
        </div>
    );
};

// TODO get messages and handle model select
const SingleThread = () => {
    return (
        <div>
            <ModelSelect />
            <ThreadDisplay
                childMessageIds={[]}
                shouldShowAttributionHighlightDescription={false}
                streamingMessageId={null}
                isUpdatingMessageContent={false}
            />
        </div>
    );
};
