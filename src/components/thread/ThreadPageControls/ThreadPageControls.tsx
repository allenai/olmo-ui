import { useFeatureToggles } from '@/FeatureToggleContext';

import { AvatarMenu } from './AvatarMenu';
import { CorpusLinkIconButton } from './CorpusLinkIconButton';
import { NewThreadIconButton } from './NewThreadIconButton';
import { ParameterIconButton } from './ParameterIconButton';
import { ShareThreadIconButton } from './ShareThreadIconButton';

export const ThreadPageControls = (): React.ReactNode => {
    const { isCorpusLinkEnabled } = useFeatureToggles();

    return (
        <>
            <AvatarMenu />
            <ParameterIconButton />
            {isCorpusLinkEnabled && <CorpusLinkIconButton />}
            <NewThreadIconButton />
            <ShareThreadIconButton />
        </>
    );
};
