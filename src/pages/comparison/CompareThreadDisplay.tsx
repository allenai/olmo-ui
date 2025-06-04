import { css } from '@allenai/varnish-panda-runtime/css';
import { SelectChangeEvent } from '@mui/material';

import { Model } from '@/api/playgroundApi/additionalTypes';
import { useThread } from '@/api/playgroundApi/thread';
import { appContext, useAppContext } from '@/AppContext';
import { ModelSelect } from '@/components/thread/ModelSelect/ModelSelect';
import { isModelVisible, useModels } from '@/components/thread/ModelSelect/useModels';
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

// TODO Implement (columns degrade to tabs)
export const CompareThreadDisplay = () => {
    const models = useModels({
        // add back including model from state/params
        // || model.id === selectedModelIdFromState
        select: (data) => data.filter((model) => isModelVisible(model)),
    });

    const { selectedCompareModels } = appContext.getState();

    return (
        <div className={containerStyle}>
            {selectedCompareModels?.map(({ threadViewId, rootThreadId }, idx) => {
                return (
                    <SingleThreadContainer
                        key={idx}
                        threadViewIdx={threadViewId}
                        threadRootId={rootThreadId}
                        models={models}
                    />
                );
            })}
        </div>
    );
};

interface SingleThreadContainerProps {
    threadViewIdx: string;
    models: Model[];
    threadRootId?: string;
}

const SingleThreadContainer = ({
    threadViewIdx,
    models,
    threadRootId,
}: SingleThreadContainerProps) => {
    return (
        <div>
            <CompareModelSelect threadViewId={threadViewIdx} models={models} />
            {/* TODO, render either placeholder or real */}
            {threadRootId ? ( // TODO: proper placeholder
                <SingleThread threadRootId={threadRootId} />
            ) : null}
        </div>
    );
};

interface CompareModelSelectProps {
    threadViewId: string;
    models: Model[];
}

const CompareModelSelect = ({ threadViewId, models }: CompareModelSelectProps) => {
    const { setSelectedCompareModelAt } = useAppContext();

    const selectedModelId = useAppContext((state) => {
        return state.selectedCompareModels?.find((model) => {
            return model.threadViewId === threadViewId;
        })?.model.id;
    });

    const handleModelChange = (e: SelectChangeEvent) => {
        // all models -- is compatible
        // change selected model
        const selectedModel = models.find((model) => model.id === e.target.value);
        if (selectedModel) {
            setSelectedCompareModelAt(threadViewId, selectedModel);
        }
    };

    return (
        <ModelSelect
            id={threadViewId}
            models={models}
            selectedModelId={selectedModelId}
            onModelChange={handleModelChange}
        />
    );
};

interface SingleThreadProps {
    threadRootId: string;
}

const SingleThread = ({ threadRootId = 'msg_X2R1E9R0L2' }: SingleThreadProps) => {
    const shouldShowAttributionHighlightDescription = false;
    const streamingMessageId = null;
    const isUpdatingMessageContent = false;
    const selectedMessageId = undefined;

    let childMessageIds: string[] = [];
    const { data } = useThread(threadRootId);

    if (data) {
        const { messages } = data;
        childMessageIds = messages.map((message) => {
            return message.id;
        });
    }

    return (
        <ThreadDisplay
            threadId={threadRootId}
            childMessageIds={childMessageIds}
            shouldShowAttributionHighlightDescription={shouldShowAttributionHighlightDescription}
            streamingMessageId={streamingMessageId}
            isUpdatingMessageContent={isUpdatingMessageContent}
            selectedMessageId={selectedMessageId}
        />
    );
};
