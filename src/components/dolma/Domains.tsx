import { LoaderFunction } from 'react-router-dom';

import { StaticDataClient } from '../../api/dolma/StaticDataClient';
import { DomainData } from './DomainsTable';

export const domainsLoader: LoaderFunction = async (): Promise<Response> => {
    try {
        const api = new StaticDataClient();

        const sources = await api.getSources();
        const domains = await api.getDomains();
        const domainData: DomainData[] = [];
        Object.entries(domains).forEach(([sourceKey, domainCountPairs]) => {
            Object.entries(domainCountPairs).forEach(([domain, count]) => {
                domainData.push({
                    source: sources[sourceKey].label,
                    domain,
                    docCount: count,
                });
            });
        });

        return new Response(JSON.stringify(domainData), {
            status: 200,
            headers: { 'Content-Type': 'application/json' },
        });
    } catch (error) {
        console.error('Error in DomainsLoader:', error);
        return new Response(JSON.stringify({ error: 'Internal Server Error' }), {
            status: 500,
            headers: { 'Content-Type': 'application/json' },
        });
    }
};
