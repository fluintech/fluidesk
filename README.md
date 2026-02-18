```markdown
# PRD — FLUIDESK AI

## 1. Visão Geral

**Nome do Produto:** FLUIDESK AI  
**Empresa:** Fluintech  
**Categoria:** Plataforma SaaS OmniChannel com IA Simplificada  
**Posicionamento:** Plataforma de atendimento e automação com IA feita para desburocratizar e simplificar a operação digital de pequenas e médias empresas.

---

## 1.1 Conceito do Nome

**FLUIDESK AI** une:

- **Flui** → fluxo simples, natural, sem fricção  
- **Desk** → central de atendimento  
- **AI** → inteligência acessível  

A proposta é clara:  
**IA que flui, sem complexidade técnica.**

---

# 2. Propósito do Produto

Desburocratizar o uso de IA em fluxos de atendimento, vendas e suporte para:

- Pequenas empresas  
- Profissionais autônomos  
- Negócios locais  
- Empresas em crescimento  

Permitindo que qualquer empresa utilize IA e automação sem precisar de time técnico.

---

# 3. Problema

Hoje, implementar IA exige:

- Configuração técnica complexa
- Integrações manuais
- Ferramentas separadas
- Curva de aprendizado alta
- Custos elevados

Pequenas empresas precisam de:

- Simplicidade
- Automação prática
- Interface intuitiva
- Resultado rápido

FLUIDESK AI resolve isso com uma plataforma unificada.

---

# 4. Público-Alvo

## 4.1 Segmentos

- PMEs
- Autônomos
- Clínicas
- Escritórios
- E-commerces
- Prestadores de serviço
- Infoprodutores

## 4.2 Personas

- Dono de pequena empresa
- Gestor comercial
- SDR
- Suporte
- Assistente administrativo

---

# 5. Proposta de Valor

FLUIDESK AI permite:

- Centralizar atendimento
- Automatizar respostas
- Organizar leads
- Executar follow-ups
- Criar fluxos inteligentes
- Usar IA sem precisar programar

Tudo em uma única interface.

---

# 6. Funcionalidades Principais

---

## 6.1 Multi-Tenant

- Isolamento por tenant
- Controle de acesso por usuário
- Times internos
- Permissões por papel

---

## 6.2 OmniChannel

### Canais suportados

- WhatsApp
- Instagram
- Facebook Messenger
- E-mail
- Webchat (futuro)

### Recursos

- Conexão simplificada
- Status em tempo real
- Agente IA por canal
- Time responsável por canal

---

## 6.3 Interface de Conversas (Estilo Chatwoot — Futurista e Simples)

### Diretriz de UX

Interface moderna, minimalista, intuitiva e com dark mode padrão.

---

### Estrutura

#### Sidebar Esquerda

- Lista de conversas
- Filtros por:
  - Canal
  - Status
  - Time
  - Tags
- Busca rápida
- Indicador de SLA

---

#### Área Central (Chat)

- Bolhas diferenciadas:
  - Cliente
  - IA
  - Operador
- Timestamp discreto
- Indicador de envio
- Scroll infinito
- Upload de mídia
- Sugestões rápidas da IA
- Atualização via WebSocket

---

#### Painel Direito

- Dados do contato
- Tags
- Pipeline
- Dados coletados
- Histórico
- Ações rápidas:
  - Transferir
  - Encerrar
  - Agendar follow-up

---

## 6.4 CRM Integrado

- Pipeline visual
- Estágios customizáveis
- Movimentação manual ou automática
- Histórico de mudanças
- Tags e categorização

---

## 6.5 Agentes de IA Simplificados

- Criar agente em poucos passos
- Prompt base configurável
- Vincular canal
- Vincular base de conhecimento
- Configuração simplificada (modo avançado opcional)

---

## 6.6 Base de Conhecimento

- Upload de arquivos
- Indexação automática
- Embeddings
- Busca vetorial
- Associação ao agente

---

## 6.7 Flow Engine (Sem Código)

Permite criar formulários inteligentes dentro do chat.

### Exemplo

Vendas:
- Orçamento
- Interesse
- Prazo

Suporte:
- Categoria
- Urgência

### Recursos

- Campos customizáveis
- Armazenamento estruturado
- Utilização em segmentação

---

## 6.8 Roteamento Automático

Baseado em:

- Canal
- Palavras-chave
- Intenção da IA
- SLA
- Disponibilidade de time

---

## 6.9 Follow-Up Inteligente

- Agendamento manual
- Regras automáticas
- Execução por worker
- Histórico de disparos

---

## 6.10 Campanhas

- Segmentação por:
  - Tags
  - Pipeline
  - Dados coletados
- Monitoramento por contato
- Status detalhado

---

## 6.11 Automação Visual

### Triggers

- Nova conversa
- Conversa parada
- Mudança de estágio
- Tag adicionada

### Ações

- Enviar mensagem
- Agendar follow-up
- Alterar pipeline
- Notificar time

---

# 7. Requisitos Não Funcionais

## Performance
- Resposta inferior a 300ms
- Paginação por cursor
- Índices otimizados

## Escalabilidade
- Preparado para alto volume de mensagens
- Workers desacoplados
- Arquitetura orientada a eventos

## Segurança
- RLS
- Criptografia de credenciais
- Controle de acesso granular

## UX
- Dark mode padrão
- Experiência fluida
- Mobile-friendly
- Interface intuitiva

---

# 8. Stack Recomendada

Backend:
- Node.js / NestJS
- PostgreSQL
- pgvector
- Redis
- WebSocket
- BullMQ

Frontend:
- Next.js
- React
- TailwindCSS

Infra:
- Docker
- Cloud escalável
- Monitoramento estruturado

---

# 9. Roadmap

## Fase 1
- WhatsApp
- Interface de chat
- IA básica
- Times

## Fase 2
- CRM
- Flow engine
- RAG

## Fase 3
- Automação avançada
- Campanhas
- Analytics
- Billing

---

# 10. Posicionamento Estratégico

FLUIDESK AI deve comunicar:

> Inteligência artificial descomplicada para negócios que precisam crescer sem burocracia.

É a forma mais simples de usar IA no atendimento e nas vendas.
```

