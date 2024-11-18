import { Box, Card, Link, SelectChangeEvent, Stack, Typography } from '@mui/material';
import { LoaderFunction, Outlet, ShouldRevalidateFunction } from 'react-router-dom';

import { appContext, useAppContext } from '@/AppContext';
import { useDesktopOrUp } from '@/components/dolma/shared';
import { MetaTags } from '@/components/MetaTags';
import { TermAndConditionsLink } from '@/components/TermsAndConditionsLink';
import { AttributionDrawer } from '@/components/thread/attribution/drawer/AttributionDrawer';
import { ModelSelectionDisplay } from '@/components/thread/ModelSelectionDisplay';
import { ParameterDrawer } from '@/components/thread/parameter/ParameterDrawer';
import { QueryForm } from '@/components/thread/QueryForm';
import { ThreadPageControls } from '@/components/thread/ThreadPageControls';
import { ThreadTabs } from '@/components/thread/ThreadTabs';
import { DESKTOP_LAYOUT_BREAKPOINT } from '@/constants';
import { links } from '@/Links';

export const UIRefreshThreadPage = () => {
    const models = useAppContext((state) => state.models);
    const setSelectedModel = useAppContext((state) => state.setSelectedModel);
    const selectedModel = useAppContext((state) => state.selectedModel);

    const onModelChange = (event: SelectChangeEvent) => {
        setSelectedModel(event.target.value);
    };

    const isDesktop = useDesktopOrUp();

    return (
        <>
            <MetaTags title="Ai2 Playground" />
            <Card
                variant="elevation"
                elevation={0}
                sx={(theme) => ({
                    flexGrow: '1',
                    gridArea: 'content',
                    paddingBlockStart: 2,
                    [theme.breakpoints.up(DESKTOP_LAYOUT_BREAKPOINT)]: {
                        paddingBlockStart: 0,
                    },
                })}>
                <Stack
                    gap={2}
                    sx={{
                        containerName: 'thread-page',
                        containerType: 'inline-size',

                        backgroundColor: 'transparent',
                        height: 1,
                    }}>
                    <Box
                        sx={{
                            display: 'grid',
                            gridTemplateColumns: '1fr max-content',
                            columnGap: 1,
                            paddingInline: 2,
                            width: '100%',
                            maxWidth: '750px',
                            margin: '0 auto',
                        }}>
                        <ModelSelectionDisplay
                            models={models}
                            selectedModel={selectedModel}
                            onModelChange={onModelChange}
                            label="Model"
                            shouldOnlyShowAtDesktop={true}
                        />
                        <ThreadPageControls />
                        <ModelSelectionDisplay
                            models={models}
                            selectedModel={selectedModel}
                            onModelChange={onModelChange}
                            label="Model"
                            shouldOnlyShowAtDesktop={false}
                        />
                    </Box>
                    <Outlet />
                    <Stack
                        gap={2}
                        sx={{
                            paddingInline: 2,
                            width: '100%',
                            maxWidth: '750px',
                            margin: '0 auto',
                        }}>
                        <QueryForm />
                        <LegalNotice />
                    </Stack>
                </Stack>
            </Card>

            {isDesktop ? (
                <ThreadTabs />
            ) : (
                <>
                    <AttributionDrawer />
                    <ParameterDrawer />
                </>
            )}
        </>
    );
};

export const LegalNotice = () => {
    const userInfo = useAppContext((state) => state.userInfo);

    return (
        <Typography
            component={Stack}
            gap={1}
            variant="caption"
            sx={{
                '> p': {
                    margin: '0',
                },
            }}>
            {!userInfo?.hasAcceptedTermsAndConditions ? (
                <>
                    <p>
                        By using the Ai2 Playground, you agree to Ai2’s{' '}
                        <TermAndConditionsLink link="https://allenai.org/terms">
                            Terms of use
                        </TermAndConditionsLink>
                        ,{' '}
                        <TermAndConditionsLink link="https://allenai.org/privacy-policy">
                            Privacy policy
                        </TermAndConditionsLink>
                        , and{' '}
                        <TermAndConditionsLink link="https://allenai.org/responsible-use">
                            Responsible use guidelines
                        </TermAndConditionsLink>
                        .
                    </p>
                    <p>
                        Ai2 Playground is a scientific research and educational tool provided to the
                        general public at no cost pursuant to Ai2&apos;s mission as a 501(c)(3)
                        organization.
                    </p>
                </>
            ) : null}
            <p>
                Ai2 models are experimental and can make mistakes. Consider fact-checking your
                results.
            </p>
            <Typography variant="body2">
                This site is protected by reCAPTCHA and the Google{' '}
                <Link href={links.googlePrivacy} target="_blank" rel="noopener noreferrer">
                    Privacy Policy
                </Link>{' '}
                and{' '}
                <Link href={links.googleTerms} target="_blank" rel="noopener noreferrer">
                    Terms of Service
                </Link>{' '}
                apply.
            </Typography>
        </Typography>
    );
};

export const playgroundLoader: LoaderFunction = async ({ params }) => {
    const { models, getAllModels, resetSelectedThreadState, resetAttribution, getSchema, schema } =
        appContext.getState();

    const promises = [];

    if (models.length === 0) {
        promises.push(getAllModels());
    }

    if (schema == null) {
        promises.push(getSchema());
    }

    if (params.id === undefined) {
        resetSelectedThreadState();
        resetAttribution();
    }

    await Promise.all(promises);

    return null;
};

export const handleRevalidation: ShouldRevalidateFunction = ({ nextUrl }) => {
    return nextUrl.pathname === links.playground;
};
