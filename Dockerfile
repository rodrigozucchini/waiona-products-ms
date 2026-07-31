# ---- development ----
FROM node:24-alpine AS development
WORKDIR /app
COPY package*.json ./
RUN npm install
COPY . .
CMD ["npm", "run", "start:dev"]

# ---- build (compila una sola vez, se usa solo para armar production) ----
FROM node:24-alpine AS build
WORKDIR /app
COPY package*.json ./
RUN npm install
COPY . .
RUN npm run build

# ---- production ----
FROM node:24-alpine AS production
WORKDIR /app
ENV NODE_ENV=production
COPY package*.json ./
RUN npm install --omit=dev && \
    addgroup -S app && adduser -S app -G app
COPY --from=build /app/dist ./dist
USER app
CMD ["node", "dist/main"]
