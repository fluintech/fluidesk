FROM node:20-alpine

WORKDIR /app

# Copy package files
COPY apps/api/package*.json ./apps/api/
COPY apps/web/package*.json ./apps/web/
COPY package*.json ./

# Install dependencies
RUN npm install

# Generate Prisma
RUN cd apps/api && npx prisma generate

# Build API
RUN cd apps/api && npm run build

# Build Web
RUN cd apps/web && npm run build

EXPOSE 3000 3001

CMD ["npm", "run", "dev"]
