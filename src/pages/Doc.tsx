import React, { useEffect, useState } from 'react';
import { useParams } from 'react-router-dom';
import { Box, LinearProgress } from '@mui/material';

import { LoginApiUrl } from '../api/User';

interface DataDoc {
    id: string;
    dolma_id: string;
    text: string;
    first_n: string;
    source: string;
    url?: string;
}

export function Doc() {
    const params = useParams<{ id: string }>();

    const [doc, setDoc] = useState<DataDoc | undefined>();

    useEffect(() => {
        const url = `${process.env.LLMX_API_URL}/v3/data/doc/${params.id}`;
        fetch(url, { credentials: 'include' })
            .then((r) => {
                if (r.status === 401) {
                    document.location.href = LoginApiUrl;
                    return Promise.reject(new Error('Unauthorized'));
                }
                r.json();
            })
            .then((r) => setDoc(r));
    }, [params]);

    return (
        <Box sx={{ background: 'white', borderRadius: 2, p: 2 }}>
            {doc ? (
                <code>
                    <pre>{JSON.stringify(doc, null, 2)}</pre>
                </code>
            ) : (
                <LinearProgress />
            )}
        </Box>
    );
}
