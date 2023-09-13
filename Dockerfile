FROM oven/bun:1.0.0

WORKDIR /app

ARG NODE_VERSION=18

ENV SKIP_GEN_GRAPHQL=false
ENV PORT=3000

RUN apt update \
  && apt install -y curl

RUN curl -L https://raw.githubusercontent.com/tj/n/master/bin/n -o n \
  && bash n $NODE_VERSION \
  && rm n \
  && npm install -g n

COPY package.json ./
COPY bun.lockb ./
COPY tsconfig.json ./

COPY patches ./patches/
COPY src ./src/
COPY prisma ./prisma/

RUN bun install --production
RUN bun run build

EXPOSE 3000

CMD ["bun", "run", "start"]
