import type { Customer, CustomerTag } from './types'

interface Seed {
  name: string
  phone: string
  totalOrders: number
  avgTicket: number
  lastOrder: string
  tag: CustomerTag
}

const seeds: Seed[] = [
  { name: 'Maria Aparecida', phone: '(18) 99811-2031', totalOrders: 48, avgTicket: 17.5, lastOrder: 'Hoje', tag: 'Frequente' },
  { name: 'João Batista', phone: '(18) 99744-8820', totalOrders: 39, avgTicket: 20.0, lastOrder: 'Hoje', tag: 'Frequente' },
  { name: 'Cláudia Regina', phone: '(18) 99622-1145', totalOrders: 31, avgTicket: 19.2, lastOrder: 'Hoje', tag: 'Frequente' },
  { name: 'Sebastião Pereira', phone: '(18) 99533-7766', totalOrders: 27, avgTicket: 16.8, lastOrder: 'Hoje', tag: 'Frequente' },
  { name: 'Antônio Carlos', phone: '(18) 99488-9921', totalOrders: 22, avgTicket: 12.5, lastOrder: 'Hoje', tag: 'Frequente' },
  { name: 'Patrícia Lima', phone: '(18) 99377-5432', totalOrders: 19, avgTicket: 18.0, lastOrder: 'Hoje', tag: 'Frequente' },
  { name: 'Carlos Eduardo', phone: '(18) 99266-1188', totalOrders: 18, avgTicket: 21.0, lastOrder: 'Hoje', tag: 'Frequente' },
  { name: 'Juliana Martins', phone: '(18) 99155-3344', totalOrders: 15, avgTicket: 17.8, lastOrder: 'Hoje', tag: 'Frequente' },
  { name: 'Rita de Cássia', phone: '(18) 99044-2299', totalOrders: 14, avgTicket: 15.5, lastOrder: 'Hoje', tag: 'Frequente' },
  { name: 'Paulo Henrique', phone: '(18) 99933-8855', totalOrders: 12, avgTicket: 22.0, lastOrder: 'Hoje', tag: 'Frequente' },
  { name: 'Roberto Alves', phone: '(18) 99822-7711', totalOrders: 11, avgTicket: 15.0, lastOrder: 'Hoje', tag: 'Frequente' },
  { name: 'Adriana Costa', phone: '(18) 99711-6622', totalOrders: 9, avgTicket: 18.0, lastOrder: 'Hoje', tag: 'Frequente' },
  { name: 'Fernando Souza', phone: '(18) 99600-5533', totalOrders: 8, avgTicket: 11.2, lastOrder: 'Hoje', tag: 'Frequente' },
  { name: 'Marcos Vinícius', phone: '(18) 99599-4422', totalOrders: 7, avgTicket: 18.0, lastOrder: 'Hoje', tag: 'Frequente' },
  { name: 'Luciana Ferreira', phone: '(18) 99488-3311', totalOrders: 6, avgTicket: 15.0, lastOrder: 'Hoje', tag: 'Frequente' },
  { name: 'Vanessa Oliveira', phone: '(18) 99377-2200', totalOrders: 5, avgTicket: 10.4, lastOrder: 'Hoje', tag: 'Frequente' },
  { name: 'Tatiane Rocha', phone: '(18) 99266-9988', totalOrders: 4, avgTicket: 17.0, lastOrder: 'Hoje', tag: 'Novo' },
  { name: 'Eduardo Nunes', phone: '(18) 99155-8877', totalOrders: 3, avgTicket: 22.0, lastOrder: 'Hoje', tag: 'Novo' },
  { name: 'Simone Barbosa', phone: '(18) 99044-7766', totalOrders: 2, avgTicket: 15.0, lastOrder: 'Hoje', tag: 'Novo' },
  { name: 'Ricardo Gomes', phone: '(18) 99933-6655', totalOrders: 2, avgTicket: 10.0, lastOrder: 'Hoje', tag: 'Novo' },
  { name: 'Beatriz Carvalho', phone: '(18) 99822-5544', totalOrders: 1, avgTicket: 18.0, lastOrder: '01/06', tag: 'Novo' },
  { name: 'Gustavo Ramos', phone: '(18) 99711-4433', totalOrders: 1, avgTicket: 22.0, lastOrder: '31/05', tag: 'Novo' },
  { name: 'Daniela Pinto', phone: '(18) 99600-3322', totalOrders: 1, avgTicket: 15.0, lastOrder: '30/05', tag: 'Novo' },
  { name: 'Wesley Andrade', phone: '(18) 99599-2211', totalOrders: 16, avgTicket: 19.0, lastOrder: '12/05', tag: 'Inativo' },
  { name: 'Cristina Moura', phone: '(18) 99488-1100', totalOrders: 21, avgTicket: 17.0, lastOrder: '08/05', tag: 'Inativo' },
  { name: 'Anderson Dias', phone: '(18) 99377-0099', totalOrders: 13, avgTicket: 14.5, lastOrder: '02/05', tag: 'Inativo' },
  { name: 'Fabiana Teixeira', phone: '(18) 99266-9900', totalOrders: 10, avgTicket: 18.5, lastOrder: '28/04', tag: 'Inativo' },
  { name: 'Marcelo Pires', phone: '(18) 99155-8800', totalOrders: 7, avgTicket: 16.0, lastOrder: '20/04', tag: 'Inativo' },
  { name: 'Renata Cardoso', phone: '(18) 99044-7700', totalOrders: 5, avgTicket: 13.0, lastOrder: '15/04', tag: 'Inativo' },
  { name: 'Thiago Mendes', phone: '(18) 99933-6600', totalOrders: 4, avgTicket: 20.0, lastOrder: '10/04', tag: 'Inativo' },
]

const misturas = ['Bobó de Frango', 'Calabresa Acebolada']
const tamanhos = [
  { n: 'P', v: 10 },
  { n: 'P Especial', v: 15 },
  { n: 'M', v: 18 },
  { n: 'G', v: 22 },
]
const datas = ['Hoje', '01/06', '30/05', '28/05', '26/05', '23/05', '20/05', '15/05']

function buildHistory(count: number) {
  const n = Math.min(count, 6)
  return Array.from({ length: n }, (_, i) => {
    const t = tamanhos[(i + count) % tamanhos.length]
    const m = misturas[(i + count) % misturas.length]
    return {
      date: datas[i % datas.length],
      items: `Marmita ${t.n} · ${m}`,
      total: t.v,
    }
  })
}

export const initialCustomers: Customer[] = seeds.map((s, i) => ({
  id: `cli-${i + 1}`,
  name: s.name,
  phone: s.phone,
  totalOrders: s.totalOrders,
  avgTicket: s.avgTicket,
  lastOrder: s.lastOrder,
  tag: s.tag,
  history: buildHistory(s.totalOrders),
}))
