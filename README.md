# FLUIDESK AI

Plataforma SaaS de atendimento AI-First com multi-tenancy.

## Stack

- **Frontend**: Next.js 14 (App Router) + TypeScript + TailwindCSS
- **Backend**: NestJS + TypeScript
- **Database**: PostgreSQL + Prisma 7
- **Auth**: JWT próprio com refresh tokens

## Arquitetura

```
fluidesk/
├── apps/
│   ├── web/          # Frontend Next.js
│   └── api/          # Backend NestJS
├── packages/         # Shared packages
└── turbo.json        # Turborepo config
```

## Getting Started

```bash
# Install dependencies
npm install

# Generate Prisma Client
npm run db:generate

# Push schema to database
npm run db:push

# Run development
npm run dev
```

## Documentação

- [Schema do Banco](./docs/schema.md)
- [API](./apps/api/README.md)
