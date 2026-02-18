'use client';

import { useEffect, useState } from 'react';
import { useRouter } from 'next/navigation';
import { useAuth } from '@/lib/auth-context';
import api from '@/lib/api';
import { Bot, Plus, Power, QrCode, Settings, Trash2, MessageSquare } from 'lucide-react';
import Link from 'next/link';

interface Agent {
  id: string;
  name: string;
  description: string;
  modelProvider: string;
  modelName: string;
  isActive: boolean;
  whatsappConfig?: {
    connectionStatus: string;
    mode: string;
  };
}

export default function AgentsPage() {
  const { user, loading: authLoading } = useAuth();
  const router = useRouter();
  const [agents, setAgents] = useState<Agent[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    if (!authLoading && !user) router.push('/login');
    else if (user) fetchAgents();
  }, [user, authLoading, router]);

  const fetchAgents = async () => {
    try {
      const response = await api.get('/ai-agents');
      setAgents(response.data);
    } catch (error) {
      console.error('Error fetching agents:', error);
    } finally {
      setLoading(false);
    }
  };

  const toggleAgent = async (id: string, currentStatus: boolean) => {
    try {
      await api.put(`/ai-agents/${id}`, { isActive: !currentStatus });
      fetchAgents();
    } catch (error) {
      console.error('Error toggling agent:', error);
    }
  };

  if (authLoading || loading) {
    return (
      <div className="flex items-center justify-center h-64">
        <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-primary-600"></div>
      </div>
    );
  }

  return (
    <div>
      <div className="flex justify-between items-center mb-6">
        <div>
          <h1 className="text-2xl font-bold">Agentes IA</h1>
          <p className="text-gray-600">Configure seus chatbots</p>
        </div>
        <Link
          href="/dashboard/agents/new"
          className="flex items-center gap-2 px-4 py-2 bg-primary-600 text-white rounded-lg hover:bg-primary-700"
        >
          <Plus className="w-4 h-4" />
          Novo Agente
        </Link>
      </div>

      {agents.length === 0 ? (
        <div className="bg-white rounded-xl border p-12 text-center">
          <Bot className="w-16 h-16 text-gray-300 mx-auto mb-4" />
          <h2 className="text-xl font-semibold mb-2">Nenhum agente criado</h2>
          <p className="text-gray-500 mb-4">Crie seu primeiro agente de IA</p>
          <Link
            href="/dashboard/agents/new"
            className="inline-flex items-center gap-2 px-4 py-2 bg-primary-600 text-white rounded-lg hover:bg-primary-700"
          >
            <Plus className="w-4 h-4" />
            Criar Agente
          </Link>
        </div>
      ) : (
        <div className="grid gap-4">
          {agents.map((agent) => (
            <div key={agent.id} className="bg-white rounded-xl border p-6">
              <div className="flex items-start justify-between">
                <div className="flex items-start gap-4">
                  <div className={`w-12 h-12 rounded-lg flex items-center justify-center ${agent.isActive ? 'bg-primary-100' : 'bg-gray-100'}`}>
                    <Bot className={`w-6 h-6 ${agent.isActive ? 'text-primary-600' : 'text-gray-400'}`} />
                  </div>
                  <div>
                    <h3 className="text-lg font-semibold">{agent.name}</h3>
                    <p className="text-gray-500 text-sm">{agent.description || 'Sem descrição'}</p>
                    <div className="flex gap-4 mt-2 text-sm text-gray-500">
                      <span>{agent.modelProvider} / {agent.modelName}</span>
                      {agent.whatsappConfig && (
                        <span className={`px-2 py-0.5 rounded ${agent.whatsappConfig.connectionStatus === 'connected' ? 'bg-green-100 text-green-700' : 'bg-gray-100 text-gray-600'}`}>
                          WhatsApp: {agent.whatsappConfig.connectionStatus}
                        </span>
                      )}
                    </div>
                  </div>
                </div>
                <div className="flex gap-2">
                  <Link
                    href={`/dashboard/agents/${agent.id}/qr`}
                    className="p-2 text-gray-500 hover:text-gray-700 hover:bg-gray-100 rounded-lg"
                    title="QR Code"
                  >
                    <QrCode className="w-5 h-5" />
                  </Link>
                  <Link
                    href={`/dashboard/agents/${agent.id}`}
                    className="p-2 text-gray-500 hover:text-gray-700 hover:bg-gray-100 rounded-lg"
                    title="Configurar"
                  >
                    <Settings className="w-5 h-5" />
                  </Link>
                  <button
                    onClick={() => toggleAgent(agent.id, agent.isActive)}
                    className={`p-2 rounded-lg ${agent.isActive ? 'text-green-600 hover:bg-green-50' : 'text-gray-400 hover:bg-gray-100'}`}
                    title={agent.isActive ? 'Desativar' : 'Ativar'}
                  >
                    <Power className="w-5 h-5" />
                  </button>
                </div>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}
