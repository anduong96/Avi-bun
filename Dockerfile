FROM oven/bun:latest
WORKDIR /app
COPY package.json bun.lockb ./
RUN bun i
COPY . .

ENV PORT=3000

EXPOSE 3000

CMD ["bun", "start"]
