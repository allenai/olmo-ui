import { MEDIUM_LAYOUT_BREAKPOINT } from '@/constants';
import { useFeatureToggles } from '@/FeatureToggleContext';
import { links } from '@/Links';
import { FEATURED_FAMILIES } from '@/pages/model/featuredModels';

import { ModelIcon } from '../assets/ModelIcon';
import { useModels } from '../thread/ModelSelect/useModels';
import { NavigationLink } from './NavigationLink';

interface ModelNavigationProps {
    doesMatchPath: (...paths: string[]) => boolean;
    showFeaturedFamilies?: boolean;
}

export const ModelNavigation = ({ doesMatchPath, showFeaturedFamilies }: ModelNavigationProps) => {
    const { isModelPageEnabled } = useFeatureToggles();
    const models = useModels({
        // select: selectAvailableModels,
    });

    if (!isModelPageEnabled) {
        return null;
    }

    const modelsToShow = FEATURED_FAMILIES.map(({ firstModelWith, name }) => ({
        modelId: models.find(({ id }) => id.toLocaleLowerCase().startsWith(firstModelWith))?.id,
        name,
    })).filter(({ modelId }) => modelId);

    return (
        <>
            <NavigationLink
                icon={<ModelIcon />}
                selected={doesMatchPath(links.model.root)}
                href={links.model.root}>
                Models
            </NavigationLink>
            {showFeaturedFamilies &&
                modelsToShow.map(({ modelId, name }) => (
                    <NavigationLink
                        key={modelId}
                        href={links.selectModel(modelId)}
                        disclosureText="New"
                        sx={(theme) => ({
                            [theme.breakpoints.down(MEDIUM_LAYOUT_BREAKPOINT)]: {
                                display: 'none',
                            },
                        })}>
                        {name}
                    </NavigationLink>
                ))}
        </>
    );
};
