'use client';

import Link from 'next/link';
import { Users, MessageSquare, Bot, BarChart3, Settings, CreditCard } from 'lucide-react';

export default function DashboardPage() {
  const menuItems = [
    { title: 'Conversas', icon: MessageSquare, href: '/dashboard/conversations', desc: 'Gerencie atendimentos' },
    { title: 'Contatos', icon: Users, href: '/dashboard/contacts', desc: 'Base de clientes' },
    { title: 'Agentes IA', icon: Bot, href: '/dashboard/agents', desc: 'Configure chatbots' },
    { title: 'Relatórios', icon: BarChart3, href: '/dashboard/reports', desc: 'Métricas e analytics' },
    { title: 'Configurações', icon: Settings, href: '/dashboard/settings', desc: 'Ajustes da conta' },
    { title: 'Assinatura', icon: CreditCard, href: '/dashboard/subscription', desc: 'Planos e pagamento' },
  ];

  return (
    <div>
      <h1 className="text-2xl font-bold mb-2">Bem-vindo ao Fluidesk AI</h1>
      <p className="text-gray-600 mb-8">Gerencie seu atendimento com inteligência artificial</p>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {menuItems.map((item) => (
          <Link
            key={item.href}
            href={item.href}
            className="bg-white p-6 rounded-xl shadow-sm hover:shadow-md transition border"
          >
            <item.icon className="w-10 h-10 text-primary-600 mb-4" />
            <h2 className="text-lg font-semibold mb-1">{item.title}</h2>
            <p className="text-sm text-gray-500">{item.desc}</p>
          </Link>
        ))}
      </div>
    </div>
  );
}
