# Bun image
FROM oven/bun:1.1.42-debian
WORKDIR /usr/src/app

# Deps
COPY . .
RUN bun install --frozen-lockfile --production
RUN bun run build

# Run the app
USER bun
EXPOSE 6969/tcp
ENTRYPOINT ["bun", "run", "serve"]
