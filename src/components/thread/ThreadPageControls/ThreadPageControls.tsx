import { useFeatureToggles } from '@/FeatureToggleContext';

import { CorpusLinkIconButton } from './CorpusLinkIconButton';
import { NewThreadIconButton } from './NewThreadIconButton';
import { ParameterIconButton } from './ParameterIconButton';
import { ShareThreadIconButton } from './ShareThreadIconButton';

export const ThreadPageControls = (): React.ReactNode => {
    const { isCorpusLinkEnabled } = useFeatureToggles();

    return (
        <>
            <ShareThreadIconButton />
            <ParameterIconButton />
            <NewThreadIconButton />
            {isCorpusLinkEnabled && <CorpusLinkIconButton />}
        </>
    );
};
