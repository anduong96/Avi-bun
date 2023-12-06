# use the official Bun image
# see all versions at https://hub.docker.com/r/oven/bun/tags
## Need the --platform to be linux because otherwise it will build for M1 and not work on the server
FROM oven/bun:1 as base
WORKDIR /app

# Install Doppler
RUN apt-get update && apt-get install -y apt-transport-https ca-certificates curl gnupg && \
  curl -sLf --retry 3 --tlsv1.2 --proto "=https" 'https://packages.doppler.com/public/cli/gpg.DE2A7741A397C129.key' | gpg --dearmor -o /usr/share/keyrings/doppler-archive-keyring.gpg && \
  echo "deb [signed-by=/usr/share/keyrings/doppler-archive-keyring.gpg] https://packages.doppler.com/public/cli/deb/debian any-version main" | tee /etc/apt/sources.list.d/doppler-cli.list && \
  apt-get update && \
  apt-get -y install doppler

# install dependencies into temp directory
# this will cache them and speed up future builds
FROM base AS install
RUN mkdir -p /temp/dev
COPY package.json bun.lockb yarn.lock /temp/dev/
COPY prisma/schema.prisma /temp/dev/prisma/schema.prisma
COPY patches /temp/dev/patches

# Copy the node binary for prisma
COPY --from=node:18 /usr/local/bin/node /usr/local/bin/node

ENV DEBUG="*"
RUN cd /temp/dev && bun install --frozen-lockfile
RUN cd /temp/dev && bunx prisma generate

# RUN cd /temp/dev/node_modules && ls -l -a

# install with --production (exclude devDependencies)
RUN mkdir -p /temp/prod
COPY package.json bun.lockb /temp/prod/
RUN cd /temp/prod && bun install --frozen-lockfile --production

# copy node_modules from temp directory
# then copy all (non-ignored) project files into the image
FROM base AS prerelease
COPY --from=install /temp/dev/node_modules node_modules
COPY . .

# [optional] tests & build
ENV NODE_ENV=production

# copy production dependencies and source code into final image
FROM base AS release
COPY --from=install /temp/prod/node_modules node_modules
COPY --from=install /temp/dev/node_modules/.prisma node_modules/.prisma
COPY --from=prerelease /app/src src
COPY --from=prerelease /app/package.json package.json
COPY --from=prerelease /app/tsconfig.json tsconfig.json

# run the app
USER bun
EXPOSE 3000/tcp


ENTRYPOINT ["doppler", "run", "--"]
CMD ["bun", "run", "src/index.ts"]
