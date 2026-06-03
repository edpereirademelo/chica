import { Routes, Route, Navigate } from 'react-router-dom'
import { Layout } from './components/Layout'
import { Dashboard } from './pages/Dashboard'
import { Cardapio } from './pages/Cardapio'
import { Pedidos } from './pages/Pedidos'
import { WhatsApp } from './pages/WhatsApp'
import { Precos } from './pages/Precos'
import { Clientes } from './pages/Clientes'
import { Financeiro } from './pages/Financeiro'
import {
  Assinaturas,
  Producao,
  Estoque,
  Relatorios,
  Fornecedores,
} from './pages/teasers'

export default function App() {
  return (
    <Routes>
      <Route element={<Layout />}>
        <Route index element={<Dashboard />} />
        <Route path="cardapio" element={<Cardapio />} />
        <Route path="pedidos" element={<Pedidos />} />
        <Route path="whatsapp" element={<WhatsApp />} />
        <Route path="precos" element={<Precos />} />
        <Route path="clientes" element={<Clientes />} />
        <Route path="financeiro" element={<Financeiro />} />
        {/* Fases 2 e 3 — teasers */}
        <Route path="assinaturas" element={<Assinaturas />} />
        <Route path="producao" element={<Producao />} />
        <Route path="estoque" element={<Estoque />} />
        <Route path="relatorios" element={<Relatorios />} />
        <Route path="fornecedores" element={<Fornecedores />} />
        <Route path="*" element={<Navigate to="/" replace />} />
      </Route>
    </Routes>
  )
}
