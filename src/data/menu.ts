import type { MenuItem, SizeOption } from './types'

// Catálogo-mestre real da Chica
export const menuCatalog: MenuItem[] = [
  // Bases
  {
    id: 'base-arroz',
    name: 'Arroz',
    description: 'Soltinho, no ponto certo do dia a dia.',
    category: 'Base',
    active: true,
    soldOut: false,
  },
  {
    id: 'base-feijao',
    name: 'Feijão',
    description: 'Caldo encorpado, temperado com carinho.',
    category: 'Base',
    active: true,
    soldOut: false,
  },
  // Misturas
  {
    id: 'mist-bobo',
    name: 'Bobó de Frango',
    description: 'Cremoso, com frango desfiado, mandioca e temperos especiais.',
    category: 'Mistura',
    active: true,
    soldOut: false,
  },
  {
    id: 'mist-calabresa',
    name: 'Calabresa Acebolada',
    description: 'Calabresa suculenta refogada com cebola, douradinha.',
    category: 'Mistura',
    active: true,
    soldOut: false,
  },
  // Guarnições
  {
    id: 'guarn-repolho',
    name: 'Mix Repolho com Couve',
    description: 'Refogado com alho, leve e saudável.',
    category: 'Guarnição',
    active: true,
    soldOut: false,
  },
  {
    id: 'guarn-macarrao',
    name: 'Macarrão Alho e Óleo',
    description: 'Simples, delicioso, na medida certa.',
    category: 'Guarnição',
    active: true,
    soldOut: false,
  },
  // Saladas
  {
    id: 'sal-alface',
    name: 'Salada de Alface',
    description: 'Fresquinha, crocante, cheia de vitaminas.',
    category: 'Salada',
    active: true,
    soldOut: false,
  },
]

export const sizeOptions: SizeOption[] = [
  { id: 'P', name: 'P', price: 10, rule: '1 mistura + todas as guarnições' },
  {
    id: 'PE',
    name: 'P Especial',
    price: 15,
    rule: 'Completa, com tudo do cardápio',
  },
  { id: 'M', name: 'M', price: 18, rule: '1 mistura + todas as guarnições' },
  { id: 'G', name: 'G', price: 22, rule: 'Completa, com tudo do cardápio' },
]

// Dados fixos da marca
export const brand = {
  name: 'Marmitaria da Chica',
  tagline: 'Sabor de casa, feito com carinho',
  subtitle: 'Sabor Mineiro',
  hours: '11h às 14h',
  whatsapp: '(18) 99237-1799',
  pixKey: '62.597.153/0001-15',
  dailyGoal: 60, // meta de marmitas/dia
}

export const categoryOrder: MenuItem['category'][] = [
  'Base',
  'Mistura',
  'Guarnição',
  'Salada',
]
