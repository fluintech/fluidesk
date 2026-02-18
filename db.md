```sql
-- =====================================================
-- EXTENSÕES
-- =====================================================
CREATE EXTENSION IF NOT EXISTS pgcrypto;
CREATE EXTENSION IF NOT EXISTS vector;

-- =====================================================
-- FUNÇÃO GLOBAL updated_at
-- =====================================================
CREATE OR REPLACE FUNCTION set_updated_at()
RETURNS TRIGGER AS $$
BEGIN
  NEW.updated_at = now();
  RETURN NEW;
END;
$$ LANGUAGE plpgsql;

-- =====================================================
-- TENANTS
-- =====================================================
CREATE TABLE tenants (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  name TEXT NOT NULL,
  plan TEXT,
  created_at TIMESTAMP DEFAULT now(),
  updated_at TIMESTAMP DEFAULT now()
);

CREATE TRIGGER trg_tenants_updated
BEFORE UPDATE ON tenants
FOR EACH ROW EXECUTE FUNCTION set_updated_at();

-- =====================================================
-- USERS
-- =====================================================
CREATE TABLE users (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  tenant_id UUID NOT NULL REFERENCES tenants(id) ON DELETE CASCADE,
  name TEXT,
  email TEXT,
  role TEXT,
  created_at TIMESTAMP DEFAULT now(),
  updated_at TIMESTAMP DEFAULT now()
);

CREATE INDEX idx_users_tenant ON users(tenant_id);

CREATE TRIGGER trg_users_updated
BEFORE UPDATE ON users
FOR EACH ROW EXECUTE FUNCTION set_updated_at();

-- =====================================================
-- TEAMS
-- =====================================================
CREATE TABLE teams (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  tenant_id UUID NOT NULL REFERENCES tenants(id) ON DELETE CASCADE,
  name TEXT NOT NULL,
  description TEXT,
  is_active BOOLEAN DEFAULT true,
  created_at TIMESTAMP DEFAULT now(),
  updated_at TIMESTAMP DEFAULT now()
);

CREATE INDEX idx_teams_tenant ON teams(tenant_id);

CREATE TRIGGER trg_teams_updated
BEFORE UPDATE ON teams
FOR EACH ROW EXECUTE FUNCTION set_updated_at();

CREATE TABLE team_members (
  team_id UUID REFERENCES teams(id) ON DELETE CASCADE,
  user_id UUID REFERENCES users(id) ON DELETE CASCADE,
  role_in_team TEXT DEFAULT 'member',
  joined_at TIMESTAMP DEFAULT now(),
  PRIMARY KEY (team_id, user_id)
);

-- =====================================================
-- CHANNELS
-- =====================================================
CREATE TABLE channels (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  tenant_id UUID NOT NULL REFERENCES tenants(id) ON DELETE CASCADE,
  type TEXT NOT NULL,
  name TEXT,
  credentials JSONB,
  status TEXT DEFAULT 'active',
  created_at TIMESTAMP DEFAULT now(),
  updated_at TIMESTAMP DEFAULT now()
);

CREATE TRIGGER trg_channels_updated
BEFORE UPDATE ON channels
FOR EACH ROW EXECUTE FUNCTION set_updated_at();

CREATE TABLE team_channels (
  team_id UUID REFERENCES teams(id) ON DELETE CASCADE,
  channel_id UUID REFERENCES channels(id) ON DELETE CASCADE,
  PRIMARY KEY (team_id, channel_id)
);

-- =====================================================
-- COMPANIES & CONTACTS
-- =====================================================
CREATE TABLE companies (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  tenant_id UUID NOT NULL REFERENCES tenants(id) ON DELETE CASCADE,
  name TEXT NOT NULL,
  metadata JSONB,
  created_at TIMESTAMP DEFAULT now(),
  updated_at TIMESTAMP DEFAULT now()
);

CREATE TRIGGER trg_companies_updated
BEFORE UPDATE ON companies
FOR EACH ROW EXECUTE FUNCTION set_updated_at();

CREATE TABLE contacts (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  tenant_id UUID NOT NULL REFERENCES tenants(id) ON DELETE CASCADE,
  company_id UUID REFERENCES companies(id),
  name TEXT,
  email TEXT,
  phone TEXT,
  external_id TEXT,
  metadata JSONB,
  created_at TIMESTAMP DEFAULT now(),
  updated_at TIMESTAMP DEFAULT now()
);

CREATE INDEX idx_contacts_tenant_phone 
ON contacts(tenant_id, phone);

CREATE TRIGGER trg_contacts_updated
BEFORE UPDATE ON contacts
FOR EACH ROW EXECUTE FUNCTION set_updated_at();

-- =====================================================
-- CONVERSATIONS
-- =====================================================
CREATE TABLE conversations (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  tenant_id UUID NOT NULL REFERENCES tenants(id) ON DELETE CASCADE,
  contact_id UUID REFERENCES contacts(id),
  channel_id UUID REFERENCES channels(id),
  team_id UUID REFERENCES teams(id),
  assigned_user_id UUID REFERENCES users(id),
  status TEXT DEFAULT 'open',
  started_at TIMESTAMP DEFAULT now(),
  closed_at TIMESTAMP,
  created_at TIMESTAMP DEFAULT now(),
  updated_at TIMESTAMP DEFAULT now()
);

CREATE INDEX idx_conversations_tenant ON conversations(tenant_id);
CREATE INDEX idx_conversations_team ON conversations(team_id);

CREATE TRIGGER trg_conversations_updated
BEFORE UPDATE ON conversations
FOR EACH ROW EXECUTE FUNCTION set_updated_at();

-- =====================================================
-- MESSAGES
-- =====================================================
CREATE TABLE messages (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  conversation_id UUID REFERENCES conversations(id) ON DELETE CASCADE,
  sender_type TEXT,
  content TEXT,
  raw_payload JSONB,
  created_at TIMESTAMP DEFAULT now(),
  updated_at TIMESTAMP DEFAULT now()
);

CREATE INDEX idx_messages_conversation 
ON messages(conversation_id, created_at);

CREATE TRIGGER trg_messages_updated
BEFORE UPDATE ON messages
FOR EACH ROW EXECUTE FUNCTION set_updated_at();

-- =====================================================
-- AI AGENTS
-- =====================================================
CREATE TABLE ai_agents (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  tenant_id UUID NOT NULL REFERENCES tenants(id) ON DELETE CASCADE,
  name TEXT NOT NULL,
  model TEXT,
  temperature NUMERIC(3,2),
  system_prompt TEXT,
  active BOOLEAN DEFAULT true,
  created_at TIMESTAMP DEFAULT now(),
  updated_at TIMESTAMP DEFAULT now()
);

CREATE TRIGGER trg_ai_agents_updated
BEFORE UPDATE ON ai_agents
FOR EACH ROW EXECUTE FUNCTION set_updated_at();

CREATE TABLE team_ai_agents (
  team_id UUID REFERENCES teams(id) ON DELETE CASCADE,
  ai_agent_id UUID REFERENCES ai_agents(id) ON DELETE CASCADE,
  PRIMARY KEY (team_id, ai_agent_id)
);

-- =====================================================
-- KNOWLEDGE BASE (RAG)
-- =====================================================
CREATE TABLE knowledge_bases (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  tenant_id UUID NOT NULL REFERENCES tenants(id) ON DELETE CASCADE,
  name TEXT NOT NULL,
  description TEXT,
  is_active BOOLEAN DEFAULT true,
  created_at TIMESTAMP DEFAULT now(),
  updated_at TIMESTAMP DEFAULT now()
);

CREATE TRIGGER trg_kb_updated
BEFORE UPDATE ON knowledge_bases
FOR EACH ROW EXECUTE FUNCTION set_updated_at();

CREATE TABLE knowledge_documents (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  knowledge_base_id UUID REFERENCES knowledge_bases(id) ON DELETE CASCADE,
  title TEXT,
  source_type TEXT,
  metadata JSONB,
  created_at TIMESTAMP DEFAULT now(),
  updated_at TIMESTAMP DEFAULT now()
);

CREATE TRIGGER trg_kb_docs_updated
BEFORE UPDATE ON knowledge_documents
FOR EACH ROW EXECUTE FUNCTION set_updated_at();

CREATE TABLE knowledge_chunks (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  document_id UUID REFERENCES knowledge_documents(id) ON DELETE CASCADE,
  content TEXT NOT NULL,
  embedding VECTOR(1536),
  tokens INTEGER,
  created_at TIMESTAMP DEFAULT now(),
  updated_at TIMESTAMP DEFAULT now()
);

CREATE INDEX idx_knowledge_chunks_embedding
ON knowledge_chunks USING ivfflat (embedding vector_cosine_ops);

CREATE TRIGGER trg_kb_chunks_updated
BEFORE UPDATE ON knowledge_chunks
FOR EACH ROW EXECUTE FUNCTION set_updated_at();

CREATE TABLE agent_knowledge_bases (
  ai_agent_id UUID REFERENCES ai_agents(id) ON DELETE CASCADE,
  knowledge_base_id UUID REFERENCES knowledge_bases(id) ON DELETE CASCADE,
  PRIMARY KEY (ai_agent_id, knowledge_base_id)
);

-- =====================================================
-- FLOW ENGINE
-- =====================================================
CREATE TABLE flow_templates (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  tenant_id UUID NOT NULL REFERENCES tenants(id) ON DELETE CASCADE,
  name TEXT,
  category TEXT,
  created_at TIMESTAMP DEFAULT now(),
  updated_at TIMESTAMP DEFAULT now()
);

CREATE TRIGGER trg_flow_templates_updated
BEFORE UPDATE ON flow_templates
FOR EACH ROW EXECUTE FUNCTION set_updated_at();

CREATE TABLE flow_fields (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  flow_template_id UUID REFERENCES flow_templates(id) ON DELETE CASCADE,
  field_key TEXT,
  label TEXT,
  field_type TEXT,
  required BOOLEAN DEFAULT false,
  options JSONB,
  validation JSONB,
  position INTEGER,
  created_at TIMESTAMP DEFAULT now(),
  updated_at TIMESTAMP DEFAULT now()
);

CREATE TRIGGER trg_flow_fields_updated
BEFORE UPDATE ON flow_fields
FOR EACH ROW EXECUTE FUNCTION set_updated_at();

CREATE TABLE conversation_data (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  conversation_id UUID REFERENCES conversations(id) ON DELETE CASCADE,
  flow_template_id UUID REFERENCES flow_templates(id),
  data JSONB,
  created_at TIMESTAMP DEFAULT now(),
  updated_at TIMESTAMP DEFAULT now()
);

CREATE INDEX idx_conversation_data_gin
ON conversation_data USING GIN (data);

CREATE TRIGGER trg_conversation_data_updated
BEFORE UPDATE ON conversation_data
FOR EACH ROW EXECUTE FUNCTION set_updated_at();

-- =====================================================
-- TAGS
-- =====================================================
CREATE TABLE tags (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  tenant_id UUID NOT NULL REFERENCES tenants(id) ON DELETE CASCADE,
  name TEXT NOT NULL,
  created_at TIMESTAMP DEFAULT now(),
  updated_at TIMESTAMP DEFAULT now()
);

CREATE TRIGGER trg_tags_updated
BEFORE UPDATE ON tags
FOR EACH ROW EXECUTE FUNCTION set_updated_at();

CREATE TABLE conversation_tags (
  conversation_id UUID REFERENCES conversations(id) ON DELETE CASCADE,
  tag_id UUID REFERENCES tags(id) ON DELETE CASCADE,
  PRIMARY KEY (conversation_id, tag_id)
);

-- =====================================================
-- FOLLOW UPS
-- =====================================================
CREATE TABLE conversation_followups (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  conversation_id UUID REFERENCES conversations(id) ON DELETE CASCADE,
  scheduled_for TIMESTAMP NOT NULL,
  status TEXT DEFAULT 'pending',
  message_template TEXT,
  created_by UUID,
  created_at TIMESTAMP DEFAULT now(),
  updated_at TIMESTAMP DEFAULT now()
);

CREATE INDEX idx_followups_scheduled
ON conversation_followups(status, scheduled_for);

CREATE TRIGGER trg_followups_updated
BEFORE UPDATE ON conversation_followups
FOR EACH ROW EXECUTE FUNCTION set_updated_at();

-- =====================================================
-- CAMPAIGNS
-- =====================================================
CREATE TABLE campaigns (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  tenant_id UUID NOT NULL REFERENCES tenants(id) ON DELETE CASCADE,
  name TEXT,
  channel_id UUID REFERENCES channels(id),
  status TEXT DEFAULT 'draft',
  created_at TIMESTAMP DEFAULT now(),
  updated_at TIMESTAMP DEFAULT now()
);

CREATE TRIGGER trg_campaigns_updated
BEFORE UPDATE ON campaigns
FOR EACH ROW EXECUTE FUNCTION set_updated_at();

CREATE TABLE campaign_targets (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  campaign_id UUID REFERENCES campaigns(id) ON DELETE CASCADE,
  contact_id UUID REFERENCES contacts(id),
  status TEXT DEFAULT 'pending',
  sent_at TIMESTAMP,
  created_at TIMESTAMP DEFAULT now(),
  updated_at TIMESTAMP DEFAULT now()
);

CREATE TRIGGER trg_campaign_targets_updated
BEFORE UPDATE ON campaign_targets
FOR EACH ROW EXECUTE FUNCTION set_updated_at();

-- =====================================================
-- AUTOMATION RULES
-- =====================================================
CREATE TABLE automation_rules (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  tenant_id UUID NOT NULL REFERENCES tenants(id) ON DELETE CASCADE,
  name TEXT,
  trigger_event TEXT,
  conditions JSONB,
  actions JSONB,
  is_active BOOLEAN DEFAULT true,
  created_at TIMESTAMP DEFAULT now(),
  updated_at TIMESTAMP DEFAULT now()
);

CREATE TRIGGER trg_automation_rules_updated
BEFORE UPDATE ON automation_rules
FOR EACH ROW EXECUTE FUNCTION set_updated_at();
```
