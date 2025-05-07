import { useLocation } from 'react-router-dom';

import { useFeatureToggles } from '@/FeatureToggleContext';
import { links } from '@/Links';

import { AvatarMenuIconButton } from './AvatarMenuIconButton';
import { CorpusLinkIconButton } from './CorpusLinkIconButton';
import { NewThreadIconButton } from './NewThreadIconButton';
import { ParameterIconButton } from './ParameterIconButton';
import { ShareThreadIconButton } from './ShareThreadIconButton';

export const ThreadPageControls = (): React.ReactNode => {
    const { isCorpusLinkEnabled, isModelConfigEnabled } = useFeatureToggles();
    const { pathname } = useLocation();
    switch (true) {
        case pathname === links.modelConfiguration && isModelConfigEnabled:
            return <AvatarMenuIconButton />;

        default:
            return (
                <>
                    <AvatarMenuIconButton />
                    <ParameterIconButton />
                    {isCorpusLinkEnabled && <CorpusLinkIconButton />}
                    <NewThreadIconButton />
                    <ShareThreadIconButton />
                </>
            );
    }
};
