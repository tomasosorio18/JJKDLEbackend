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
const allowedOrigins = ['http://localhost:5173','https://jjk-dle.vercel.app','https://jjk-dle.vercel.app/', 'https://jjkdle-phuv0yveg-tomasosorio18s-projects.vercel.app', 'https://jjkdle-phuv0yveg-tomasosorio18s-projects.vercel.app/'];
  app.use(cors({
    origin: allowedOrigins,
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