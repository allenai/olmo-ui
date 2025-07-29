import { css } from '@allenai/varnish-panda-runtime/css';
import { useState } from 'react';

import { useStreamEvent } from '@/contexts/StreamContext';

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

    // Handle form reset on first message
    useStreamEvent('onFirstMessage', (_threadViewId: string, _message) => {
        setShouldResetForm(true);

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
