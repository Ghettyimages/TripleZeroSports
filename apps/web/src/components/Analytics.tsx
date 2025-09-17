'use client';

import Script from 'next/script';
import { siteConfig } from '@/config/site';

export function Analytics() {
  return (
    <>
      {siteConfig.analytics.ga4Id && (
        <>
          <Script
            src={`https://www.googletagmanager.com/gtag/js?id=${siteConfig.analytics.ga4Id}`}
            strategy="afterInteractive"
          />
          <Script id="google-analytics" strategy="afterInteractive">
            {`
              window.dataLayer = window.dataLayer || [];
              function gtag(){dataLayer.push(arguments);}
              gtag('js', new Date());
              gtag('config', '${siteConfig.analytics.ga4Id}');
            `}
          </Script>
        </>
      )}
      
      {siteConfig.analytics.plausibleDomain && (
        <Script
          defer
          data-domain={siteConfig.analytics.plausibleDomain}
          src="https://plausible.io/js/script.js"
          strategy="afterInteractive"
        />
      )}
    </>
  );
}

