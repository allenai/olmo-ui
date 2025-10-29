import { AvatarMenuIconButton } from '@/components/thread/ThreadPageControls/AvatarMenuIconButton';
import { NewThreadIconButton } from '@/components/thread/ThreadPageControls/NewThreadIconButton';
import { ParameterIconButton } from '@/components/thread/ThreadPageControls/ParameterIconButton';
import { ShareThreadIconButton } from '@/components/thread/ThreadPageControls/ShareThreadIconButton';

export const AgentPageControls = (): React.ReactNode => {
    return (
        <>
            <AvatarMenuIconButton />
            <ParameterIconButton />
            <NewThreadIconButton />
            <ShareThreadIconButton />
        </>
    );
};
