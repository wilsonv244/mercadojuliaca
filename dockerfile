# Usar la imagen oficial de Node.js
FROM node:18-alpine

# Establecer el directorio de trabajo dentro del contenedor
WORKDIR /app

# Copiar el package.json y el package-lock.json al contenedor
COPY package.json ./
COPY package-lock.json ./

# Instalar las dependencias
RUN npm install

# Copiar el resto del código de la aplicación
COPY . .

# Generar el cliente de Prisma
RUN npx prisma generate

# Exponer el puerto en el que se ejecutará la app
EXPOSE 3000

# Configurar la variable de entorno para Next.js en modo producción
ENV NODE_ENV=production

# Compilar la aplicación Next.js
RUN npm run build

# Ejecutar la aplicación
CMD ["npm", "start"]
