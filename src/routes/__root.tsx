import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import {
  Outlet,
  Link,
  createRootRouteWithContext,
  useRouter,
  HeadContent,
  Scripts,
} from "@tanstack/react-router";
import { useEffect, type ReactNode } from "react";

import appCss from "../styles.css?url";
import { reportLovableError } from "../lib/lovable-error-reporting";

function NotFoundComponent() {
  return (
    <div className="flex min-h-screen items-center justify-center bg-background px-4">
      <div className="max-w-md text-center">
        <h1 className="text-7xl font-bold text-foreground">404</h1>
        <h2 className="mt-4 text-xl font-semibold text-foreground">Página não encontrada</h2>
        <p className="mt-2 text-sm text-muted-foreground">
          O endereço que você procura não existe ou foi movido.
        </p>
        <div className="mt-6">
          <Link
            to="/"
            className="inline-flex items-center justify-center rounded-md bg-primary px-4 py-2 text-sm font-medium text-primary-foreground transition-colors hover:bg-primary/90"
          >
            Voltar ao início
          </Link>
        </div>
      </div>
    </div>
  );
}

function ErrorComponent({ error, reset }: { error: Error; reset: () => void }) {
  console.error(error);
  const router = useRouter();
  useEffect(() => {
    reportLovableError(error, { boundary: "tanstack_root_error_component" });
  }, [error]);

  return (
    <div className="flex min-h-screen items-center justify-center bg-background px-4">
      <div className="max-w-md text-center">
        <h1 className="text-xl font-semibold tracking-tight text-foreground">
          A página não carregou
        </h1>
        <p className="mt-2 text-sm text-muted-foreground">
          Algo falhou do nosso lado. Tente atualizar ou volte ao início.
        </p>
        <div className="mt-6 flex flex-wrap justify-center gap-2">
          <button
            onClick={() => {
              router.invalidate();
              reset();
            }}
            className="inline-flex items-center justify-center rounded-md bg-primary px-4 py-2 text-sm font-medium text-primary-foreground transition-colors hover:bg-primary/90"
          >
            Tentar de novo
          </button>
          <a
            href="/"
            className="inline-flex items-center justify-center rounded-md border border-input bg-background px-4 py-2 text-sm font-medium text-foreground transition-colors hover:bg-accent"
          >
            Voltar ao início
          </a>
        </div>
      </div>
    </div>
  );
}

export const Route = createRootRouteWithContext<{ queryClient: QueryClient }>()({
  head: () => ({
    meta: [
      { charSet: "utf-8" },
      { name: "viewport", content: "width=device-width, initial-scale=1" },
      { title: "Kihon Care | Atendimento Domiciliar" },
      {
        name: "description",
        content:
          "Cuidador de idosos, técnico de enfermagem e banho no leito em casa, na Zona Sul de São Paulo.",
      },
      { name: "author", content: "Kihon Care" },
      { property: "og:title", content: "Kihon Care | Atendimento Domiciliar" },
      {
        property: "og:description",
        content: "Cuidado em casa para idosos e pessoas acamadas. Orçamento pelo WhatsApp.",
      },
      { property: "og:type", content: "website" },
      { name: "twitter:card", content: "summary_large_image" },
      { name: "robots", content: "noindex, nofollow" },
    ],
    scripts: [
      // Google Tag Manager — mesmo container do Kihon.
      {
        children: `(function(w,d,s,l,i){w[l]=w[l]||[];w[l].push({'gtm.start':
new Date().getTime(),event:'gtm.js'});var f=d.getElementsByTagName(s)[0],
j=d.createElement(s),dl=l!='dataLayer'?'&l='+l:'';j.async=true;j.src=
'https://www.googletagmanager.com/gtm.js?id='+i+dl;f.parentNode.insertBefore(j,f);
})(window,document,'script','dataLayer','GTM-WZD86X9');`,
      },
      // Meta Pixel — mesmo pixel do Kihon.
      {
        children: `!function(f,b,e,v,n,t,s)
{if(f.fbq)return;n=f.fbq=function(){n.callMethod?
n.callMethod.apply(n,arguments):n.queue.push(arguments)};
if(!f._fbq)f._fbq=n;n.push=n;n.loaded=!0;n.version='2.0';
n.queue=[];t=b.createElement(e);t.async=!0;
t.src=v;s=b.getElementsByTagName(e)[0];
s.parentNode.insertBefore(t,s)}(window,document,'script',
'https://connect.facebook.net/en_US/fbevents.js');
fbq('init', '364216980927462');
fbq('track', 'PageView');`,
      },
      // Rastreamento Claraia/ReativaZap (TrackingManager) — registra o acesso e
      // reescreve os links do WhatsApp para passar pelo redirect de atribuição.
      // O telefone aqui precisa ser o MESMO de WHATSAPP_PHONE em routes/index.tsx.
      {
        children: `(function() {
  var base = 'https://api-claraia.claraia.com/tracking/redirect?company_id=c37a2390-a9db-4451-ad99-1d92086ab794&config_id=987d9192-b9fc-4a9f-bccb-7de95ab0d677&code_pattern=%5BSENHA+xxxx%5D&phone=551123660490';
  var shared = new URLSearchParams(window.location.search);
  shared.set('landing_page_url', window.location.href);
  shared.set('referrer_url', document.referrer || '');
  var ua = navigator.userAgent.toLowerCase();
  shared.set('device', /bot|crawl|spider/.test(ua) ? 'bot' : /mobile|android|iphone|ipod/.test(ua) ? 'mobile' : /tablet|ipad/.test(ua) ? 'tablet' : 'desktop');

  try {
    fetch('https://api-claraia.claraia.com/tracking/register-pageview', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({
        company_id: 'c37a2390-a9db-4451-ad99-1d92086ab794',
        pagina: window.location.href,
        referrer_url: document.referrer,
        utm_source: shared.get('utm_source'),
        utm_medium: shared.get('utm_medium'),
        utm_campaign: shared.get('utm_campaign'),
        utm_content: shared.get('utm_content'),
        utm_term: shared.get('utm_term'),
        gclid: shared.get('gclid'),
        fbclid: shared.get('fbclid'),
        gad_campaignid: shared.get('gad_campaignid'),
        user_agent: navigator.userAgent
      }),
      keepalive: true
    })
    .then(function(r) { return r.json(); })
    .then(function(data) {
      if (data && data.id) {
        var startedAt = Date.now();
        var sent = false;
        var sendEngagement = function() {
          if (sent) return;
          sent = true;
          var elapsed = Date.now() - startedAt;
          var payload = JSON.stringify({
            pageview_id: data.id,
            company_id: 'c37a2390-a9db-4451-ad99-1d92086ab794',
            time_on_page_ms: elapsed
          });
          try {
            if (navigator.sendBeacon) {
              var blob = new Blob([payload], { type: 'application/json' });
              navigator.sendBeacon('https://api-claraia.claraia.com/tracking/register-engagement', blob);
            } else {
              fetch('https://api-claraia.claraia.com/tracking/register-engagement', {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: payload,
                keepalive: true
              }).catch(function() {});
            }
          } catch (e) {}
        };
        document.addEventListener('visibilitychange', function() {
          if (document.visibilityState === 'hidden') sendEngagement();
        });
        window.addEventListener('pagehide', sendEngagement);
      }
    })
    .catch(function() {});
  } catch (e) {}

  function buildLink(a) {
    var p = new URLSearchParams(shared.toString());
    var txt = (a.innerText || a.textContent || '').trim() || a.getAttribute('aria-label') || '';
    if (txt) p.set('button_text', txt);
    return base + '&' + p.toString();
  }

  function replaceLinks() {
    document.querySelectorAll('a').forEach(function(a) {
      a.href = buildLink(a);
    });
  }

  document.addEventListener('DOMContentLoaded', replaceLinks);

  var observer = new MutationObserver(replaceLinks);
  observer.observe(document.body, { childList: true, subtree: true });
})();`,
      },
    ],
    links: [
      {
        rel: "stylesheet",
        href: appCss,
      },
      {
        rel: "stylesheet",
        href: "https://fonts.googleapis.com/css2?family=Montserrat:wght@400;500;600;700;800&family=Sora:wght@400;500;600&display=swap",
      },
      { rel: "icon", href: "/favicon.ico", type: "image/x-icon" },
    ],
  }),
  shellComponent: RootShell,
  component: RootComponent,
  notFoundComponent: NotFoundComponent,
  errorComponent: ErrorComponent,
});

function RootShell({ children }: { children: ReactNode }) {
  return (
    <html lang="pt-BR">
      <head>
        <HeadContent />
      </head>
      <body>
        {/* Google Tag Manager (noscript) */}
        <noscript>
          <iframe
            src="https://www.googletagmanager.com/ns.html?id=GTM-WZD86X9"
            height="0"
            width="0"
            style={{ display: "none", visibility: "hidden" }}
          />
        </noscript>
        {children}
        <Scripts />
      </body>
    </html>
  );
}

function RootComponent() {
  const { queryClient } = Route.useRouteContext();

  return (
    <QueryClientProvider client={queryClient}>
      {/* Required: nested routes render here. Removing <Outlet /> breaks all child routes. */}
      <Outlet />
    </QueryClientProvider>
  );
}
