# Kihon Care — Atendimento Domiciliar (LP)

Landing page de teste do novo serviço do Kihon: atendimento domiciliar para
idosos e pessoas acamadas (cuidador, técnico de enfermagem, banho no leito,
plantão 12h/24h).

## Stack
TanStack Start + React + Tailwind v4, build via Nitro preset `node-server`,
servido por Docker/Coolify (`node .output/server/index.mjs`, porta 3000).

## Rodar local
```bash
npm install
npm run dev      # dev
npm run build && node .output/server/index.mjs   # produção
```

## Onde mexer
- `src/routes/index.tsx` — TODO o conteúdo da página. O telefone fica em
  `WHATSAPP_PHONE` no topo do arquivo (fonte única).
- `src/routes/__root.tsx` — head, GTM, Meta Pixel e o script de rastreamento
  Claraia. O telefone na URL de tracking precisa bater com `WHATSAPP_PHONE`.
- `src/styles.css` — paleta e layout.

## Deploy
Coolify (instância cd.reativazap.com), app `kihon-lp-domicilio`, Dockerfile.
A página está com `robots: noindex` enquanto é teste.
