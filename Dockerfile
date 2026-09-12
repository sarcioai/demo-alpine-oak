# Alpine & Oak Outfitters' storefront, built from THIS repo alone.
# @sarcio/* are private packages, so the build needs a registry token:
#   docker build --secret id=npmrc,src=$HOME/.npmrc -t demo-alpine-oak .
FROM node:24-alpine AS build
WORKDIR /app

COPY package.json package-lock.json* ./
RUN --mount=type=secret,id=npmrc,target=/root/.npmrc \
    npm install

COPY app ./app
COPY host ./host
COPY public ./public
COPY build.mjs ./
# Registry-build the storefront's module graph + bundle its Sarcio host.
RUN node build.mjs

FROM node:24-alpine
WORKDIR /app
ENV NODE_ENV=production
COPY package.json package-lock.json* ./
RUN npm install --omit=dev
COPY --from=build /app/public ./public
COPY server.mjs ./

EXPOSE 4010
CMD ["node", "server.mjs"]
