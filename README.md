# Marmitaria da Chica — Painel de Gestão

Protótipo navegável de um sistema de gestão para a **Marmitaria da Chica** ("Sabor Mineiro").
Feito para demonstração comercial: a **Fase 1 funciona de verdade** (com dados simulados em memória) e as **Fases 2 e 3** aparecem como telas-teaser bonitas.

## Como rodar

Pré-requisitos: **Node.js 18+**.

```bash
npm install
npm run dev
```

O navegador abre sozinho em `http://localhost:5173` direto no **Painel (Dashboard)**.

Para gerar a versão de produção:

```bash
npm run build
npm run preview
```

## O que dá pra fazer (Fase 1 — funcional)

- **Painel** — faturamento do dia, marmitas vendidas vs. meta, pedidos em aberto, ticket médio, gráfico de 7 dias e ranking de misturas.
- **Cardápio do Dia** — ativar/desativar itens e marcar como esgotado (reflete nas outras telas).
- **Pedidos (KDS)** — kanban Recebido → Em produção → Pronto → Saiu para entrega → Entregue. Avance o status e crie um **Novo Pedido** ao vivo.
- **Atendimento WhatsApp** — inbox com a IA conduzindo o pedido; botão **Converter em pedido**.
- **Tamanhos & Preços** — edite os preços e veja refletir nos cálculos.
- **Clientes** — CRM com busca e ficha lateral com histórico e segmentação.

## Fases 2 e 3 (teaser)

Itens com cadeado no menu abrem prévias visuais dos módulos (Assinaturas & Corporativo, Planejamento de Produção, Estoque & Ficha Técnica, Relatórios & BI, Financeiro & Fiscal, Fornecedores), com CTA para falar com a Plyvo.

## Stack

Vite · React · TypeScript · Tailwind CSS · React Router · Zustand · Recharts · lucide-react.

Tudo client-side, sem backend. Os dados ficam em `src/data/` e o estado da sessão em `src/store/`.
