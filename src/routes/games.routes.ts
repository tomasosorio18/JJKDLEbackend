import express, { Request, Response } from "express";
import * as gameService from "../services/gameService";
import * as personajeService from "../services/personajeServices";

const router = express.Router();

router.get("/start", async (_req: Request, res: Response) => {
  try {
    const record = await gameService.iniciarJuego();

    if (!record) {
      return res.status(500).json({
        success: false,
        mensaje: "No se pudo iniciar el juego",
      });
    }

    return res.json({
      success: true,
      mensaje: "Juego iniciado",
      personajeId: record.id,
      voiceId: record.voiceid,
      pictureId: record.pictureId,
      voice: record.voice,
      picture: record.picture,
    });
  } catch (error) {
    console.error("Error al iniciar el juego:", error);
    return res.status(500).json({
      success: false,
      mensaje: "Error interno del servidor",
    });
  }
});

router.get("/secret", async (req, res) => {
    const personajeSecreto = await gameService.getDailySecret();
    if (personajeSecreto) {
        res.send({ success: true, personaje: personajeSecreto });
    } else {
        res.status(404).send({ success: false, mensaje: "Personaje secreto no encontrado" });
    }
});
router.get("/previousRecords", async (req, res) => {
  const records =  await gameService.getPreviousRecord();
  res.send({ success: true, records });
});

router.get("/dailyRecords", async (req, res) => {
  const records =  await gameService.getAllDailyRecords();
  res.send({ success: true, records });
});
router.get("/reset", async (req,res) => {
  await gameService.resetDailySecret()
  res.send({success: true, mensaje:"partida reseteada para hoy"})
})
router.post("/guess", (req, res) => {
    const {id} = req.body;
    console.log("ID recibido:", id);
    const personaje =  personajeService.getPersonajeById(id);
    console.log("Personaje encontrado:", personaje);
    if (!personaje) {
        return res.status(404).send({ success: false, mensaje: "Personaje no encontrado" });
    }
    const comparison = gameService.compararConSecreto(personaje);
    if (!comparison) {
        return res.status(500).send({ success: false, mensaje: "Error al comparar con el personaje secreto" });
    }
    const { result, hasWon } = comparison;
    console.log("Resultado de la comparación:", result);
    res.send({ success: true, resultado: result, hasWon });
})
router.post("/guessVoice", (req,res) =>{
  const {id} = req.body;
  if (!id) {
    return res.status(400).send({ success: false, mensaje: "Falta el id en el body" });
  }

  const personaje = personajeService.getPersonajeVoiceById(id);
  if (!personaje) {
      return res.status(404).send({ success: false, mensaje: "Personaje con voz no encontrado" });
  }

  const comparison = gameService.compararConVoice(personaje);
  if (!comparison) {
      return res.status(400).send({ 
        success: true, 
        mensaje: "No es ese personaje." 
      });
  }

  const { result, hasWon } = comparison;
  res.send({ success: true, resultado: result, hasWon });
});
router.post("/guessPicture", async (req,res)=> {
  const {id} = req.body;
  const personaje = personajeService.getPersonajePictureById(id)
  console.log("personaje con picture", personaje)
   if (!personaje) {
      return res.status(404).send({ success: false, mensaje: "Personaje no encontrado" });
  }
   const comparison = gameService.compararConPicture(personaje);
    if (!comparison) {
        return res.status(500).send({ success: false, mensaje: "Error al comparar con el personaje secreto" });
    }
 const { result, hasWon } = comparison;
    console.log("Resultado de la comparación:", result);
    res.send({ success: true, resultado: result, hasWon });
})

router.get("/clue", (req, res) => {

  const pista = gameService.getPistaPersonaje();
  if (pista) {
    res.send(pista);
  } else {
    res.status(404).send({ message: "Personaje no encontrado" });
  }
});

export default router;