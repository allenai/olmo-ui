import React, { useEffect, useState } from 'react';
import { useParams } from 'react-router-dom';
import { Box, LinearProgress } from '@mui/material';

import { useAppContext } from '../AppContext';

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

    const { userInfo } = useAppContext();
    useEffect(() => {
        const url = `${process.env.LLMX_API_URL}/v2/data/doc/${params.id}`;
        const headers = {
            'Content-Type': 'application/json',
            Authorization: `Bearer ${userInfo.data?.token}`,
        };
        fetch(url, { headers })
            .then((r) => r.json())
            .then((r) => setDoc(r));
    }, [userInfo.data?.token, params]);

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
