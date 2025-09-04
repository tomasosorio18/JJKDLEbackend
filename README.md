
# 📌 JJK API RESTful
📖 Descripción

API REST construida con **Node.js**, **Express** y **TypeScript**, que expone información de los personajes de *Jujutsu Kaisen*.  
Permite consultar la lista completa, obtener detalles por ID y filtrar personajes por voz u otros atributos.

# 🚀 Tecnologías

Node.js
 v18+

Express

TypeScript

[better-sqlite3]


[ESLint + Prettier] para estilo y calidad de código

# ⚙️ Instalación
## Clonar repositorio
git clone [https://github.com/tomasosorio18/JJKAPI](https://github.com/tomasosorio18/JJKAPI)
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

# 📡 Endpoints Principales
## 🔐 START
POST /game/start

Inicia un juego 

Response

{
    "success": true,
    "mensaje": "Juego iniciado",
    "personajeId": 59,
    "voiceId": 114,
    "pictureId": 47,
    "voice": "http://localhost:3000/voices/personajes/yutavoice.mp3",
    "picture": "http://localhost:3000/images/personajes/Uraume_29_large.webp"
}

## 👤 Personajes
GET /api/personajes

Devuelve todos los personajes existentes

Response

 {
        "id": 1,
        "name": "Masamichi Yaga",
        "species": "Human",
        "birthday": null,
        "gender": "Male",
        "age": ["47"],
        "status": "Deceased",
        "grade": "Grade 1",
        "appearance": "A tall man with a stern expression, often seen in a traditional jujutsu high uniform.",
        "personality": "Strict and disciplined, deeply cares for his students and the future of jujutsu society.",
        "abilities": {
            "special_trait": "Puppet Mastery",
            "innate_technique": "Puppet Manipulation (Cursed Corpse Creation)",
            "description": "Creates and controls autonomous cursed corpses like Panda. Expert in combat and exorcism.",
            "domain_expansion": "None",
            "has_domain": false,
            "has_rct": false
        },
        "image_url": "http://localhost:3000/images/personajes/Masamichi_Yaga_29.webp",
        "profile_url": "http://localhost:3000/images/personajes/Masamichi_Yaga_292.png",
        "image_url_large": "http://localhost:3000/images/personajes/Masamichi_Yaga_29_large.webp",
        "voice": "None",
        "group": "Jujutsu High Tokyo"
    },
## 👤 Personaje
/api/personajes/?id=1
Para obtener un solo personaje
## 👤 Secret
GET /game/secret

Devuelve una pista sobre el personaje diario

Response

 {
    "success": true,
    "personaje": {
        "date": "2025-09-01",
        "GuessCharacterId": 96,
        "GuessVoiceId": 104,
        "GuessPictureId": 33,
        "Voice": "http://localhost:3000/voices/personajes/getovoice.mp3",
        "Picture": "http://localhost:3000/images/personajes/Takada_Anime_large.webp"
    }
}
## 🛠️ Scripts Disponibles
npm run dev      # Iniciar en desarrollo con ts-node-dev
npm run build    # Compilar TypeScript a JavaScript
npm start        # Iniciar en producción
npm run lint     # Ejecutar ESLint
npm run format   # Formatear con Prettier

## 🧪 Testing
npm run test

# 📄 Licencia

Tomás Alexis Osorio Salinas - [Github](https://github.com/tomasosorio18) - [LinkedIn](https://www.linkedin.com/in/tomas-alexis-osorio-salinas-504b88198/)
