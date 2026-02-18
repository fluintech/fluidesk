'use client';

import { useEffect, useState } from 'react';
import { useRouter } from 'next/navigation';
import { useAuth } from '@/lib/auth-context';
import api from '@/lib/api';
import { MessageSquare, Search, Filter, User, Clock, Tag, Plus } from 'lucide-react';

interface Conversation {
  id: string;
  status: string;
  priority: string;
  contact: { name: string; phone: string };
  channel: { name: string; type: string };
  assignedUser: { name: string } | null;
  tags: { tag: { name: string; color: string } }[];
  _count: { messages: number };
  updatedAt: string;
}

export default function ConversationsPage() {
  const { user, loading: authLoading } = useAuth();
  const router = useRouter();
  const [conversations, setConversations] = useState<Conversation[]>([]);
  const [loading, setLoading] = useState(true);
  const [filter, setFilter] = useState('');

  useEffect(() => {
    if (!authLoading && !user) router.push('/login');
    else if (user) fetchConversations();
  }, [user, authLoading, router]);

  const fetchConversations = async () => {
    try {
      const response = await api.get('/conversations');
      setConversations(response.data);
    } catch (error) {
      console.error('Error fetching conversations:', error);
    } finally {
      setLoading(false);
    }
  };

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'open': return 'bg-green-100 text-green-700';
      case 'pending': return 'bg-yellow-100 text-yellow-700';
      case 'closed': return 'bg-gray-100 text-gray-700';
      default: return 'bg-gray-100 text-gray-700';
    }
  };

  const getPriorityIcon = (priority: string) => {
    switch (priority) {
      case 'urgent': return '🔴';
      case 'high': return '🟠';
      default: return '';
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
          <h1 className="text-2xl font-bold">Conversas</h1>
          <p className="text-gray-600">Gerencie atendimentos</p>
        </div>
      </div>

      {/* Filters */}
      <div className="flex gap-4 mb-6">
        <div className="flex-1 relative">
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-400" />
          <input
            type="text"
            placeholder="Buscar conversas..."
            value={filter}
            onChange={(e) => setFilter(e.target.value)}
            className="w-full pl-10 pr-4 py-2 border rounded-lg"
          />
        </div>
        <select className="px-4 py-2 border rounded-lg" onChange={(e) => fetchConversations()}>
          <option value="">Todos os status</option>
          <option value="open">Abertas</option>
          <option value="pending">Pendentes</option>
          <option value="closed">Encerradas</option>
        </select>
      </div>

      {/* Conversations List */}
      <div className="bg-white rounded-xl border overflow-hidden">
        <table className="w-full">
          <thead className="bg-gray-50 border-b">
            <tr>
              <th className="px-4 py-3 text-left text-sm font-medium text-gray-500">Status</th>
              <th className="px-4 py-3 text-left text-sm font-medium text-gray-500">Contato</th>
              <th className="px-4 py-3 text-left text-sm font-medium text-gray-500">Canal</th>
              <th className="px-4 py-3 text-left text-sm font-medium text-gray-500">Atendente</th>
              <th className="px-4 py-3 text-left text-sm font-medium text-gray-500">Mensagens</th>
              <th className="px-4 py-3 text-left text-sm font-medium text-gray-500">Atualizado</th>
            </tr>
          </thead>
          <tbody>
            {conversations.length === 0 ? (
              <tr>
                <td colSpan={6} className="px-4 py-12 text-center text-gray-500">
                  <MessageSquare className="w-12 h-12 mx-auto mb-4 text-gray-300" />
                  <p>Nenhuma conversa encontrada</p>
                </td>
              </tr>
            ) : (
              conversations.map((conv) => (
                <tr key={conv.id} className="border-b hover:bg-gray-50 cursor-pointer">
                  <td className="px-4 py-3">
                    <div className="flex items-center gap-2">
                      <span className={`px-2 py-1 rounded text-xs font-medium ${getStatusColor(conv.status)}`}>
                        {conv.status}
                      </span>
                      <span>{getPriorityIcon(conv.priority)}</span>
                    </div>
                  </td>
                  <td className="px-4 py-3">
                    <div className="flex items-center gap-2">
                      <User className="w-4 h-4 text-gray-400" />
                      <span className="font-medium">{conv.contact?.name || 'Desconhecido'}</span>
                    </div>
                    <p className="text-sm text-gray-500">{conv.contact?.phone}</p>
                  </td>
                  <td className="px-4 py-3 text-sm text-gray-600">
                    {conv.channel?.name || conv.channel?.type}
                  </td>
                  <td className="px-4 py-3 text-sm">
                    {conv.assignedUser?.name || <span className="text-gray-400">Não atribuída</span>}
                  </td>
                  <td className="px-4 py-3 text-sm text-gray-600">
                    {conv._count.messages}
                  </td>
                  <td className="px-4 py-3 text-sm text-gray-500">
                    {new Date(conv.updatedAt).toLocaleString('pt-BR')}
                  </td>
                </tr>
              ))
            )}
          </tbody>
        </table>
      </div>
    </div>
  );
}
