FROM node:20 as base
FROM base as deps


WORKDIR /app
COPY package.json pnpm-lock.yarm ./

RUN npm install -g pnpm
RUN pnpm i

FROM base as builder

WORKDIR /app

ARG ENV

RUN echo "ENV is set to $ENV"

COPY --from=deps /app/node_modules ./node_modules
COPY . .
COPY .env.${ENV} .env
RUN pnpm run build

FROM base as runner
WORKDIR /app
ENV NODE_ENV production
RUN addgroup --system --gid 1001 nodejs
RUN adduser --system --uid 1001 nextjs
COPY --from=builder /app/public ./public
COPY --from=builder --chown=nextjs:nodejs /app/.next/standalone ./
COPY --from=builder --chown=nextjs:nodejs /app/.next/static ./.next/static


USER nextjs
EXPOSE 3000
ENV PORT 3000
CMD ["node", "server.js"]