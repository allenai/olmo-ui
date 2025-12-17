import { Link } from '@allenai/varnish-ui';
import type { ReactNode } from 'react';

import type { SchemaModelHost } from '@/api/playgroundApi/playgroundApiSchema';

interface HostIdMeta {
    label: string;
    description?: ReactNode;
}

interface ModelHostMeta {
    hostIdMeta: HostIdMeta;
    friendlyName: string;
}

export const modelHostMeta: Record<SchemaModelHost, ModelHostMeta> = {
    beaker_queues: {
        friendlyName: 'Beaker Queues',
        hostIdMeta: {
            label: 'Queue ID',
        },
    },
    cirrascale: {
        friendlyName: 'Cirrascale',
        hostIdMeta: {
            label: 'Model name',
        },
    },
    modal_openai: {
        friendlyName: 'Modal (OpenAI-compatible)',
        hostIdMeta: {
            label: 'Modal app URL',
        },
    },
    ai2_model_hub: {
        friendlyName: 'Ai2 Model Hub',
        hostIdMeta: {
            label: 'Model Id',
            description: (
                <>
                    Use <strong>Model Name</strong> from{` `}
                    <Link
                        href="https://ai2-model-hub.allen.ai/ui/model_hub_table"
                        target="_blank"
                        rel="noopener">
                        Model Hub listing
                    </Link>
                </>
            ),
        },
    },
    modal: {
        friendlyName: 'Modal',
        hostIdMeta: {
            label: 'App ID',
            description: (
                <Link
                    href="https://github.com/allenai/reviz-modal/blob/main/docs/self-serve-hosting.md"
                    target="_blank"
                    rel="noopener">
                    View Modal hosting docs
                </Link>
            ),
        },
    },
    cirrascale_backend: {
        friendlyName: 'Cirrascale (Backend)',
        hostIdMeta: {
            label: 'Backend API Port',
            description: (
                <span>
                    The port this model runs on. E.g.{' '}
                    <code>https://ai2models.cirrascalecloud.services:{'<PORT>'}/v1/models</code>
                </span>
            ),
        },
    },
    inferd: {
        friendlyName: 'InferD',
        hostIdMeta: {
            label: 'Compute Source ID',
        },
    },
    test_backend: {
        friendlyName: 'Fake model, do not use',
        hostIdMeta: {
            label: 'Fake model name',
        },
    },
} as const;
