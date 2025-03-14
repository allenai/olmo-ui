import { useFeatureToggles } from '@/FeatureToggleContext';

import { AvatarIconButton } from './AvatarIconButton';
import { CorpusLinkIconButton } from './CorpusLinkIconButton';
import { NewThreadIconButton } from './NewThreadIconButton';
import { ParameterIconButton } from './ParameterIconButton';
import { ShareThreadIconButton } from './ShareThreadIconButton';

export const ThreadPageControls = (): React.ReactNode => {
    const { isCorpusLinkEnabled } = useFeatureToggles();

    return (
        <>
            <AvatarIconButton />
            <ParameterIconButton />
            {isCorpusLinkEnabled && <CorpusLinkIconButton />}
            <NewThreadIconButton />
            <ShareThreadIconButton />
        </>
    );
};
