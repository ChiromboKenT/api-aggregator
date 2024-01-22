# ---- Base Node ----
FROM node:20-alpine AS base

WORKDIR /home/node/app
COPY --chown=node:node . .

RUN apk update && \
    apk upgrade


# deps
FROM base AS deps
RUN npm ci --legacy-peer-deps --only=prod --ignore-scripts \
    && cp -R node_modules prod_node_modules \
    && npm ci --legacy-peer-deps --ignore-scripts

# development
FROM base AS development
COPY --from=deps --chown=node:node /home/node/app/node_modules ./node_modules

# build
FROM development AS build
ARG APP_NAME

RUN ./node_modules/@nestjs/cli/bin/nest.js build ${APP_NAME}

# prepare prod version
FROM base AS prod
COPY --from=deps --chown=node:node /home/node/app/prod_node_modules ./node_modules
COPY --from=build --chown=node:node /home/node/app/dist /home/node/app/dist

# run app
USER node
ENTRYPOINT ["/usr/local/bin/node"]
