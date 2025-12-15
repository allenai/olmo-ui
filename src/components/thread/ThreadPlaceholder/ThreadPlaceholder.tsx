import { ButtonLink } from '@allenai/varnish-ui';
import { ArrowOutwardOutlined, WysiwygOutlined } from '@mui/icons-material';
import { Box, Typography } from '@mui/material';

import { ImageSpinner } from '@/components/ImageSpinner';
import { ToolCallDisplay } from '@/components/toolCalling/ToolCallDisplay';
import { useQueryContext } from '@/contexts/QueryContext';
import { RemoteState } from '@/contexts/util';
import { useFeatureToggles } from '@/FeatureToggleContext';

import { LegalNotice } from '../LegalNotice/LegalNotice';
import { usePromptTemplates } from '../promptTemplates/usePromptTemplates';
import { Announcement } from './Announcement';
import { examplesList } from './examplesList';
import { ModelExampleList } from './ModelExampleList';
import { ThreadPlaceholderContentWrapper } from './ThreadPlaceholderContentWrapper';

const ANNOUNCEMENT_ID = 'molmo2-8b';
const ANNOUNCEMENT_NAME = 'Molmo 2';

export const ThreadPlaceholder = () => {
    const { remoteState, getThreadViewModel } = useQueryContext();
    const selectedModel = getThreadViewModel();
    const isLoading = remoteState === RemoteState.Loading;

    const { isAnnouncementEnabled } = useFeatureToggles();

    const modelExamples = examplesList.find((item) =>
        selectedModel ? selectedModel.id === item.modelId : false
    );
    const { data: exampleTemplates } = usePromptTemplates({
        select: (allTemplates) =>
            allTemplates.filter((tmp) => modelExamples?.templateIds.includes(tmp.id)),
    });

    return (
        <ThreadPlaceholderContentWrapper>
            <Box gridColumn="1/-1">
                <LegalNotice />
                {isAnnouncementEnabled ? (
                    <Announcement modelId={ANNOUNCEMENT_ID} modelName={ANNOUNCEMENT_NAME} />
                ) : null}
            </Box>
            <Box
                display="flex"
                flexDirection="column"
                justifyContent="center"
                alignItems="center"
                marginBottom={4}
                gap={4}
                flex={1}
                gridColumn="1 / -1">
                {isLoading || !selectedModel?.id || !modelExamples || !exampleTemplates.length ? (
                    <ImageSpinner
                        src="/ai2-monogram.svg"
                        isAnimating={isLoading}
                        width={70}
                        height={70}
                        alt=""
                    />
                ) : (
                    <ModelExampleList
                        modelId={selectedModel.id}
                        introText={modelExamples.introText}
                        promptTemplates={exampleTemplates}
                    />
                )}
                {!!selectedModel?.information_url && (
                    <Box minHeight={40} textAlign="center">
                        <ButtonLink
                            variant="text"
                            color="primary"
                            href={selectedModel.information_url || undefined}
                            target="_blank"
                            rel="noopener"
                            startIcon={<WysiwygOutlined />}
                            endIcon={<ArrowOutwardOutlined />}>
                            {`Read more about ${selectedModel.name}`}
                        </ButtonLink>
                    </Box>
                )}
                <ToolCallDisplay />
            </Box>
            <Typography variant="body1">
                <br />
                {/* TODO: This still working text will need to show up at some point when we add the loading states
                    We need  
                */}
                {/* Still working... */}
            </Typography>
        </ThreadPlaceholderContentWrapper>
    );
};
