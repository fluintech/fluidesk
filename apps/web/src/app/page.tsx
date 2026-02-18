import Link from "next/link";

export default function Home() {
  return (
    <div className="min-h-screen flex flex-col">
      <header className="border-b">
        <div className="container mx-auto px-4 py-4 flex justify-between items-center">
          <h1 className="text-2xl font-bold text-primary-600">Fluidesk AI</h1>
          <nav className="flex gap-4">
            <Link href="/login" className="text-gray-600 hover:text-gray-900">
              Login
            </Link>
            <Link
              href="/register"
              className="px-4 py-2 bg-primary-600 text-white rounded-lg hover:bg-primary-700"
            >
              Começar grátis
            </Link>
          </nav>
        </div>
      </header>

      <main className="flex-1">
        <section className="container mx-auto px-4 py-20 text-center">
          <h2 className="text-5xl font-bold mb-6">
            Atendimento inteligente com IA
          </h2>
          <p className="text-xl text-gray-600 mb-8 max-w-2xl mx-auto">
            Automatize seu atendimento com agentes de IA personalizados.
            Configure, teste e faça deploy em minutos.
          </p>
          <div className="flex gap-4 justify-center">
            <Link
              href="/register"
              className="px-8 py-3 bg-primary-600 text-white text-lg rounded-lg hover:bg-primary-700"
            >
              Teste grátis por 7 dias
            </Link>
          </div>
        </section>

        <section className="bg-gray-50 py-20">
          <div className="container mx-auto px-4">
            <h3 className="text-3xl font-bold text-center mb-12">
              Tudo que você precisa
            </h3>
            <div className="grid md:grid-cols-3 gap-8">
              <div className="bg-white p-6 rounded-xl shadow-sm">
                <div className="text-4xl mb-4">🤖</div>
                <h4 className="text-xl font-semibold mb-2">Agentes IA</h4>
                <p className="text-gray-600">
                  Configure personalidade, objetivos e regras para seus agentes.
                </p>
              </div>
              <div className="bg-white p-6 rounded-xl shadow-sm">
                <div className="text-4xl mb-4">📊</div>
                <h4 className="text-xl font-semibold mb-2">Análise em Tempo Real</h4>
                <p className="text-gray-600">
                  Sentimento, classificação e métricas para decisões baseadas em dados.
                </p>
              </div>
              <div className="bg-white p-6 rounded-xl shadow-sm">
                <div className="text-4xl mb-4">🔗</div>
                <h4 className="text-xl font-semibold mb-2">Integração n8n</h4>
                <p className="text-gray-600">
                  Conecte com WhatsApp, Telegram e outros canais.
                </p>
              </div>
            </div>
          </div>
        </section>
      </main>

      <footer className="border-t py-8">
        <div className="container mx-auto px-4 text-center text-gray-600">
          <p>© 2026 Fluidesk AI. Todos os direitos reservados.</p>
        </div>
      </footer>
    </div>
  );
}
