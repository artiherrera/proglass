"use client";

import Script from "next/script";

import { GA_MEASUREMENT_ID, KLAVIYO_PUBLIC_KEY } from "@/lib/analytics";

// Loads GA4 + Klaviyo only when their public keys are present. Both are
// fully optional — without keys, nothing renders and the helpers in
// lib/analytics.ts become no-ops.
export function Analytics() {
  return (
    <>
      {GA_MEASUREMENT_ID && (
        <>
          <Script
            src={`https://www.googletagmanager.com/gtag/js?id=${GA_MEASUREMENT_ID}`}
            strategy="afterInteractive"
          />
          <Script id="ga4-init" strategy="afterInteractive">
            {`
              window.dataLayer = window.dataLayer || [];
              function gtag(){dataLayer.push(arguments);}
              gtag('js', new Date());
              gtag('config', '${GA_MEASUREMENT_ID}');
            `}
          </Script>
        </>
      )}

      {KLAVIYO_PUBLIC_KEY && (
        <Script
          id="klaviyo"
          strategy="afterInteractive"
          src={`https://static.klaviyo.com/onsite/js/klaviyo.js?company_id=${KLAVIYO_PUBLIC_KEY}`}
        />
      )}
    </>
  );
}
