'use client';

import { useEffect, useState } from 'react';
import { useRouter } from 'next/navigation';
import { useAuth } from '@/lib/auth-context';
import api from '@/lib/api';
import { Users, Search, Plus, Building, Mail, Phone } from 'lucide-react';
import Link from 'next/link';

interface Contact {
  id: string;
  name: string;
  email: string;
  phone: string;
  company: { name: string } | null;
  tags: string[];
  createdAt: string;
}

export default function ContactsPage() {
  const { user, loading: authLoading } = useAuth();
  const router = useRouter();
  const [contacts, setContacts] = useState<Contact[]>([]);
  const [loading, setLoading] = useState(true);
  const [search, setSearch] = useState('');

  useEffect(() => {
    if (!authLoading && !user) router.push('/login');
    else if (user) fetchContacts();
  }, [user, authLoading, router]);

  const fetchContacts = async () => {
    try {
      const response = await api.get(`/contacts${search ? `?search=${search}` : ''}`);
      setContacts(response.data);
    } catch (error) {
      console.error('Error fetching contacts:', error);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    const timeout = setTimeout(() => {
      if (user) fetchContacts();
    }, 500);
    return () => clearTimeout(timeout);
  }, [search]);

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
          <h1 className="text-2xl font-bold">Contatos</h1>
          <p className="text-gray-600">Gerencie sua base de clientes</p>
        </div>
        <Link
          href="/dashboard/contacts/new"
          className="flex items-center gap-2 px-4 py-2 bg-primary-600 text-white rounded-lg hover:bg-primary-700"
        >
          <Plus className="w-4 h-4" />
          Novo Contato
        </Link>
      </div>

      {/* Search */}
      <div className="mb-6">
        <div className="relative max-w-md">
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-400" />
          <input
            type="text"
            placeholder="Buscar contatos..."
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            className="w-full pl-10 pr-4 py-2 border rounded-lg"
          />
        </div>
      </div>

      {/* Contacts Grid */}
      {contacts.length === 0 ? (
        <div className="bg-white rounded-xl border p-12 text-center">
          <Users className="w-16 h-16 text-gray-300 mx-auto mb-4" />
          <h2 className="text-xl font-semibold mb-2">Nenhum contato encontrado</h2>
          <p className="text-gray-500 mb-4">Adicione seu primeiro contato</p>
          <Link
            href="/dashboard/contacts/new"
            className="inline-flex items-center gap-2 px-4 py-2 bg-primary-600 text-white rounded-lg hover:bg-primary-700"
          >
            <Plus className="w-4 h-4" />
            Adicionar Contato
          </Link>
        </div>
      ) : (
        <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3">
          {contacts.map((contact) => (
            <div key={contact.id} className="bg-white rounded-xl border p-6 hover:shadow-md transition">
              <div className="flex items-start gap-4">
                <div className="w-12 h-12 bg-primary-100 rounded-full flex items-center justify-center">
                  <span className="text-primary-600 font-semibold text-lg">
                    {contact.name.charAt(0).toUpperCase()}
                  </span>
                </div>
                <div className="flex-1">
                  <h3 className="font-semibold">{contact.name}</h3>
                  {contact.company && (
                    <p className="text-sm text-gray-500 flex items-center gap-1">
                      <Building className="w-3 h-3" />
                      {contact.company.name}
                    </p>
                  )}
                </div>
              </div>
              
              <div className="mt-4 space-y-2">
                {contact.email && (
                  <p className="text-sm text-gray-600 flex items-center gap-2">
                    <Mail className="w-4 h-4 text-gray-400" />
                    {contact.email}
                  </p>
                )}
                {contact.phone && (
                  <p className="text-sm text-gray-600 flex items-center gap-2">
                    <Phone className="w-4 h-4 text-gray-400" />
                    {contact.phone}
                  </p>
                )}
              </div>

              {contact.tags && contact.tags.length > 0 && (
                <div className="mt-4 flex flex-wrap gap-2">
                  {contact.tags.map((tag, i) => (
                    <span key={i} className="px-2 py-1 bg-gray-100 text-gray-600 text-xs rounded">
                      {tag}
                    </span>
                  ))}
                </div>
              )}
            </div>
          ))}
        </div>
      )}
    </div>
  );
}
