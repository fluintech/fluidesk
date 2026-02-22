# Instruções de Memória para Agentes da Fluintech

## Sistema de Memória em Camadas  
Os modelos de IA sofrem de "Alzheimer" a cada nova sessão. Para que a equipe da Fluintech lembre-se de arquiteturas e regras de negócio, a configuração de memória funcionará em camadas:

### 1. Extração de Sessão  
- Sempre que o limite de tokens da sessão se aproximar, o sistema deve ser instruído a compactar a conversa extraindo obrigatoriamente cinco fatores em Markdown:
  - **Lessons:** Aprendizados a partir da interação.
  - **Decisions:** Decisões tomadas durante a sessão.
  - **Projects:** Projetos discutidos ou desenvolvidos.
  - **People:** Pessoas mencionadas ou relevantes para a conversa.
  - **Pending:** Tarefas ou tópicos a serem abordados futuramente.

### 2. Notas Diárias  
- Todos os dias à meia-noite, um log em formato .md salvará o que os desenvolvedores produziram durante o dia.

### 3. Consolidação (a cada 15 dias)  
- O agente líder fará uma curadoria das notas diárias e extrairá aprendizados globais sobre a stack da Fluintech para um arquivo executivo em memory.md.