import express from 'express';
import * as personajeService from '../services/personajeServices';
const router = express.Router();

router.get("/", (req, res) => {
  res.send(personajeService.getAllPersonajes());
});
router.get("/limited", (req, res) => {
  res.send(personajeService.getLimitedInfoPersonajes());
});
router.get("/voices", (req, res) => {
  res.send(personajeService.getPersonajesVoice());
});
router.get("/voices/:id", (req, res) => {
  const id = parseInt(req.params.id);
  const personaje = personajeService.getPersonajeVoiceById(id);
  if (!personaje) {
    return res.status(404).send({ error: "Personaje con voz no encontrado" });
  }
  res.send(personaje);
});

router.get("/:id", (req, res) => {
  const id = parseInt(req.params.id);
  const personaje = personajeService.getPersonajeById(id);
  if (personaje) {
    res.send(personaje);
  } else {
    res.status(404).send({ message: "Personaje no encontrado" });
  }
});


export default router;
