'use client';

import { useEffect, useState } from 'react';
import { useRouter } from 'next/navigation';
import { useAuth } from '@/lib/auth-context';
import api from '@/lib/api';
import { MessageSquare, Users, Bot, BarChart3, Settings, CreditCard, Plus, ArrowRight } from 'lucide-react';
import Link from 'next/link';

interface Stats {
  total: number;
  open: number;
  closed: number;
  pending: number;
}

export default function DashboardPage() {
  const { user, loading: authLoading } = useAuth();
  const router = useRouter();
  const [stats, setStats] = useState<Stats>({ total: 0, open: 0, closed: 0, pending: 0 });
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    if (!authLoading && !user) {
      router.push('/login');
    } else if (user) {
      fetchStats();
    }
  }, [user, authLoading, router]);

  const fetchStats = async () => {
    try {
      const response = await api.get('/conversations/stats');
      setStats(response.data);
    } catch (error) {
      console.error('Error fetching stats:', error);
    } finally {
      setLoading(false);
    }
  };

  const menuItems = [
    { title: 'Conversas', icon: MessageSquare, href: '/dashboard/conversations', desc: 'Gerencie atendimentos', color: 'bg-blue-500' },
    { title: 'Contatos', icon: Users, href: '/dashboard/contacts', desc: 'Base de clientes', color: 'bg-green-500' },
    { title: 'Agentes IA', icon: Bot, href: '/dashboard/agents', desc: 'Configure chatbots', color: 'bg-purple-500' },
    { title: 'Relatórios', icon: BarChart3, href: '/dashboard/reports', desc: 'Métricas e analytics', color: 'bg-orange-500' },
    { title: 'Configurações', icon: Settings, href: '/dashboard/settings', desc: 'Ajustes da conta', color: 'bg-gray-500' },
    { title: 'Assinatura', icon: CreditCard, href: '/dashboard/subscription', desc: 'Planos e pagamento', color: 'bg-yellow-500' },
  ];

  if (authLoading || loading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-primary-600"></div>
      </div>
    );
  }

  return (
    <div>
      <div className="mb-8">
        <h1 className="text-2xl font-bold">Bem-vindo, {user?.name}!</h1>
        <p className="text-gray-600">{user?.tenant?.name}</p>
      </div>

      {/* Stats Cards */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-4 mb-8">
        <div className="bg-white p-6 rounded-xl shadow-sm border">
          <p className="text-sm text-gray-500">Total de Conversas</p>
          <p className="text-3xl font-bold">{stats.total}</p>
        </div>
        <div className="bg-white p-6 rounded-xl shadow-sm border">
          <p className="text-sm text-gray-500">Abertas</p>
          <p className="text-3xl font-bold text-blue-600">{stats.open}</p>
        </div>
        <div className="bg-white p-6 rounded-xl shadow-sm border">
          <p className="text-sm text-gray-500">Pendentes</p>
          <p className="text-3xl font-bold text-yellow-600">{stats.pending}</p>
        </div>
        <div className="bg-white p-6 rounded-xl shadow-sm border">
          <p className="text-sm text-gray-500">Encerradas</p>
          <p className="text-3xl font-bold text-green-600">{stats.closed}</p>
        </div>
      </div>

      {/* Menu Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {menuItems.map((item) => (
          <Link
            key={item.href}
            href={item.href}
            className="bg-white p-6 rounded-xl shadow-sm hover:shadow-md transition border group"
          >
            <div className={`w-12 h-12 ${item.color} rounded-lg flex items-center justify-center mb-4`}>
              <item.icon className="w-6 h-6 text-white" />
            </div>
            <h2 className="text-lg font-semibold mb-1 flex items-center gap-2">
              {item.title}
              <ArrowRight className="w-4 h-4 opacity-0 group-hover:opacity-100 transition" />
            </h2>
            <p className="text-sm text-gray-500">{item.desc}</p>
          </Link>
        ))}
      </div>
    </div>
  );
}
