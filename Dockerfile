# Usar una imagen base oficial de Node.js (LTS)
FROM node:18-alpine

# Establecer el directorio de trabajo dentro del contenedor
WORKDIR /app

# Copiar los archivos de definición de dependencias
COPY package*.json ./

# Instalar las dependencias del proyecto
# Usamos --production para evitar instalar devDependencies en el entorno final si se desea,
# pero aquí instalamos todo para asegurar que el build funcione correctamente.
RUN npm install

# Copiar el resto del código de la aplicación
COPY . .

# Exponer el puerto en el que corre la aplicación
EXPOSE 3000

# Definir la variable de entorno para producción
ENV NODE_ENV=production

# Comando para iniciar la aplicación
CMD ["npm", "start"]
