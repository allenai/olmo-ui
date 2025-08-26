import { ReactNode, useEffect } from 'react';
import { Helmet } from 'react-helmet';

import { useUserAuthInfo } from '@/api/auth/auth-loaders';

const OsanoSetup = (): ReactNode => (
    <Helmet>
        <script type="text/javascript" key="osano-setup">
            {/* This sets up window.Osano
                https://developers.osano.com/cmp/javascript-api/developer-documentation-consent-javascript-api#-pre-load-and-windowosano */}
            {`;(function(w,o,d){w[o]=w[o]||function(){w[o][d].push(arguments)};w[o][d]=w[o][d]||[]})(window,'Osano','data');`}
        </script>
        <script
            src="https://cmp.osano.com/AzqB4OUPPVD5j8EeT/004924d5-366d-4c89-9fb9-68f35f29550d/osano.js"
            key="osano-js"></script>
    </Helmet>
);

const HeapSetup = (): ReactNode => (
    <Helmet>
        <script type="text/javascript" key="heap-setup">
            {`
            window.heapReadyCb=window.heapReadyCb||[],window.heap=window.heap||[],heap.load=function(e,t){window.heap.envId=e,window.heap.clientConfig=t=t||{},window.heap.clientConfig.shouldFetchServerConfig=!1;var a=document.createElement("script");a.type="text/javascript",a.async=!0,a.src="https://cdn.us.heap-api.com/config/"+e+"/heap_config.js";var r=document.getElementsByTagName("script")[0];r.parentNode.insertBefore(a,r);var n=["init","startTracking","stopTracking","track","resetIdentity","identify","getSessionId","getUserId","getIdentity","addUserProperties","addEventProperties","removeEventProperty","clearEventProperties","addAccountProperties","addAdapter","addTransformer","addTransformerFn","onReady","addPageviewProperties","removePageviewProperty","clearPageviewProperties","trackPageview"],i=function(e){return function(){var t=Array.prototype.slice.call(arguments,0);window.heapReadyCb.push({name:e,fn:function(){heap[e]&&heap[e].apply(heap,t)}})}};for(var p=0;p<n.length;p++)heap[n[p]]=i(n[p])};
            window.Osano('onAnalytics', () => {
                // Osano doesn't automatically handle Heap's scripts so we need to handle it manually
                heap.load('${import.meta.env.VITE_HEAP_ANALYTICS_ID}')

                // If the user revokes consent we reload the page to un-initialize heap
                window.Osano('onConsentSaved', (consent) => {
                if (consent.ANALYTICS === 'DENY') {
                    window.location.reload();
                }
                })
            })
            `}
        </script>
    </Helmet>
);

export const Analytics = (): ReactNode => {
    const { userInfo, userAuthInfo, isAuthenticated } = useUserAuthInfo();

    useEffect(() => {
        const sendIdentity = () => {
            if (userInfo && userAuthInfo?.sub && window.heap) {
                try {
                    window.heap.identify(userAuthInfo.sub);
                    window.heap.addUserProperties({
                        email: userAuthInfo.email,
                        email_verified: userAuthInfo.email_verified,
                        name: userAuthInfo.name,
                        has_accepted_terms: userInfo.hasAcceptedTermsAndConditions,
                    });
                } catch (e: unknown) {
                    console.error('Something went wrong when calling Heap', e);
                }
            } else {
                setTimeout(sendIdentity, 1000);
            }
        };

        if (isAuthenticated) {
            sendIdentity();
        }
    }, [userInfo, userAuthInfo, isAuthenticated]);

    return (
        <>
            <OsanoSetup />
            <HeapSetup />
        </>
    );
};
