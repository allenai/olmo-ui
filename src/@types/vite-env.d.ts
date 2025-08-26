/// <reference types="vite/client" />

interface ImportMetaEnv {
    readonly PLAYWRIGHT_BASE_URL: string;
    readonly VITE_IS_MODEL_CONFIG_ENABLED: string;
    readonly VITE_IS_COMPARISON_PAGE_ENABLED: string;
    readonly VITE_IS_OLMO_ASR_ENABLED: string;
    readonly VITE_BASE_URL: string;
    readonly VITE_API_URL?: string;
    readonly VITE_DOLMA_API_URL: string;
    readonly VITE_ENABLE_MOCKING: string;
    readonly VITE_IS_CORPUS_LINK_ENABLED: string;
    readonly VITE_AUTH0_DOMAIN: string;
    readonly VITE_AUTH0_CLIENT_ID: string;
    readonly VITE_AUTH0_OLMO_API_AUDIENCE: string;
    readonly VITE_IS_ATTRIBUTION_SPAN_FIRST_ENABLED: string;
    readonly VITE_ABSOLUTE_SPAN_SCORE: string;
    readonly VITE_BUCKET_COLORS: string;
    readonly VITE_IS_DATASET_EXPLORER_ENABLED: string;
    readonly VITE_RECAPTCHA_SITE_KEY: string;
    readonly VITE_IS_RECAPTCHA_ENABLED: string;
    readonly VITE_HEAP_ANALYTICS_ID: string;
    readonly VITE_IS_ANALYTICS_ENABLED: string;
    readonly E2E_TEST_USER: string;
    readonly E2E_TEST_PASSWORD: string;
    readonly VITE_IS_MULTI_MODAL_ENABLED: string;
}

interface ImportMeta {
    readonly env: ImportMetaEnv;
}
