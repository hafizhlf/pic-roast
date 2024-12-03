FROM docker.io/library/node:lts-alpine AS build_node_modules

COPY /app /app
WORKDIR /app
RUN npm install --force
RUN npm run build
RUN npm prune --omit=dev --force

FROM docker.io/library/node:lts-alpine
COPY --from=build_node_modules /app /app

ENV NODE_ENV=production

WORKDIR /app
CMD ["npm", "run", "start"]
