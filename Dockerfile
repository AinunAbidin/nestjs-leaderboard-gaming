FROM node:20-alpine AS builder
WORKDIR /usr/src/app

ENV NODE_ENV=development

COPY package*.json ./

RUN npm ci

COPY . .

RUN npx prisma generate

RUN npm run build

FROM node:20-alpine AS runner
WORKDIR /usr/src/app

ENV NODE_ENV=production

COPY package.json ./

RUN npm install --omit=dev

COPY --from=builder /usr/src/app/dist ./dist
COPY --from=builder /usr/src/app/prisma ./prisma
COPY --from=builder /usr/src/app/prisma.config.ts .

EXPOSE 3000

CMD sh -c "npx prisma migrate deploy && node dist/src/main.js"