import { css } from '@allenai/varnish-panda-runtime/css';
import { ReactNode } from 'react';

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
}: QueryFormContainerProps): ReactNode => {
    return (
        <div className={queryFormContainerClassName}>
            <QueryForm />
            <QueryFormNotice selectedModelFamilyId={selectedModelFamilyId} />
        </div>
    );
};
