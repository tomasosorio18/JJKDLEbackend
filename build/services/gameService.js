"use strict";
var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {
    function adopt(value) { return value instanceof P ? value : new P(function (resolve) { resolve(value); }); }
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : adopt(result.value).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};
var __rest = (this && this.__rest) || function (s, e) {
    var t = {};
    for (var p in s) if (Object.prototype.hasOwnProperty.call(s, p) && e.indexOf(p) < 0)
        t[p] = s[p];
    if (s != null && typeof Object.getOwnPropertySymbols === "function")
        for (var i = 0, p = Object.getOwnPropertySymbols(s); i < p.length; i++) {
            if (e.indexOf(p[i]) < 0 && Object.prototype.propertyIsEnumerable.call(s, p[i]))
                t[p[i]] = s[p[i]];
        }
    return t;
};
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.compararConSecreto = exports.compararConPicture = exports.compararConVoice = exports.getPistaPersonaje = exports.getPersonajeSecreto = exports.iniciarJuego = exports.resetDailySecret = exports.saveDailySecret = exports.getAllDailyRecords = exports.getPreviousRecord = exports.getDailySecret = void 0;
const db_1 = __importDefault(require("../db/db"));
const personajeServices_1 = require("./personajeServices");
const gradeOrder = [
    "None",
    "Grade 4",
    "Grade 3",
    "Semi-Grade 2",
    "Grade 2",
    "Semi-Grade 1",
    "Grade 1",
    "Special Grade 1",
    "Special Grade"
];
// db.prepare("CREATE TABLE IF NOT EXISTS daily_secret_Character (date TEXT PRIMARY KEY, GuessCharacterId INTEGER, GuessVoiceId INTEGER,GuessPictureId INTEGER, Voice STRING, Picture STRING)").run();
const getTodayKey = () => {
    const fecha = new Date().toLocaleDateString("en-CA", { timeZone: "America/Santiago" });
    return fecha;
};
const getDailySecret = () => __awaiter(void 0, void 0, void 0, function* () {
    var _a;
    const today = getTodayKey();
    const client = yield db_1.default.getClient();
    try {
        const res = yield client.query(`SELECT
         date,
         guesscharacterid AS "GuessCharacterId",
         guessvoiceid     AS "GuessVoiceId",
         guesspictureid   AS "GuessPictureId",
         voice            AS "Voice",
         picture          AS "Picture"
       FROM daily_secret_character
       WHERE date = $1`, [today]);
        return (_a = res.rows[0]) !== null && _a !== void 0 ? _a : null;
    }
    finally {
        client.release();
    }
});
exports.getDailySecret = getDailySecret;
const getPreviousRecord = () => __awaiter(void 0, void 0, void 0, function* () {
    var _a;
    const client = yield db_1.default.getClient();
    try {
        const res = yield client.query(`SELECT
         date,
         guesscharacterid AS "GuessCharacterId",
         guessvoiceid     AS "GuessVoiceId",
         guesspictureid   AS "GuessPictureId",
         voice            AS "Voice",
         picture          AS "Picture"
       FROM daily_secret_character
       ORDER BY date DESC
       LIMIT 1 OFFSET 1`);
        const previous = (_a = res.rows[0]) !== null && _a !== void 0 ? _a : null;
        if (!previous)
            return null;
        const pic = (0, personajeServices_1.getPersonajeById)(previous.GuessPictureId);
        const voi = (0, personajeServices_1.getPersonajeById)(previous.GuessVoiceId);
        const cha = (0, personajeServices_1.getPersonajeById)(previous.GuessCharacterId);
        return Object.assign(Object.assign({}, previous), { CharacterName: (cha === null || cha === void 0 ? void 0 : cha.name) || "", PictureCharacterName: (pic === null || pic === void 0 ? void 0 : pic.name) || "", VoiceCharacterName: (voi === null || voi === void 0 ? void 0 : voi.name) || "" });
    }
    finally {
        client.release();
    }
});
exports.getPreviousRecord = getPreviousRecord;
const getAllDailyRecords = () => __awaiter(void 0, void 0, void 0, function* () {
    const client = yield db_1.default.getClient();
    try {
        const res = yield client.query(`SELECT
         date,
         guesscharacterid AS "GuessCharacterId",
         guessvoiceid     AS "GuessVoiceId",
         guesspictureid   AS "GuessPictureId",
         voice            AS "Voice",
         picture          AS "Picture"
       FROM daily_secret_character`);
        return res.rows;
    }
    finally {
        client.release();
    }
});
exports.getAllDailyRecords = getAllDailyRecords;
const saveDailySecret = (guessCharId, guessVoiceId, guessPictureId, voice, picture) => __awaiter(void 0, void 0, void 0, function* () {
    const today = getTodayKey();
    const client = yield db_1.default.getClient();
    try {
        yield client.query("INSERT INTO daily_secret_character (date, GuessCharacterId, GuessVoiceId, GuessPictureId, Voice, Picture) VALUES ($1, $2, $3, $4, $5, $6)", [today, guessCharId, guessVoiceId, guessPictureId, voice, picture]);
    }
    finally {
        client.release();
    }
});
exports.saveDailySecret = saveDailySecret;
const resetDailySecret = () => __awaiter(void 0, void 0, void 0, function* () {
    const today = getTodayKey();
    const client = yield db_1.default.getClient();
    try {
        yield client.query("DELETE FROM daily_secret_character WHERE date = $1", [today]);
        secretCharacter = undefined;
        secretVoiceCharacter = undefined;
        secretLargeCharacter = undefined;
    }
    finally {
        client.release();
    }
});
exports.resetDailySecret = resetDailySecret;
let secretCharacter;
let secretVoiceCharacter;
let secretLargeCharacter;
const iniciarJuego = () => __awaiter(void 0, void 0, void 0, function* () {
    var _a, _b, _c;
    const today = getTodayKey();
    let record = yield (0, exports.getDailySecret)();
    if (!record) {
        const personajes = (0, personajeServices_1.getAllPersonajes)();
        const withVoice = personajes.filter(p => p.voice && p.voice !== "None");
        const withPicture = personajes.filter(p => p.image_url_large);
        if (!personajes.length || !withVoice.length || !withPicture.length) {
            console.error("No hay suficientes datos para iniciar el juego.");
            return null;
        }
        const chosen = personajes[Math.floor(Math.random() * personajes.length)];
        const chosenVoice = withVoice[Math.floor(Math.random() * withVoice.length)];
        const chosenPic = withPicture[Math.floor(Math.random() * withPicture.length)];
        yield (0, exports.saveDailySecret)(chosen.id, chosenVoice.id, chosenPic.id, chosenVoice.voice, chosenPic.image_url_large);
        record = {
            date: today,
            GuessCharacterId: chosen.id,
            GuessVoiceId: chosenVoice.id,
            GuessPictureId: chosenPic.id,
            Voice: chosenVoice.voice,
            Picture: chosenPic.image_url_large,
        };
    }
    // fallback para minúsculas/pascalCase
    const guessCharacterId = (_a = record.GuessCharacterId) !== null && _a !== void 0 ? _a : record.guesscharacterid;
    const guessVoiceId = (_b = record.GuessVoiceId) !== null && _b !== void 0 ? _b : record.guessvoiceid;
    const guessPictureId = (_c = record.GuessPictureId) !== null && _c !== void 0 ? _c : record.guesspictureid;
    secretCharacter = (0, personajeServices_1.getPersonajeById)(guessCharacterId);
    secretVoiceCharacter = (0, personajeServices_1.getPersonajeById)(guessVoiceId);
    secretLargeCharacter = (0, personajeServices_1.getPersonajeById)(guessPictureId);
    if (!secretCharacter || !secretVoiceCharacter || !secretLargeCharacter) {
        console.error("No se pudo hidratar el estado secreto desde el record:", record);
        return null;
    }
    // 🔥 siempre devuelve lo mismo, con o sin record
    return {
        id: secretCharacter.id,
        voiceid: secretVoiceCharacter.id,
        pictureId: secretLargeCharacter.id,
        voice: secretVoiceCharacter.voice, // 🔹 usar la propiedad real
        picture: secretLargeCharacter.image_url_large // 🔹 usar la propiedad real
    };
});
exports.iniciarJuego = iniciarJuego;
const getPersonajeSecreto = () => secretCharacter;
exports.getPersonajeSecreto = getPersonajeSecreto;
const getPistaPersonaje = () => {
    const person = secretCharacter ? ({ id: secretCharacter.id, personality: secretCharacter.personality, appearance: secretCharacter.appearance, image_url: secretCharacter.image_url, abilities: secretCharacter.abilities }) : null;
    return person;
};
exports.getPistaPersonaje = getPistaPersonaje;
const compararConVoice = (intento) => {
    if (!secretVoiceCharacter)
        return null;
    console.log("Comparando intento (voz):", intento, "con personaje secreto (voz):", secretVoiceCharacter);
    const result = {
        name: intento.name === secretVoiceCharacter.name ? true : false,
        voice: intento.voice === secretVoiceCharacter.voice ? true : false
    };
    const strictMatches = __rest(result, []);
    const hasWon = Object.values(strictMatches).every(val => val === true);
    return { result, hasWon };
};
exports.compararConVoice = compararConVoice;
const compararConPicture = (intento) => {
    if (!secretLargeCharacter)
        return null;
    console.log("Comparando intento (picture):", intento, "con personaje secreto (picture):", secretLargeCharacter);
    const hasWon = intento.name === secretLargeCharacter.name;
    const result = { name: hasWon };
    return { result, hasWon };
};
exports.compararConPicture = compararConPicture;
const getGradeIndex = (grade) => {
    if (!grade)
        return -1;
    return gradeOrder.indexOf(grade);
};
const compararConSecreto = (intento) => {
    if (!secretCharacter)
        return null;
    console.log("Comparando intento:", intento, "con personaje secreto:", secretCharacter);
    const tieneDomain = (p) => { var _a; return ((_a = p.abilities) === null || _a === void 0 ? void 0 : _a.has_domain) === true; };
    const tieneRCT = (p) => { var _a; return ((_a = p.abilities) === null || _a === void 0 ? void 0 : _a.has_rct) === true; };
    const result = {
        name: intento.name === secretCharacter.name ? true : false,
        age: intento.age === secretCharacter.age ? true : false,
        ageDifference: (() => {
            if (intento.age == null || (secretCharacter === null || secretCharacter === void 0 ? void 0 : secretCharacter.age) == null)
                return null;
            const intentoAgeNum = Array.isArray(intento.age)
                ? parseInt(intento.age[0], 10)
                : intento.age;
            const secretAgeNum = Array.isArray(secretCharacter.age)
                ? parseInt(secretCharacter.age[0], 10)
                : secretCharacter.age;
            if (isNaN(intentoAgeNum) || isNaN(secretAgeNum))
                return null;
            if (intentoAgeNum === secretAgeNum)
                return "igual";
            return intentoAgeNum < secretAgeNum ? "menor" : "mayor";
        })(),
        gradeDifference: (() => {
            const intentoIndex = getGradeIndex(intento.grade);
            const secretoIndex = getGradeIndex(secretCharacter.grade);
            if (intentoIndex === -1 || secretoIndex === -1)
                return null;
            if (intentoIndex === secretoIndex)
                return "igual";
            if (intentoIndex < secretoIndex)
                return "menor";
            return "mayor";
        })(),
        species: intento.species === secretCharacter.species ? true : false,
        status: intento.status === secretCharacter.status ? true : false,
        grade: intento.grade === secretCharacter.grade ? true : false,
        gender: intento.gender === secretCharacter.gender ? true : false,
        group: intento.group === secretCharacter.group ? true : false,
        domain_expansion: tieneDomain(intento) === tieneDomain(secretCharacter) ? true : false,
        RCT: tieneRCT(intento) === tieneRCT(secretCharacter) ? true : false
    };
    // Determinar si todos los campos coinciden
    const { ageDifference, gradeDifference } = result, strictMatches = __rest(result, ["ageDifference", "gradeDifference"]);
    const hasWon = Object.values(strictMatches).every(val => val === true);
    return { result, hasWon };
};
exports.compararConSecreto = compararConSecreto;
