import { useMatch } from 'react-router-dom';

import { links } from '@/Links';

import { NewThreadIconButton } from './NewThreadIconButton';
import { ParameterIconButton } from './ParameterIconButton';
import { ShareThreadIconButton } from './ShareThreadIconButton';

export const ThreadPageControls = (): React.ReactNode => {
    const isOnThreadPage = useMatch({ path: links.thread(':id') });

    return (
        <>
            {isOnThreadPage && (
                <>
                    <ShareThreadIconButton />
                    <ParameterIconButton />
                </>
            )}
            <NewThreadIconButton />
        </>
    );
};
