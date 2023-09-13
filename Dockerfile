FROM oven/bun:1.0.0

WORKDIR /app

ARG NODE_VERSION=18

RUN apt update \
  && apt install -y curl

RUN curl -L https://raw.githubusercontent.com/tj/n/master/bin/n -o n \
  && bash n $NODE_VERSION \
  && rm n \
  && npm install -g n

COPY package.json ./
COPY bun.lockb ./
COPY tsconfig.json ./
COPY src ./src/
COPY prisma ./prisma/

RUN bun install
RUN bun run build

ENV PORT=3000

EXPOSE 3000

CMD ["bun", "run", "start"]
