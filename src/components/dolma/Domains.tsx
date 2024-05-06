import { useEffect, useState } from 'react';

import { staticData } from '../../api/dolma/staticData';
import { StaticDataClient } from '../../api/dolma/StaticDataClient';
import { DomainData, DomainsTable } from './DomainsTable';

export const Domains = () => {
    const [loading, setLoading] = useState<boolean>(false);
    const [sources, setSources] = useState<staticData.Sources>({});
    const [domainData, setDomainData] = useState<DomainData[]>([]);

    const api = new StaticDataClient();

    useEffect(() => {
        setLoading(true);
        api.getSources().then((s) => {
            setSources(
                Object.fromEntries(
                    Object.entries(s).filter(([_k, v]) =>
                        v.staticData.includes(staticData.StaticDataType.Domains)
                    )
                )
            );
            api.getDomains().then((data) => {
                const newData: DomainData[] = [];
                Object.entries(data).forEach(([kSource, vSource]) => {
                    Object.entries(vSource).forEach(([kDomain, vDomain]) => {
                        newData.push({ source: kSource, domain: kDomain, docCount: vDomain });
                    });
                });
                setDomainData(newData);
                setLoading(false);
            });
        });
    }, []);

    return <DomainsTable sources={sources} domains={domainData} loading={loading} />;
};
