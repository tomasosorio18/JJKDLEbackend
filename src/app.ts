import express from "express";
import dotenv from "dotenv";
import dotenvExpand from 'dotenv-expand';
import personajesRoutes from './routes/personajes.routes';
import gameRoutes from './routes/games.routes';
import cors from 'cors'
const env = dotenv.config();
dotenvExpand.expand(env)
const app = express();
const port = process.env.PORT || 3000;

app.use(express.json());
app.use("/images", express.static("public/images"));
app.use("/voices", express.static("public/voices"));
const allowedOrigins = [
  "http://localhost:5173",
  "https://jjk-dle.vercel.app"
];

app.use(cors({
  origin: (origin, callback) => {
    if (!origin) return callback(null, true); // permitir requests desde Postman o backend

    // Permitir orígenes fijos o cualquier preview de Vercel (*.vercel.app)
    if (
      allowedOrigins.includes(origin) ||
      origin.endsWith(".vercel.app")
    ) {
      callback(null, true);
    } else {
      callback(new Error(`CORS not allowed for origin ${origin}`));
    }
  },
  credentials: true
}));


app.use("/api/personajes", personajesRoutes);
app.use("/game", gameRoutes)

app.listen(port, () => {
  console.log(`Server is running on http://localhost:${port}`);
});
app.get("/", (req, res) => {
  res.send("Hello World!");
});