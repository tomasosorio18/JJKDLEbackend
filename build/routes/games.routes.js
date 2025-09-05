"use strict";
var __createBinding = (this && this.__createBinding) || (Object.create ? (function(o, m, k, k2) {
    if (k2 === undefined) k2 = k;
    var desc = Object.getOwnPropertyDescriptor(m, k);
    if (!desc || ("get" in desc ? !m.__esModule : desc.writable || desc.configurable)) {
      desc = { enumerable: true, get: function() { return m[k]; } };
    }
    Object.defineProperty(o, k2, desc);
}) : (function(o, m, k, k2) {
    if (k2 === undefined) k2 = k;
    o[k2] = m[k];
}));
var __setModuleDefault = (this && this.__setModuleDefault) || (Object.create ? (function(o, v) {
    Object.defineProperty(o, "default", { enumerable: true, value: v });
}) : function(o, v) {
    o["default"] = v;
});
var __importStar = (this && this.__importStar) || (function () {
    var ownKeys = function(o) {
        ownKeys = Object.getOwnPropertyNames || function (o) {
            var ar = [];
            for (var k in o) if (Object.prototype.hasOwnProperty.call(o, k)) ar[ar.length] = k;
            return ar;
        };
        return ownKeys(o);
    };
    return function (mod) {
        if (mod && mod.__esModule) return mod;
        var result = {};
        if (mod != null) for (var k = ownKeys(mod), i = 0; i < k.length; i++) if (k[i] !== "default") __createBinding(result, mod, k[i]);
        __setModuleDefault(result, mod);
        return result;
    };
})();
var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {
    function adopt(value) { return value instanceof P ? value : new P(function (resolve) { resolve(value); }); }
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : adopt(result.value).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = __importDefault(require("express"));
const gameService = __importStar(require("../services/gameService"));
const personajeService = __importStar(require("../services/personajeServices"));
const router = express_1.default.Router();
router.get("/start", (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    const secret = yield gameService.iniciarJuego();
    console.log("Juego iniciado con personaje secreto:", secret);
    res.send({ success: true, mensaje: "Juego iniciado", personajeId: secret === null || secret === void 0 ? void 0 : secret.id, voiceId: secret === null || secret === void 0 ? void 0 : secret.voiceid, pictureId: secret === null || secret === void 0 ? void 0 : secret.pictureId, voice: secret === null || secret === void 0 ? void 0 : secret.voice, picture: secret === null || secret === void 0 ? void 0 : secret.picture });
}));
router.get("/secret", (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    const personajeSecreto = yield gameService.getDailySecret();
    if (personajeSecreto) {
        res.send({ success: true, personaje: personajeSecreto });
    }
    else {
        res.status(404).send({ success: false, mensaje: "Personaje secreto no encontrado" });
    }
}));
router.get("/previousRecords", (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    const records = yield gameService.getPreviousRecord();
    res.send({ success: true, records });
}));
router.get("/dailyRecords", (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    const records = yield gameService.getAllDailyRecords();
    res.send({ success: true, records });
}));
router.get("/reset", (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    yield gameService.resetDailySecret();
    res.send({ success: true, mensaje: "partida reseteada para hoy" });
}));
router.post("/guess", (req, res) => {
    const { id } = req.body;
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
});
router.post("/guessVoice", (req, res) => {
    const { id } = req.body;
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
            success: false,
            mensaje: "No hay personaje secreto inicializado. Llama primero a /start."
        });
    }
    const { result, hasWon } = comparison;
    res.send({ success: true, resultado: result, hasWon });
});
router.post("/guessPicture", (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    const { id } = req.body;
    const personaje = personajeService.getPersonajePictureById(id);
    console.log("personaje con picture", personaje);
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
}));
router.get("/clue", (req, res) => {
    const pista = gameService.getPistaPersonaje();
    if (pista) {
        res.send(pista);
    }
    else {
        res.status(404).send({ message: "Personaje no encontrado" });
    }
});
exports.default = router;
