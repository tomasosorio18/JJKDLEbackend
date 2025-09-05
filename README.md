# 📌 JJK DLE BACKEND

📖 Descripción

Aplicacion construida con **Node.js**, **Express** y **TypeScript**, Este backend maneja tanto la información de los personajes de Jujutsu Kaisen como la lógica completa de un juego de adivinanza (guess). Está construido con Node.js, Express y TypeScript, y utiliza PostgreSQL en Railway como base de datos para almacenar usuarios, partidas, pistas y registros diarios.

# 🚀 Tecnologías

Node.js
v18+

Express

TypeScript

Postgres (RAILWAY)

[ESLint + Prettier] para estilo y calidad de código

# ⚙️ Instalación

## Clonar repositorio

git clone [https://github.com/tomasosorio18/JJKDLEbackend](https://github.com/tomasosorio18/JJKDLEbackend)
cd tu-repo

## Instalar dependencias

npm install

## Compilar TypeScript

npm run build

## Iniciar en desarrollo

npm run dev

## Iniciar en producción

npm start

# 📂 Estructura del Proyecto

📦 public
┃ ┗ 📂images
┃ ┗ 📂voices
📦 src
┣ 📂 services
┃ ┃ ┗ gameService.ts
┃ ┃ ┗ personajeServices.ts
┣ 📂 routes
┃ ┃ ┗ games.routes.ts
┃ ┃ ┗ personajes.routes.ts
┃ ┃ ┗ personajes.json
┣ 📂 types
┃ ┃ ┗ types.d.ts
┣ 📂 db
┃ ┗ db.ts
┣ 📂 utils
┃ ┗ logger.ts
┣ app.ts
┣ index.ts

## 🛠️ Scripts Disponibles

npm run dev # Iniciar en desarrollo con ts-node-dev
npm run build # Compilar TypeScript a JavaScript
npm start # Iniciar en producción
npm run lint # Ejecutar ESLint
npm run format # Formatear con Prettier

## 🧪 Testing

npm run test

# 📄 Licencia

Tomás Alexis Osorio Salinas - [Github](https://github.com/tomasosorio18) - [LinkedIn](https://www.linkedin.com/in/tomas-alexis-osorio-salinas-504b88198/)
