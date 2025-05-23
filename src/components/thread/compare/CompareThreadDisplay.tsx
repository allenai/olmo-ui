import { css } from '@allenai/varnish-panda-runtime/css';

import { ModelSelect } from '../ModelSelect/ModelSelect';
import { ThreadDisplay } from '../ThreadDisplay/ThreadDisplay';

const containerStyle = css({
    gridArea: 'content',
    paddingInline: '5',
    paddingBlockEnd: '2',
    minWidth: '[0]',
    minHeight: '[0]',
    gap: '2',
    // overflow: 'auto',
    justifyContent: 'center',
    display: 'grid',
    gridAutoFlow: 'column',
});

export const CompareThreadDisplay = () => {
    return (
        <div className={containerStyle}>
            <SingleThread />
            <SingleThread />
        </div>
    );
};

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
