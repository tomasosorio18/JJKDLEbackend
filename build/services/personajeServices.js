"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.getPersonajePictureById = exports.getPersonajeVoiceById = exports.getPersonajesVoice = exports.getPersonajeById = exports.getLimitedInfoPersonajes = exports.getAllPersonajes = void 0;
const personajes_json_1 = __importDefault(require("./personajes.json"));
const personajes = personajes_json_1.default.data;
const getAllPersonajes = () => personajes;
exports.getAllPersonajes = getAllPersonajes;
const getLimitedInfoPersonajes = () => personajes.map(({ id, name, age, species, status, grade, image_url }) => ({ id, age, name, species, status, grade, image_url }));
exports.getLimitedInfoPersonajes = getLimitedInfoPersonajes;
const getPersonajeById = (id) => personajes.find((personaje) => personaje.id === id);
exports.getPersonajeById = getPersonajeById;
const getPersonajesVoice = () => {
    return personajes
        .filter((p) => p.voice && p.voice !== "None")
        .map(({ id, voice, name, image_url, profile_url }) => ({
        id,
        voice,
        name,
        image_url,
        profile_url
    }));
};
exports.getPersonajesVoice = getPersonajesVoice;
const getPersonajeVoiceById = (id) => {
    const personaje = personajes.find((p) => p.id === id && p.voice && p.voice !== "None");
    return personaje || null;
};
exports.getPersonajeVoiceById = getPersonajeVoiceById;
const getPersonajePictureById = (id) => {
    const personaje = personajes.find((p) => p.id === id && p.image_url_large);
    return personaje || null;
};
exports.getPersonajePictureById = getPersonajePictureById;
