import express from "express";
import * as gameService from "../services/gameService";
import * as personajeService from "../services/personajeServices";

const router = express.Router();

router.get("/start", (req, res) => {
    const secret = gameService.iniciarJuego();
    console.log("Juego iniciado con personaje secreto:", secret);
    res.send({ success: true, mensaje: "Juego iniciado", personajeId: secret?.id, voiceId: secret?.voiceid, pictureId:secret?.pictureId, voice: secret?.voice, picture: secret?.picture});
});

router.get("/secret", (req, res) => {
    const personajeSecreto = gameService.getDailySecret();
    if (personajeSecreto) {
        res.send({ success: true, personaje: personajeSecreto });
    } else {
        res.status(404).send({ success: false, mensaje: "Personaje secreto no encontrado" });
    }
});
router.get("/previousRecords", (req, res) => {
  const records = gameService.getPreviousRecord();
  res.send({ success: true, records });
});

router.get("/dailyRecords", (req, res) => {
  const records = gameService.getAllDailyRecords();
  res.send({ success: true, records });
});
router.get("/reset", (req,res) => {
  gameService.resetDailySecret()
  res.send({success: true, mensaje:"partida reseteada para hoy"})
})
router.post("/guess", (req, res) => {
    const {id} = req.body;
    console.log("ID recibido:", id);
    const personaje = personajeService.getPersonajeById(id);
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
  const personaje = personajeService.getPersonajeVoiceById(id);
  if (!personaje) {
      return res.status(404).send({ success: false, mensaje: "Personaje no encontrado" });
  }
  //filtrar personajes con voz
  const comparison = gameService.compararConVoice(personaje);
    if (!comparison) {
        return res.status(500).send({ success: false, mensaje: "Error al comparar con el personaje secreto" });
    }

      const { result, hasWon } = comparison;
    console.log("Resultado de la comparación:", result);
    res.send({ success: true, resultado: result, hasWon });
})
router.post("/guessPicture", (req,res)=> {
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