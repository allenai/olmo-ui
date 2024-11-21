import { NewThreadIconButton } from './NewThreadIconButton';
import { ParameterIconButton } from './ParameterIconButton';
import { ShareThreadIconButton } from './ShareThreadIconButton';

export const ThreadPageControls = (): React.ReactNode => {
    return (
        <>
            <ShareThreadIconButton />
            <ParameterIconButton />
            <NewThreadIconButton />
        </>
    );
};
