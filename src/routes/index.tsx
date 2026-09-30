import { createFileRoute } from "@tanstack/react-router";
import { FormEvent, useState } from "react";
import {
  ArrowUpRight,
  Bath,
  Bed,
  CalendarCheck,
  CheckCircle2,
  ChevronDown,
  ClipboardList,
  Clock3,
  HeartHandshake,
  Home,
  Menu,
  MapPin,
  Phone,
  Send,
  ShieldCheck,
  Stethoscope,
  Users,
  X,
} from "lucide-react";

// ─────────────────────────────────────────────────────────────────────────────
// Único lugar onde o telefone é definido. Para trocar o número que recebe os
// contatos desta LP, mude SÓ aqui (e a constante do script de rastreamento em
// __root.tsx, que precisa do mesmo telefone).
// ─────────────────────────────────────────────────────────────────────────────
const WHATSAPP_PHONE = "551123660490";
const whatsappUrl = `https://api.whatsapp.com/send?phone=${WHATSAPP_PHONE}`;

// Mesma base do script injetado em __root.tsx. O formulário de contato NÃO é
// um <a>, então o reescritor de links baseado em DOM não o alcança: o submit
// monta a URL de rastreamento na mão, senão essa conversão fica fora da
// atribuição (Funil Visual, UTM, Meta CAPI).
function buildTrackedWhatsAppUrl(message: string): string {
  const base =
    "https://api-claraia.claraia.com/tracking/redirect?company_id=c37a2390-a9db-4451-ad99-1d92086ab794&config_id=987d9192-b9fc-4a9f-bccb-7de95ab0d677&code_pattern=%5BSENHA+xxxx%5D&phone=" +
    WHATSAPP_PHONE;
  try {
    const params = new URLSearchParams(window.location.search);
    params.set("landing_page_url", window.location.href);
    params.set("referrer_url", document.referrer || "");
    const ua = navigator.userAgent.toLowerCase();
    params.set(
      "device",
      /bot|crawl|spider/.test(ua)
        ? "bot"
        : /mobile|android|iphone|ipod/.test(ua)
          ? "mobile"
          : /tablet|ipad/.test(ua)
            ? "tablet"
            : "desktop",
    );
    params.set("button_text", "Formulário de contato");
    params.set("custom_message", message);
    return `${base}&${params.toString()}`;
  } catch {
    return `${whatsappUrl}&text=${encodeURIComponent(message)}`;
  }
}

function wa(message: string) {
  return `${whatsappUrl}&text=${encodeURIComponent(message)}`;
}

const sinais = [
  {
    icon: Clock3,
    title: "Idoso sozinho em casa",
    text: "Precisa de companhia e supervisão durante o dia, enquanto a família trabalha.",
  },
  {
    icon: Bed,
    title: "Pessoa acamada",
    text: "Depende de ajuda para sair da cama, se higienizar e mudar de posição.",
  },
  {
    icon: Stethoscope,
    title: "Pós-cirúrgico ou pós-AVC",
    text: "Alta hospitalar recente, com cuidados que precisam continuar em casa.",
  },
  {
    icon: Users,
    title: "Família sobrecarregada",
    text: "Os parentes cuidam sozinhos há meses e já não dão conta sem se adoecer.",
  },
];

const servicos = [
  {
    icon: Home,
    title: "Cuidador de idosos",
    text: "Companhia, rotina, alimentação, hidratação e auxílio nas atividades do dia a dia.",
  },
  {
    icon: Bath,
    title: "Banho no leito e higiene",
    text: "Higiene assistida no leito ou no banheiro, com técnica e respeito à intimidade.",
  },
  {
    icon: Stethoscope,
    title: "Técnico de enfermagem",
    text: "Curativos, administração de medicação, aferição de pressão e sinais vitais.",
  },
  {
    icon: Clock3,
    title: "Plantão 12h ou 24h",
    text: "Período diurno, noturno ou integral, conforme a necessidade da família.",
  },
  {
    icon: HeartHandshake,
    title: "Estimulação e companhia",
    text: "Conversa, estímulo cognitivo e apoio em quadros de demência e Alzheimer.",
  },
  {
    icon: CalendarCheck,
    title: "Acompanhamento externo",
    text: "Acompanha consultas, exames e retornos, com relato do que foi orientado.",
  },
];

const passos = [
  {
    title: "Você fala com a gente",
    text: "Conte a situação pelo WhatsApp: quem precisa de cuidado, o que ele faz sozinho e que horas a família precisa de apoio.",
  },
  {
    title: "Avaliação do caso",
    text: "Entendemos o grau de dependência e as rotinas para definir se o caso pede cuidador, técnico de enfermagem ou os dois.",
  },
  {
    title: "Plano de cuidado",
    text: "Montamos a escala, o horário e o que será feito em cada visita. Você recebe tudo por escrito antes de começar.",
  },
  {
    title: "Acompanhamento contínuo",
    text: "A gente acompanha o serviço e ajusta o combinado sempre que a rotina da família mudar.",
  },
];

const garantias = [
  {
    icon: ShieldCheck,
    title: "Profissionais verificados",
    text: "Currículo e referências checados antes de entrar na sua casa.",
  },
  {
    icon: ClipboardList,
    title: "Plano escrito",
    text: "Nada combinado só verbalmente: tudo documentado.",
  },
  {
    icon: Phone,
    title: "Contato direto",
    text: "Você fala com a coordenação, não fica no telefone esperando.",
  },
  {
    icon: CheckCircle2,
    title: "Substituição",
    text: "Se o profissional faltar, a substituição é nossa responsabilidade.",
  },
];

const faq = [
  {
    q: "Quais são os valores?",
    a: "O valor depende do tipo de profissional, da quantidade de horas por dia e da frequência semanal. Por isso trabalhamos com orçamento personalizado: você conta a situação pelo WhatsApp e recebe a proposta com o valor antes de decidir — sem custo e sem compromisso.",
  },
  {
    q: "Qual a diferença entre cuidador e técnico de enfermagem?",
    a: "O cuidador cuida das atividades do dia a dia: higiene, alimentação, companhia, mobilidade e rotina. O técnico de enfermagem entra quando há procedimento técnico: curativos, medicação controlada, sondas e monitoramento de sinais vitais. O caso pode exigir os dois.",
  },
  {
    q: "Vocês atendem 24 horas, com dormida?",
    a: "Atendemos plantões de 12h e 24h, incluindo período noturno. Fale com a gente para verificar disponibilidade para a sua região e a data que você precisa.",
  },
  {
    q: "Em quais regiões vocês atendem?",
    a: "Atendemos a Zona Sul de São Paulo e bairros próximos. Mande o bairro no WhatsApp e confirmamos na hora se cobrimos a sua região.",
  },
  {
    q: "Como começa?",
    a: "É um processo simples: você conta o caso pelo WhatsApp, fazemos a avaliação, você recebe o plano de cuidado com a escala e o valor, e o profissional vai até a casa na data combinada.",
  },
];

export const Route = createFileRoute("/")({
  component: Index,
  head: () => ({
    meta: [
      { title: "Kihon Care | Cuidador de Idosos e Atendimento Domiciliar em São Paulo" },
      {
        name: "description",
        content:
          "Cuidador de idosos, técnico de enfermagem e banho no leito em casa. Atendimento domiciliar para idosos e pessoas acamadas na Zona Sul de São Paulo. Orçamento pelo WhatsApp.",
      },
      { property: "og:title", content: "Kihon Care | Atendimento Domiciliar para Idosos e Acamados" },
      {
        property: "og:description",
        content:
          "Cuidadores e técnicos de enfermagem na sua casa. Plantão 12h e 24h, banho no leito e acompanhamento contínuo. Orçamento sem compromisso.",
      },
      { property: "og:type", content: "website" },
      { property: "og:url", content: "/" },
      { name: "twitter:card", content: "summary_large_image" },
    ],
    links: [{ rel: "canonical", href: "/" }],
    scripts: [
      {
        type: "application/ld+json",
        children: JSON.stringify({
          "@context": "https://schema.org",
          "@type": "LocalBusiness",
          name: "Kihon Care — Atendimento Domiciliar",
          telephone: "+55 11 2366-0490",
          description:
            "Atendimento domiciliar para idosos e pessoas acamadas: cuidador, técnico de enfermagem, banho no leito e plantão 12h/24h.",
          areaServed: "São Paulo — SP",
        }),
      },
    ],
  }),
});

function WhatsAppIcon({ className = "" }: { className?: string }) {
  return (
    <svg className={className} viewBox="0 0 24 24" fill="none" aria-hidden="true">
      <path d="M20.5 11.7a8.5 8.5 0 0 1-12.56 7.47L3.5 20.5l1.35-4.3A8.5 8.5 0 1 1 20.5 11.7Z" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round" />
      <path d="M8.2 7.75c.2-.46.4-.47.7-.48h.6c.16 0 .35.06.44.3l.72 1.75c.08.2.04.38-.07.55l-.5.64c-.13.16-.2.3-.08.52.52.91 1.2 1.67 2.14 2.18.18.1.31.08.44-.07l.7-.83c.17-.2.35-.23.56-.14l1.67.79c.24.12.4.17.45.3.05.13.05.76-.17 1.38-.2.57-1.14 1.1-1.64 1.16-.43.05-.98.08-2.72-.65-2.25-.95-3.72-3.27-3.83-3.42-.1-.15-.91-1.22-.91-2.32 0-.62.22-1.17.5-1.6Z" fill="currentColor" />
    </svg>
  );
}

function Faq({ q, a }: { q: string; a: string }) {
  const [open, setOpen] = useState(false);
  return (
    <details className="faq-item" open={open} onToggle={(e) => setOpen((e.target as HTMLDetailsElement).open)}>
      <summary>
        <span>{q}</span>
        <ChevronDown className="size-5 shrink-0" aria-hidden="true" />
      </summary>
      <p>{a}</p>
    </details>
  );
}

function Index() {
  const [menuOpen, setMenuOpen] = useState(false);
  const [name, setName] = useState("");
  const [phone, setPhone] = useState("");
  const [bairro, setBairro] = useState("");
  const [cuidado, setCuidado] = useState("Cuidador de idosos");

  const submitContact = (event: FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    const message =
      `Olá, meu nome é ${name}. Preciso de atendimento domiciliar (${cuidado})` +
      (bairro ? `, no bairro ${bairro}` : "") +
      `. Meu telefone é ${phone}.`;
    window.open(buildTrackedWhatsAppUrl(message), "_blank", "noopener,noreferrer");
  };

  const closeMenu = () => setMenuOpen(false);

  return (
    <main className="overflow-x-hidden bg-background text-foreground">
      <header className="absolute inset-x-0 top-0 z-40">
        <div className="mx-auto flex max-w-7xl items-center justify-between px-5 py-5 lg:px-10 lg:py-7">
          <a href="#inicio" aria-label="Kihon Care" className="relative z-50 flex items-baseline gap-2">
            <span className="brand-mark">Kihon</span>
            <span className="brand-tag">Care</span>
          </a>

          <nav className="hidden items-center gap-8 text-sm font-semibold text-hero-foreground lg:flex" aria-label="Navegação principal">
            <a className="nav-link" href="#sinais">Quando procurar</a>
            <a className="nav-link" href="#servicos">Serviços</a>
            <a className="nav-link" href="#como-funciona">Como funciona</a>
            <a className="nav-link" href="#duvidas">Dúvidas</a>
            <a
              className="button button-whatsapp button-small"
              href={wa("Olá! Gostaria de entender melhor o atendimento domiciliar.")}
              target="_blank"
              rel="noreferrer"
            >
              <WhatsAppIcon className="size-4" /> Falar agora
            </a>
          </nav>

          <button
            className="icon-button lg:hidden"
            type="button"
            aria-label={menuOpen ? "Fechar menu" : "Abrir menu"}
            onClick={() => setMenuOpen((value) => !value)}
          >
            {menuOpen ? <X className="size-5" /> : <Menu className="size-5" />}
          </button>

          {menuOpen && (
            <nav className="mobile-menu lg:hidden" aria-label="Navegação móvel">
              <a href="#sinais" onClick={closeMenu}>Quando procurar</a>
              <a href="#servicos" onClick={closeMenu}>Serviços</a>
              <a href="#como-funciona" onClick={closeMenu}>Como funciona</a>
              <a href="#duvidas" onClick={closeMenu}>Dúvidas</a>
              <a
                className="button button-whatsapp mt-3"
                href={wa("Olá! Gostaria de entender melhor o atendimento domiciliar.")}
                target="_blank"
                rel="noreferrer"
              >
                <WhatsAppIcon className="size-5" /> Falar no WhatsApp
              </a>
            </nav>
          )}
        </div>
      </header>

      <section id="inicio" className="hero-section">
        <div className="hero-glow" />
        <div className="hero-grid mx-auto grid max-w-7xl items-center gap-12 px-5 pt-32 pb-20 lg:grid-cols-[1.05fr_0.95fr] lg:px-10 lg:pt-40 lg:pb-28">
          <div className="relative z-10 max-w-xl text-hero-foreground">
            <div className="eyebrow eyebrow-light">
              <HeartHandshake className="size-4" /> Atendimento domiciliar
            </div>
            <h1 className="mt-6 text-4xl leading-[1.04] font-medium sm:text-5xl lg:text-6xl">
              Cuidado em casa para idosos e pessoas acamadas
            </h1>
            <p className="mt-6 max-w-lg text-base leading-relaxed text-hero-muted lg:text-lg">
              Cuidadores e técnicos de enfermagem para acompanhar quem você ama na própria
              casa — com rotina, técnica e a família tranquila de saber que está bem cuidado.
            </p>
            <div className="mt-8 flex flex-wrap gap-3">
              <a
                className="button button-whatsapp"
                href={wa("Olá! Preciso de atendimento domiciliar. Podem me explicar como funciona?")}
                target="_blank"
                rel="noreferrer"
              >
                <WhatsAppIcon className="size-5" /> Falar no WhatsApp
              </a>
              <a className="button button-light" href="#servicos">
                Ver o que fazemos <ArrowUpRight className="size-4" />
              </a>
            </div>
            <p className="mt-6 text-sm text-hero-muted">
              Orçamento sem compromisso · Resposta no mesmo dia em horário comercial
            </p>
          </div>

          <div className="hero-panel">
            <span className="eyebrow eyebrow-light">O que resolvemos</span>
            <ul className="hero-panel-list">
              {[
                "Idoso que não pode mais ficar sozinho",
                "Banho no leito e higiene assistida",
                "Curativos, medicação e sinais vitais",
                "Plantão de 12h e 24h, inclusive à noite",
                "Acompanhamento a consultas e exames",
              ].map((item) => (
                <li key={item}>
                  <CheckCircle2 className="size-5 shrink-0 text-accent" aria-hidden="true" />
                  <span>{item}</span>
                </li>
              ))}
            </ul>
            <a
              className="button button-outline-light mt-8 w-full"
              href="#contato"
            >
              Pedir orçamento <ArrowUpRight className="size-4" />
            </a>
          </div>
        </div>
      </section>

      <section id="sinais" className="section-shell bg-soft">
        <div className="mx-auto max-w-7xl px-5 lg:px-10">
          <div className="section-heading">
            <div>
              <span className="eyebrow">Quando procurar</span>
              <h2>Sinais de que a<br />ajuda chegou na hora</h2>
            </div>
            <p>
              Muita família só procura apoio depois de uma queda, uma alta hospitalar ou um
              susto. Reconhecer o momento certo evita que o cuidado chegue tarde.
            </p>
          </div>

          <div className="reasons-grid">
            {sinais.map((s) => (
              <article className="icon-card" key={s.title}>
                <span className="icon-card-badge"><s.icon className="size-5" aria-hidden="true" /></span>
                <h3>{s.title}</h3>
                <p>{s.text}</p>
              </article>
            ))}
          </div>
        </div>
      </section>

      <section id="servicos" className="section-shell bg-background">
        <div className="mx-auto max-w-7xl px-5 lg:px-10">
          <div className="section-heading">
            <div>
              <span className="eyebrow">O que fazemos</span>
              <h2>Serviços<br />de cuidado</h2>
            </div>
            <p>
              Cada caso pede um tipo de apoio. Na conversa inicial avaliamos o grau de
              dependência e indicamos o profissional certo — sem empurrar serviço que não é
              necessário.
            </p>
          </div>

          <div className="services-grid">
            {servicos.map((s, index) => (
              <article className="service-card icon-service" key={s.title}>
                <span className="service-number">0{index + 1}</span>
                <span className="icon-card-badge"><s.icon className="size-5" aria-hidden="true" /></span>
                <div className="service-copy">
                  <h3>{s.title}</h3>
                  <p>{s.text}</p>
                </div>
              </article>
            ))}
          </div>
        </div>
      </section>

      <section id="como-funciona" className="hours-section">
        <div className="mx-auto max-w-7xl px-5 py-24 lg:px-10">
          <span className="eyebrow eyebrow-light"><ClipboardList className="size-4" /> Como funciona</span>
          <h2 className="mt-3">Do primeiro contato<br />ao cuidado em casa</h2>

          <div className="steps-grid">
            {passos.map((p, i) => (
              <article className="step-item" key={p.title}>
                <span className="step-number">{i + 1}</span>
                <h3>{p.title}</h3>
                <p>{p.text}</p>
              </article>
            ))}
          </div>

          <div className="steps-cta">
            <p>Comece pelo mais simples: mande uma mensagem contando a situação.</p>
            <a
              className="button button-whatsapp"
              href={wa("Olá! Quero entender como funciona o atendimento domiciliar.")}
              target="_blank"
              rel="noreferrer"
            >
              <WhatsAppIcon className="size-5" /> Contar minha situação
            </a>
          </div>
        </div>
      </section>

      <section id="seguranca" className="section-shell bg-soft">
        <div className="mx-auto max-w-7xl px-5 lg:px-10">
          <div className="section-heading">
            <div>
              <span className="eyebrow">Confiança</span>
              <h2>Quem entra<br />na sua casa</h2>
            </div>
            <p>
              Colocar alguém dentro de casa é uma decisão séria. É por isso que a seleção, o
              plano e o acompanhamento não ficam na mão da sorte.
            </p>
          </div>

          <div className="reasons-grid">
            {garantias.map((g) => (
              <article className="icon-card" key={g.title}>
                <span className="icon-card-badge"><g.icon className="size-5" aria-hidden="true" /></span>
                <h3>{g.title}</h3>
                <p>{g.text}</p>
              </article>
            ))}
          </div>

          <p className="mt-10 max-w-2xl text-sm text-muted-foreground">
            A estrutura por trás é a mesma do <strong>Kihon Hair Studio</strong>, no Morumbi:
            quem responde é uma coordenação de verdade, com histórico e endereço no bairro —
            não um intermediário anônimo.
          </p>
        </div>
      </section>

      <section id="duvidas" className="location-section">
        <div className="mx-auto grid max-w-7xl gap-14 px-5 lg:grid-cols-[0.85fr_1.15fr] lg:px-10">
          <div>
            <span className="eyebrow">Dúvidas frequentes</span>
            <h2>Perguntas<br />das famílias</h2>
            <p className="mt-6 max-w-sm text-muted-foreground">
              Ficou algo de fora? Manda a pergunta no WhatsApp — respondemos sem enrolação.
            </p>
            <div className="mt-8 flex flex-wrap gap-3">
              <a
                className="button button-primary"
                href={wa("Olá! Tenho uma dúvida sobre o atendimento domiciliar.")}
                target="_blank"
                rel="noreferrer"
              >
                Perguntar <ArrowUpRight className="size-4" />
              </a>
              <a className="button button-outline" href={`tel:+${WHATSAPP_PHONE}`}>
                <Phone className="size-4" /> (11) 2366-0490
              </a>
            </div>
            <p className="mt-8 flex items-start gap-2 text-sm text-muted-foreground">
              <MapPin className="mt-0.5 size-4 shrink-0" aria-hidden="true" />
              <span>
                Zona Sul de São Paulo e bairros próximos<br />
                Av. Jorge João Saad, 305 — Vila Progredior, Morumbi
              </span>
            </p>
          </div>

          <div className="faq-list">
            {faq.map((item) => (
              <Faq key={item.q} q={item.q} a={item.a} />
            ))}
          </div>
        </div>
      </section>

      <section id="contato" className="booking-section">
        <div className="mx-auto grid max-w-7xl gap-10 px-5 lg:grid-cols-2 lg:px-10">
          <div className="booking-intro">
            <span className="eyebrow eyebrow-light">Vamos conversar</span>
            <h2>Peça seu<br />orçamento</h2>
            <p>
              Preencha os dados abaixo: abre o WhatsApp da coordenação com a sua situação já
              escrita. É o caminho mais rápido para receber uma proposta.
            </p>
            <ul className="booking-list">
              <li><CheckCircle2 className="size-5 text-accent" aria-hidden="true" /> Sem custo e sem compromisso</li>
              <li><CheckCircle2 className="size-5 text-accent" aria-hidden="true" /> Avaliação do caso antes do valor</li>
              <li><CheckCircle2 className="size-5 text-accent" aria-hidden="true" /> Nada é combinado só verbalmente</li>
            </ul>
          </div>

          <form className="booking-form" onSubmit={submitContact}>
            <label htmlFor="name">Seu nome</label>
            <input
              id="name"
              name="name"
              type="text"
              placeholder="Como podemos te chamar?"
              value={name}
              onChange={(event) => setName(event.target.value)}
              required
            />

            <label htmlFor="phone">Telefone</label>
            <input
              id="phone"
              name="phone"
              type="tel"
              placeholder="(11) 99999-9999"
              value={phone}
              onChange={(event) => setPhone(event.target.value)}
              required
            />

            <label htmlFor="bairro">Bairro onde será o atendimento</label>
            <input
              id="bairro"
              name="bairro"
              type="text"
              placeholder="Ex.: Morumbi, Campo Limpo, Santo Amaro"
              value={bairro}
              onChange={(event) => setBairro(event.target.value)}
            />

            <label htmlFor="cuidado">Tipo de cuidado</label>
            <select
              id="cuidado"
              name="cuidado"
              value={cuidado}
              onChange={(event) => setCuidado(event.target.value)}
            >
              <option>Cuidador de idosos</option>
              <option>Técnico de enfermagem</option>
              <option>Banho no leito e higiene</option>
              <option>Plantão 12h ou 24h</option>
              <option>Acompanhamento a consultas</option>
              <option>Ainda não sei, preciso de orientação</option>
            </select>

            <button className="button button-whatsapp mt-3 w-full" type="submit">
              Enviar no WhatsApp <Send className="size-4" />
            </button>
          </form>
        </div>
      </section>

      <footer className="footer">
        <div className="mx-auto flex max-w-7xl flex-col items-center justify-between gap-8 px-5 py-10 md:flex-row lg:px-10">
          <span className="brand-footer">Kihon <em>Care</em></span>
          <p>© 2026 Kihon Care — Atendimento Domiciliar. Todos os direitos reservados.</p>
          <a
            className="footer-social"
            href={wa("Olá! Vim pelo site do atendimento domiciliar.")}
            target="_blank"
            rel="noreferrer"
            aria-label="Falar no WhatsApp"
          >
            <WhatsAppIcon className="size-5" />
          </a>
        </div>
      </footer>

      <a
        className="floating-whatsapp"
        href={wa("Olá! Preciso de atendimento domiciliar.")}
        target="_blank"
        rel="noreferrer"
        aria-label="Falar no WhatsApp"
      >
        <WhatsAppIcon className="size-7" />
      </a>
    </main>
  );
}
