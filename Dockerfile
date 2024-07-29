FROM node:16-alpine as builder

WORKDIR /app

RUN apk add git python3 build-base

RUN --mount=type=secret,id=npmrc \
  cat /run/secrets/npmrc > /app/.npmrc

RUN --mount=type=secret,id=env_file \
  cat /run/secrets/env_file > /app/.env

COPY . .

ENV NODE_ENV=development

RUN yarn --ignore-optional install
RUN yarn --ignore-optional run build:web

FROM nginx:alpine

COPY --from=builder /app/dist /usr/share/nginx/html
