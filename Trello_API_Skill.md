# Skill para Interação com a API do Trello

## Objetivo  
Essa skill terá funções que permitem a integração com a API do Trello, utilizando as credenciais e endpoints definidos.

## Funcionalidades  
1. **Verificar Membros do Trello**  
   - **Descrição:** Esta função retorna as informações do membro autenticado.
   - **Endpoint:** `/1/members/me`
   - **Método:** `GET`
   - **Exemplo de Comando:**
     ```bash
     curl -X GET "https://api.trello.com/1/members/me?key=$TRELLO_API_KEY&token=$TRELLO_TOKEN"
     ```

2. **Listar Listas em Um Quadro**  
   - **Descrição:** Retorna todas as listas dentro do quadro específico pelo seu ID.
   - **Endpoint:** `/1/boards/{board_id}/lists`
   - **Método:** `GET`
   - **Exemplo de Comando:**
     ```bash
     curl -X GET "https://api.trello.com/1/boards/{board_id}/lists?key=$TRELLO_API_KEY&token=$TRELLO_TOKEN"
     ```

3. **Adicionar uma Tarefa**  
   - **Descrição:** Adiciona uma nova tarefa a uma lista específica.
   - **Endpoint:** `/1/cards`
   - **Método:** `POST`
   - **Exemplo de Comando:**
     ```bash
     curl -X POST "https://api.trello.com/1/cards?key=$TRELLO_API_KEY&token=$TRELLO_TOKEN&idList=699a564a32b802273a2f9405&name=Novo Teste"
     ```

4. **Atualizar uma Tarefa**  
   - **Descrição:** Atualiza informações de uma tarefa existente.
   - **Endpoint:** `/1/cards/{id}`
   - **Método:** `PUT`
   - **Exemplo de Comando:**
     ```bash
     curl -X PUT "https://api.trello.com/1/cards/{id}?key=$TRELLO_API_KEY&token=$TRELLO_TOKEN&name=Nome Atualizado"
     ```

## Documentação e Manutenção  
- Todos os comandos devem garantir que as variáveis de ambiente estão corretamente configuradas para o uso.
- A skill deve ser mantida atualizada com novos endpoints e funcionalidades conforme a API do Trello evolui.