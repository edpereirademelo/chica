import {
  CalendarClock,
  Building2,
  Factory,
  PackageSearch,
  AlertTriangle,
  TrendingUp,
  Truck,
} from 'lucide-react'
import { TeaserShell, MockCard, MockBars } from '../components/TeaserShell'
import { Badge } from '../components/ui'
import { brl } from '../lib/format'

// ============ FASE 2 ============

export function Assinaturas() {
  const planos = [
    { nome: 'Diário', preco: 18, desc: '1 marmita por dia útil', cor: 'border-edge' },
    { nome: 'Semanal', preco: 84, desc: '5 marmitas na semana (-7%)', cor: 'border-terracota' },
    { nome: 'Mensal', preco: 320, desc: '22 marmitas no mês (-12%)', cor: 'border-leaf' },
  ]
  const empresas = [
    { nome: 'Construtora Horizonte', marmitas: 25, fatura: 11250 },
    { nome: 'Auto Peças Veloz', marmitas: 12, fatura: 5400 },
    { nome: 'Clínica Vida Plena', marmitas: 18, fatura: 8100 },
    { nome: 'Mercado São Jorge', marmitas: 30, fatura: 13500 },
  ]
  return (
    <TeaserShell
      phase={2}
      title="Assinaturas & Corporativo"
      description="Crie planos diário, semanal e mensal para fidelizar clientes e feche contratos de marmita corporativa com fatura única no fim do mês para empresas."
    >
      <div className="space-y-5">
        <div className="grid grid-cols-1 gap-4 sm:grid-cols-3">
          {planos.map((p) => (
            <MockCard key={p.nome} className={`border-t-4 ${p.cor}`}>
              <div className="flex items-center gap-2">
                <CalendarClock size={18} className="text-terracota" />
                <p className="font-display font-bold text-ink">Plano {p.nome}</p>
              </div>
              <p className="mt-3 font-display text-3xl font-extrabold text-ink">
                {brl(p.preco)}
              </p>
              <p className="mt-1 text-sm text-muted">{p.desc}</p>
            </MockCard>
          ))}
        </div>
        <MockCard>
          <div className="mb-3 flex items-center gap-2">
            <Building2 size={18} className="text-terracota" />
            <p className="font-display font-bold text-ink">Empresas-cliente</p>
          </div>
          <div className="divide-y divide-edge">
            {empresas.map((e) => (
              <div key={e.nome} className="flex items-center justify-between py-2.5">
                <div>
                  <p className="font-semibold text-ink">{e.nome}</p>
                  <p className="text-xs text-muted">{e.marmitas} marmitas/dia · fatura mensal</p>
                </div>
                <span className="font-display font-bold text-ink">{brl(e.fatura)}</span>
              </div>
            ))}
          </div>
        </MockCard>
      </div>
    </TeaserShell>
  )
}

export function Producao() {
  return (
    <TeaserShell
      phase={2}
      title="Planejamento de Produção"
      description="Saiba quanto produzir de cada prato por dia com base no histórico, reduza sobras e acompanhe o desperdício para economizar ingredientes."
    >
      <div className="grid grid-cols-1 gap-4 lg:grid-cols-2">
        <MockCard>
          <div className="mb-3 flex items-center gap-2">
            <Factory size={18} className="text-terracota" />
            <p className="font-display font-bold text-ink">Ordem de produção de hoje</p>
          </div>
          <div className="space-y-3">
            {[
              { item: 'Bobó de Frango', prev: 38, un: 'porções' },
              { item: 'Calabresa Acebolada', prev: 32, un: 'porções' },
              { item: 'Arroz', prev: 8, un: 'kg' },
              { item: 'Feijão', prev: 6, un: 'kg' },
              { item: 'Mix Repolho com Couve', prev: 5, un: 'kg' },
            ].map((r) => (
              <div key={r.item} className="flex items-center justify-between">
                <span className="text-sm text-ink">{r.item}</span>
                <Badge tone="peach">{r.prev} {r.un}</Badge>
              </div>
            ))}
          </div>
        </MockCard>
        <MockCard>
          <p className="mb-2 font-display font-bold text-ink">Desperdício na semana</p>
          <p className="mb-3 text-xs text-muted">Sobras (kg) por dia — meta abaixo de 3kg</p>
          <MockBars data={[4, 3, 5, 2, 3, 6, 2]} />
          <p className="mt-3 text-sm text-leaf">↓ 18% de desperdício vs. semana anterior</p>
        </MockCard>
      </div>
    </TeaserShell>
  )
}

export function Estoque() {
  const insumos = [
    { nome: 'Frango (kg)', qtd: 12, custo: 14.9, validade: '05/06', alerta: false },
    { nome: 'Calabresa (kg)', qtd: 3, custo: 22.5, validade: '04/06', alerta: true },
    { nome: 'Mandioca (kg)', qtd: 8, custo: 5.2, validade: '06/06', alerta: false },
    { nome: 'Arroz (kg)', qtd: 25, custo: 6.4, validade: '20/08', alerta: false },
    { nome: 'Couve (maço)', qtd: 2, custo: 3.0, validade: '04/06', alerta: true },
  ]
  return (
    <TeaserShell
      phase={2}
      title="Estoque & Ficha Técnica"
      description="Controle insumos, calcule o custo real de cada marmita (CMV), acompanhe a validade dos perecíveis e receba alertas antes de faltar ou estragar."
    >
      <div className="grid grid-cols-1 gap-4 lg:grid-cols-3">
        <MockCard className="lg:col-span-2">
          <div className="mb-3 flex items-center gap-2">
            <PackageSearch size={18} className="text-terracota" />
            <p className="font-display font-bold text-ink">Insumos</p>
          </div>
          <div className="divide-y divide-edge text-sm">
            <div className="grid grid-cols-4 gap-2 pb-2 text-xs font-bold uppercase text-muted">
              <span>Item</span><span>Qtd</span><span>Custo un.</span><span>Validade</span>
            </div>
            {insumos.map((i) => (
              <div key={i.nome} className="grid grid-cols-4 items-center gap-2 py-2.5">
                <span className="font-medium text-ink">{i.nome}</span>
                <span className="text-muted">{i.qtd}</span>
                <span className="text-muted">{brl(i.custo)}</span>
                <span className={i.alerta ? 'font-semibold text-terracota' : 'text-muted'}>
                  {i.validade}
                </span>
              </div>
            ))}
          </div>
        </MockCard>
        <div className="space-y-4">
          <MockCard className="border-terracota/30 bg-terracota/5">
            <div className="flex items-center gap-2 text-terracota">
              <AlertTriangle size={18} />
              <p className="font-display font-bold">Alertas</p>
            </div>
            <ul className="mt-2 space-y-1.5 text-sm text-ink">
              <li>• Calabresa vence amanhã (04/06)</li>
              <li>• Couve com estoque baixo (2 maços)</li>
            </ul>
          </MockCard>
          <MockCard>
            <p className="text-sm text-muted">Custo médio por marmita (CMV)</p>
            <p className="mt-1 font-display text-3xl font-extrabold text-ink">{brl(6.85)}</p>
            <p className="mt-1 text-sm text-leaf">Margem média de 62%</p>
          </MockCard>
        </div>
      </div>
    </TeaserShell>
  )
}

// ============ FASE 3 ============

export function Relatorios() {
  const abc = [
    { item: 'Bobó de Frango', pct: 42, classe: 'A' },
    { item: 'Calabresa Acebolada', pct: 35, classe: 'A' },
    { item: 'Marmita G completa', pct: 14, classe: 'B' },
    { item: 'Salada de Alface', pct: 9, classe: 'C' },
  ]
  return (
    <TeaserShell
      phase={3}
      title="Relatórios & BI"
      description="Dashboards avançados com Curva ABC dos pratos, sazonalidade e comparativos de período para você decidir com base em dados, não no achismo."
    >
      <div className="grid grid-cols-1 gap-4 lg:grid-cols-2">
        <MockCard>
          <div className="mb-3 flex items-center gap-2">
            <TrendingUp size={18} className="text-terracota" />
            <p className="font-display font-bold text-ink">Faturamento por mês</p>
          </div>
          <MockBars data={[18, 22, 19, 26, 31, 28, 35]} />
        </MockCard>
        <MockCard>
          <p className="mb-3 font-display font-bold text-ink">Curva ABC de pratos</p>
          <div className="space-y-3">
            {abc.map((a) => (
              <div key={a.item}>
                <div className="flex justify-between text-sm">
                  <span className="text-ink">{a.item}</span>
                  <span className="text-muted">{a.pct}% · classe {a.classe}</span>
                </div>
                <div className="mt-1 h-2 overflow-hidden rounded-full bg-ink/5">
                  <div className="h-full rounded-full bg-terracota" style={{ width: `${a.pct}%` }} />
                </div>
              </div>
            ))}
          </div>
        </MockCard>
      </div>
    </TeaserShell>
  )
}

export function Fornecedores() {
  const itens = [
    { item: 'Frango (kg)', a: 14.9, b: 13.8, c: 15.2 },
    { item: 'Calabresa (kg)', a: 22.5, b: 23.0, c: 21.9 },
    { item: 'Arroz (5kg)', a: 28.0, b: 26.5, c: 27.3 },
    { item: 'Feijão (kg)', a: 8.2, b: 8.9, c: 7.9 },
  ]
  const melhor = (r: typeof itens[number]) => Math.min(r.a, r.b, r.c)
  return (
    <TeaserShell
      phase={3}
      title="Fornecedores"
      description="Cadastre fornecedores, compare preços lado a lado e gere pedidos de compra com poucos cliques para sempre comprar pelo melhor preço."
    >
      <MockCard>
        <div className="mb-3 flex items-center gap-2">
          <Truck size={18} className="text-terracota" />
          <p className="font-display font-bold text-ink">Comparativo de preços</p>
        </div>
        <div className="overflow-x-auto">
          <table className="w-full text-sm">
            <thead>
              <tr className="border-b border-edge text-left text-xs font-bold uppercase text-muted">
                <th className="py-2 pr-4">Insumo</th>
                <th className="py-2 pr-4">Atacadão</th>
                <th className="py-2 pr-4">Hortifruti Sol</th>
                <th className="py-2">Distribuidora MG</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-edge">
              {itens.map((r) => {
                const best = melhor(r)
                const cell = (v: number) =>
                  v === best ? (
                    <span className="rounded-md bg-leaf/12 px-2 py-0.5 font-semibold text-leaf">
                      {brl(v)}
                    </span>
                  ) : (
                    <span className="text-muted">{brl(v)}</span>
                  )
                return (
                  <tr key={r.item}>
                    <td className="py-2.5 pr-4 font-medium text-ink">{r.item}</td>
                    <td className="py-2.5 pr-4">{cell(r.a)}</td>
                    <td className="py-2.5 pr-4">{cell(r.b)}</td>
                    <td className="py-2.5">{cell(r.c)}</td>
                  </tr>
                )
              })}
            </tbody>
          </table>
        </div>
        <p className="mt-3 text-sm text-leaf">
          💡 Comprando o melhor preço de cada item, você economizaria ~{brl(186)} no mês.
        </p>
      </MockCard>
    </TeaserShell>
  )
}
