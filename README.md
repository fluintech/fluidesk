```markdown
# FLUIDESK AI — Diretrizes Técnicas AI-First

## 1. Princípio Arquitetural: AI-First

FLUIDESK AI deve ser construído com o conceito **AI-First**, onde:

- A IA não é um recurso adicional.
- A IA é o núcleo operacional do sistema.
- Toda interação pode ser potencialmente mediada por um modelo.
- Toda funcionalidade pode ser exposta como “skill” para orquestração inteligente.

A arquitetura deve permitir:

- Troca de modelo sem refatoração estrutural.
- Orquestração multi-modelo.
- Execução segura de ferramentas.
- Escalabilidade horizontal.
- Observabilidade completa.

---

# 2. Arquitetura Lógica

## 2.1 Camadas Principais

1. Interface Web (Next.js)
2. API Backend (NestJS ou similar)
3. Orquestrador de IA
4. MCP Server (Model Context Protocol)
5. Banco de Dados (PostgreSQL + pgvector)
6. Redis (cache + filas)
7. Workers assíncronos

---

# 3. Conexão com Qualquer Modelo LLM

## 3.1 Abstração Obrigatória

Criar uma camada chamada:

`LLMProviderAdapter`

Interface padrão:

```ts
interface LLMProvider {
  name: string
  generate(input: LLMInput): Promise<LLMOutput>
  stream?(input: LLMInput): AsyncIterable<LLMChunk>
  embeddings?(text: string[]): Promise<number[][]>
}
````

---

## 3.2 Implementações Suportadas

* OpenAI
* Azure OpenAI
* Anthropic
* Google Gemini
* Mistral
* Groq
* Modelos locais via Ollama
* Modelos hospedados privados

Cada provider deve:

* Suportar fallback
* Permitir timeout configurável
* Permitir retry exponencial
* Log estruturado
* Controle de custo por token

---

## 3.3 Estratégia Multi-Modelo

Sistema deve permitir:

* Modelo por tenant
* Modelo por canal
* Modelo por agente
* Modelo por tipo de tarefa (chat, embeddings, classificação)

---

# 4. MCP Server — Seguro por Padrão

## 4.1 Conceito

O MCP Server é a camada de execução controlada de ferramentas (“skills”).

Ele:

* Expõe funcionalidades do sistema para a IA
* Valida permissões
* Executa ações com segurança
* Isola contexto por tenant

---

## 4.2 Regras de Segurança

### 1. Contexto Isolado

Toda execução deve incluir:

```json
{
  "tenant_id": "...",
  "user_id": "...",
  "conversation_id": "...",
  "role": "..."
}
```

Sem contexto válido → rejeitar execução.

---

### 2. Validação de Permissões

Antes de executar qualquer skill:

* Validar role do usuário
* Validar escopo do tenant
* Validar escopo do time
* Registrar auditoria

---

### 3. Execução Determinística

Skills devem:

* Ter schema JSON validado
* Não aceitar input livre
* Não permitir execução arbitrária

---

### 4. Sandbox

* Nenhuma skill executa código dinâmico
* Nenhuma skill acessa filesystem diretamente
* Nenhuma skill executa SQL sem parametrização

---

# 5. Skills do Sistema

Cada módulo expõe um conjunto de skills.

---

## 5.1 Módulo Conversas

Skills:

* create_message
* assign_conversation
* close_conversation
* add_tag
* remove_tag
* transfer_to_team
* schedule_followup

---

## 5.2 Módulo CRM

Skills:

* create_pipeline
* move_stage
* update_deal
* add_note
* create_task

---

## 5.3 Módulo Flow Engine

Skills:

* request_field
* save_structured_data
* validate_input
* trigger_next_step

---

## 5.4 Módulo Base de Conhecimento

Skills:

* search_knowledge
* retrieve_document
* cite_source

---

## 5.5 Módulo Automação

Skills:

* trigger_workflow
* evaluate_rule
* execute_action

---

## 5.6 Módulo Campanhas

Skills:

* create_campaign
* segment_contacts
* send_bulk_message

---

# 6. Orquestrador de IA

## 6.1 Funções

* Selecionar modelo
* Construir contexto
* Carregar memória
* Injetar ferramentas
* Validar saída
* Registrar logs
* Monitorar custo

---

## 6.2 Contexto Inteligente

O prompt deve conter:

* Dados do tenant
* Dados do contato
* Histórico resumido
* Dados estruturados coletados
* Base de conhecimento relevante
* Lista de skills permitidas

---

## 6.3 Controle de Token

* Compressão automática de histórico
* Resumo progressivo
* Limite máximo configurável por tenant

---

# 7. Estrutura Escalável

## 7.1 Arquitetura Orientada a Eventos

Eventos principais:

* message.received
* message.sent
* conversation.closed
* pipeline.updated
* followup.due

Processados por:

* Workers assíncronos
* Filas (Redis / BullMQ)

---

## 7.2 Escalabilidade Horizontal

* API stateless
* Workers replicáveis
* WebSocket com cluster
* Particionamento futuro de mensagens

---

# 8. Observabilidade

Obrigatório:

* Logs estruturados
* Métricas por modelo
* Latência por provider
* Custo por tenant
* Execução de skills auditável

---

# 9. Documentação Moderna de Integração

## 9.1 Developer Portal

Deve incluir:

* API Reference (OpenAPI)
* SDKs oficiais
* Webhooks
* Guia rápido de integração
* Exemplos práticos
* Playground interativo

---

## 9.2 API Design

Padrões:

* RESTful
* Versionamento: `/v1/`
* JSON padronizado
* Idempotência para endpoints críticos

---

## 9.3 Webhooks

Eventos expostos:

* conversation.created
* message.created
* deal.updated
* campaign.completed

Segurança:

* Assinatura HMAC
* Timestamp
* Retry automático

---

# 10. Segurança Global

* Row Level Security no banco
* Criptografia de credenciais
* Secrets por tenant
* Rate limiting
* Proteção contra prompt injection
* Sanitização de saída
* Policy Engine para IA

---

# 11. Diretriz Estratégica

FLUIDESK AI deve ser:

* Modular
* Extensível
* Model-agnostic
* Seguro por padrão
* Escalável desde o primeiro dia

---

# 12. Declaração Final

FLUIDESK AI não é apenas um sistema de atendimento.

É uma plataforma AI-First onde:

* Cada módulo é uma skill.
* Cada ação é auditável.
* Cada tenant é isolado.
* Cada modelo pode ser substituído.
* Cada fluxo é inteligente por padrão.

```
