'use client';

import { useEffect, useState } from 'react';
import { useRouter, useParams } from 'next/navigation';
import { useAuth } from '@/lib/auth-context';
import api from '@/lib/api';
import { Bot, Save, ArrowLeft, MessageSquare, Tag, Zap, BarChart3 } from 'lucide-react';
import Link from 'next/link';

interface Agent {
  id: string;
  name: string;
  description: string;
  modelProvider: string;
  modelName: string;
  temperature: number;
  maxTokens: number;
  systemPrompt: string;
  instructions: string;
  isActive: boolean;
  whatsappConfig?: any;
  personality?: any;
}

const modelProviders = [
  { value: 'openai', label: 'OpenAI' },
  { value: 'anthropic', label: 'Anthropic' },
  { value: 'google', label: 'Google Gemini' },
  { value: 'ollama', label: 'Ollama (Local)' },
];

export default function AgentDetailPage() {
  const { user, loading: authLoading } = useAuth();
  const router = useRouter();
  const params = useParams();
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [agent, setAgent] = useState<Partial<Agent>>({
    name: '',
    description: '',
    modelProvider: 'openai',
    modelName: 'gpt-4o-mini',
    temperature: 0.7,
    maxTokens: 2048,
    systemPrompt: '',
    instructions: '',
    isActive: true,
  });

  const isNew = params.id === 'new';

  useEffect(() => {
    if (!authLoading && !user) router.push('/login');
    else if (user && !isNew) fetchAgent();
    else if (user && isNew) setLoading(false);
  }, [user, authLoading, router, isNew]);

  const fetchAgent = async () => {
    try {
      const response = await api.get(`/ai-agents/${params.id}`);
      setAgent(response.data);
    } catch (error) {
      console.error('Error fetching agent:', error);
      router.push('/dashboard/agents');
    } finally {
      setLoading(false);
    }
  };

  const handleSave = async () => {
    setSaving(true);
    try {
      if (isNew) {
        await api.post('/ai-agents', agent);
      } else {
        await api.put(`/ai-agents/${params.id}`, agent);
      }
      router.push('/dashboard/agents');
    } catch (error) {
      console.error('Error saving agent:', error);
    } finally {
      setSaving(false);
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
      <div className="flex items-center gap-4 mb-6">
        <Link href="/dashboard/agents" className="p-2 hover:bg-gray-100 rounded-lg">
          <ArrowLeft className="w-5 h-5" />
        </Link>
        <div>
          <h1 className="text-2xl font-bold">{isNew ? 'Novo Agente' : 'Editar Agente'}</h1>
          <p className="text-gray-600">Configure as opções do agente de IA</p>
        </div>
      </div>

      <div className="grid gap-6">
        {/* Basic Info */}
        <div className="bg-white rounded-xl border p-6">
          <h2 className="text-lg font-semibold mb-4 flex items-center gap-2">
            <Bot className="w-5 h-5" />
            Informações Básicas
          </h2>
          <div className="grid gap-4">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">Nome do Agente</label>
              <input
                type="text"
                value={agent.name}
                onChange={(e) => setAgent({ ...agent, name: e.target.value })}
                className="w-full px-3 py-2 border rounded-lg focus:ring-2 focus:ring-primary-500"
                placeholder="Ex: Atendente Virtual"
              />
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">Descrição</label>
              <textarea
                value={agent.description}
                onChange={(e) => setAgent({ ...agent, description: e.target.value })}
                className="w-full px-3 py-2 border rounded-lg focus:ring-2 focus:ring-primary-500"
                rows={2}
                placeholder="Descreva o que esse agente faz"
              />
            </div>
          </div>
        </div>

        {/* Model Configuration */}
        <div className="bg-white rounded-xl border p-6">
          <h2 className="text-lg font-semibold mb-4 flex items-center gap-2">
            <Zap className="w-5 h-5" />
            Configurações do Modelo
          </h2>
          <div className="grid md:grid-cols-2 gap-4">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">Provedor</label>
              <select
                value={agent.modelProvider}
                onChange={(e) => setAgent({ ...agent, modelProvider: e.target.value })}
                className="w-full px-3 py-2 border rounded-lg focus:ring-2 focus:ring-primary-500"
              >
                {modelProviders.map((p) => (
                  <option key={p.value} value={p.value}>{p.label}</option>
                ))}
              </select>
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">Modelo</label>
              <input
                type="text"
                value={agent.modelName}
                onChange={(e) => setAgent({ ...agent, modelName: e.target.value })}
                className="w-full px-3 py-2 border rounded-lg focus:ring-2 focus:ring-primary-500"
                placeholder="Ex: gpt-4o-mini"
              />
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">Temperature: {agent.temperature}</label>
              <input
                type="range"
                min="0"
                max="1"
                step="0.1"
                value={agent.temperature}
                onChange={(e) => setAgent({ ...agent, temperature: parseFloat(e.target.value) })}
                className="w-full"
              />
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">Max Tokens</label>
              <input
                type="number"
                value={agent.maxTokens}
                onChange={(e) => setAgent({ ...agent, maxTokens: parseInt(e.target.value) })}
                className="w-full px-3 py-2 border rounded-lg focus:ring-2 focus:ring-primary-500"
              />
            </div>
          </div>
        </div>

        {/* Prompts */}
        <div className="bg-white rounded-xl border p-6">
          <h2 className="text-lg font-semibold mb-4">Prompts</h2>
          <div className="grid gap-4">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">System Prompt</label>
              <textarea
                value={agent.systemPrompt}
                onChange={(e) => setAgent({ ...agent, systemPrompt: e.target.value })}
                className="w-full px-3 py-2 border rounded-lg focus:ring-2 focus:ring-primary-500 font-mono text-sm"
                rows={4}
                placeholder="Instruções.system do agente..."
              />
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">Instruções Adicionais</label>
              <textarea
                value={agent.instructions}
                onChange={(e) => setAgent({ ...agent, instructions: e.target.value })}
                className="w-full px-3 py-2 border rounded-lg focus:ring-2 focus:ring-primary-500"
                rows={4}
                placeholder="Instruções detalhadas para o agente..."
              />
            </div>
          </div>
        </div>

        {/* Actions */}
        <div className="flex gap-4">
          <button
            onClick={handleSave}
            disabled={saving}
            className="flex items-center gap-2 px-6 py-2 bg-primary-600 text-white rounded-lg hover:bg-primary-700 disabled:opacity-50"
          >
            <Save className="w-4 h-4" />
            {saving ? 'Salvando...' : 'Salvar'}
          </button>
          <Link
            href="/dashboard/agents"
            className="px-6 py-2 border rounded-lg hover:bg-gray-50"
          >
            Cancelar
          </Link>
        </div>
      </div>
    </div>
  );
}
