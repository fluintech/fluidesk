REGRA DE INICIALIZAÇÃO DE SESSÃO:
Ao iniciar cada sessão:
1) Carregar SOMENTE estes arquivos:
- SOUL.md
- USER.md
- IDENTITY.md
- memory/YYYY-MM-DD.md (se existir)

2) NÃO carregar automaticamente:
- MEMORY.md
- Histórico de sessões
- Mensagens anteriores
- Saídas anteriores de ferramentas

3) Quando o usuário pedir contexto anterior:
- Use memory_search() sob demanda
- Extraia apenas o trecho relevante com memory_get()
- Não carregue o arquivo inteiro

4) Ao encerrar a sessão, atualize memory/YYYY-MM-DD.md com:
- O que foi trabalhado
- Decisões tomadas
- Leads gerados
- Bloqueios
- Próximos passos

Observação: essa regra reduz ~80% do overhead de contexto ao manter apenas o essencial na sessão.
