FROM node:22-slim AS build
WORKDIR /app
COPY package.json package-lock.json* bun.lock* ./
RUN npm install
COPY . .
RUN npm run build

FROM node:22-slim AS runtime
WORKDIR /app
ENV NODE_ENV=production
ENV PORT=3000
ENV HOST=0.0.0.0
ENV NITRO_PORT=3000
ENV NITRO_HOST=0.0.0.0
COPY --from=build /app/.output ./.output
EXPOSE 3000
CMD ["node", ".output/server/index.mjs"]
