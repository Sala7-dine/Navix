# ---- Development stage ----
FROM node:20-alpine as development

WORKDIR /app

COPY package*.json ./
RUN npm install

COPY . .

EXPOSE 3000

CMD ["npm", "start"]

# ---- Build stage ----
FROM node:20-alpine as build

WORKDIR /app

COPY package*.json ./
RUN npm install

COPY . .
RUN npm run build

# ---- Serve stage ----
FROM nginx:alpine as production

# Copy build to nginx
COPY --from=build /app/build /usr/share/nginx/html 
# Expose port 80
EXPOSE 80

CMD ["nginx", "-g", "daemon off;"]
