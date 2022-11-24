import '~/styles/globals.css'
import type { AppProps } from 'next/app'
import Script from 'next/script'
import { gaTrackingId } from '~/constants/config'
import NextNProgress from 'nextjs-progressbar'
//React-ga
import { useEffect } from 'react'
import { useRouter } from 'next/router'
import { initGA, logPageView } from '~/utils/analytics'
import Head from 'next/head'

function MyApp({ Component, pageProps }: AppProps) {
  const router = useRouter()

  useEffect(() => {
    initGA()
    // `routeChangeComplete` won't run for the first page load unless the query string is
    // hydrated later on, so here we log a page view if this is the first render and
    // there's no query string
    if (!router.asPath.includes('?')) {
      logPageView()
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [])

  useEffect(() => {
    // Listen for page changes after a navigation or when the query changes
    router.events.on('routeChangeComplete', logPageView)
    return () => {
      router.events.off('routeChangeComplete', logPageView)
    }
  }, [router.events])

  return (
    <>
      <Head>
        <title>政見不失憶：臺灣 2022 選舉政見協作平台</title>
        <meta
          name="description"
          content="政治總是選前端牛肉，選後變空頭？談政見嚴肅不討好，認真實踐卻鮮少獲得關注？READr 協作平台邀請你一起追蹤候選人選舉時提出的政見，並監督他是否在任期內達成。"
        />
      </Head>
      {/* ref: https://nextjs.org/docs/messages/next-script-for-ga#using-gtagjs */}
      {/* Google tag (gtag.js) */}
      <Script
        strategy="afterInteractive"
        src={`https://www.googletagmanager.com/gtag/js?${gaTrackingId}`}
      />
      <Script id="ga-script" strategy="afterInteractive">
        {`
          window.dataLayer = window.dataLayer || [];
          function gtag(){dataLayer.push(arguments);}
          gtag('js', new Date());
          gtag('config', '${gaTrackingId}');
        `}
      </Script>
      <NextNProgress />
      <Component {...pageProps} />
    </>
  )
}

export default MyApp
