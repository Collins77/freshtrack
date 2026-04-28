# Use specific patched version
FROM node:20.19-alpine3.21

# Add security updates
RUN apk update && apk upgrade --no-cache

WORKDIR /app

COPY package*.json ./
RUN npm ci --production && npm cache clean --force

COPY . .

EXPOSE 5000

# Run as non-root user for security
RUN addgroup -g 1001 -S nodejs && \
    adduser -S nodeuser -u 1001
USER nodeuser

CMD ["node", "server.js"]