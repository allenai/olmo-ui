import { css } from '@allenai/varnish-panda-runtime/css';
import { useState } from 'react';
import { useNavigate, useParams } from 'react-router-dom';

import { useStreamEvent } from '@/contexts/StreamEventRegistry';
import { links } from '@/Links';

import { QueryForm } from './QueryForm';
import { QueryFormNotice, type QueryFormNoticeProps } from './QueryFormNotices';

const queryFormContainerClassName = css({
    display: 'grid',
    gap: '2',
    width: '[100%]',
    maxWidth: '[750px]', // token
    marginInline: 'auto',
});

interface QueryFormContainerProps extends QueryFormNoticeProps {}

export const QueryFormContainer = ({
    selectedModelFamilyId,
}: QueryFormContainerProps): JSX.Element => {
    const [shouldResetForm, setShouldResetForm] = useState(false);
    const navigate = useNavigate();
    const { id: currentThreadId } = useParams<{ id: string }>();

    // Handle form reset and navigation on first message
    useStreamEvent('onFirstMessage', (_threadViewId: string, message) => {
        setShouldResetForm(true);

        // Navigate to thread page when creating a new thread
        if ('id' in message && 'messages' in message && !currentThreadId) {
            navigate(links.thread(message.id));
        }

        // Reset the flag after triggering the reset
        setTimeout(() => {
            setShouldResetForm(false);
        }, 0);
    });

    return (
        <div className={queryFormContainerClassName}>
            <QueryForm shouldResetForm={shouldResetForm} />
            <QueryFormNotice selectedModelFamilyId={selectedModelFamilyId} />
        </div>
    );
};
