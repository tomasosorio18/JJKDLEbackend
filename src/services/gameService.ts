
import { get } from "http";
import db from "../db/db";
import { Personaje } from "../types/types";
import { getAllPersonajes, getPersonajeById } from "./personajeServices";
type DailyRecord = {
  date: string;
  GuessCharacterId: number;
  GuessVoiceId: number;
  GuessPictureId: number;
  Voice: string;
  Picture: string;
};
type ExtendedDailyRecord = DailyRecord & { CharacterName: string, PictureCharacterName: string, VoiceCharacterName: string };
type GradeOrder = "None" | "Grade 4" | "Grade 3" | "Semi-Grade 2" | "Grade 2" | "Semi-Grade 1" | "Grade 1" | "Special Grade 1" | "Special Grade";
const gradeOrder: GradeOrder[] = [
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

const getTodayKey = () =>
  {
  const fecha = new Date().toLocaleDateString("en-CA", { timeZone: "America/Santiago" });
  return fecha;
  }
export const getDailySecret = async (): Promise<DailyRecord | null> => {
  const today = getTodayKey();
  const client = await db.getClient();
  try {
    const res = await client.query(
      `SELECT
         date,
         guesscharacterid AS "GuessCharacterId",
         guessvoiceid     AS "GuessVoiceId",
         guesspictureid   AS "GuessPictureId",
         voice            AS "Voice",
         picture          AS "Picture"
       FROM daily_secret_character
       WHERE date = $1`,
      [today]
    );
    return (res.rows[0] as DailyRecord) ?? null;
  } finally {
    client.release();
  }
};

export const getPreviousRecord = async (): Promise<ExtendedDailyRecord | null> => {
  const client = await db.getClient();
  try {
    const res = await client.query(
      `SELECT
         date,
         guesscharacterid AS "GuessCharacterId",
         guessvoiceid     AS "GuessVoiceId",
         guesspictureid   AS "GuessPictureId",
         voice            AS "Voice",
         picture          AS "Picture"
       FROM daily_secret_character
       ORDER BY date DESC
       LIMIT 1 OFFSET 1`
    );
    const previous = (res.rows[0] as DailyRecord) ?? null;
    if (!previous) return null;

    const pic = getPersonajeById(previous.GuessPictureId);
    const voi = getPersonajeById(previous.GuessVoiceId);
    const cha = getPersonajeById(previous.GuessCharacterId);

    return {
      ...previous,
      CharacterName: cha?.name || "",
      PictureCharacterName: pic?.name || "",
      VoiceCharacterName: voi?.name || "",
    };
  } finally {
    client.release();
  }
};

export const getAllDailyRecords = async (): Promise<DailyRecord[]> => {
  const client = await db.getClient();
  try {
    const res = await client.query(
      `SELECT
         date,
         guesscharacterid AS "GuessCharacterId",
         guessvoiceid     AS "GuessVoiceId",
         guesspictureid   AS "GuessPictureId",
         voice            AS "Voice",
         picture          AS "Picture"
       FROM daily_secret_character`
    );
    return res.rows as DailyRecord[];
  } finally {
    client.release();
  }
};
export const saveDailySecret = async (guessCharId: number, guessVoiceId: number, guessPictureId:number, voice: string, picture: string) => {
  const today = getTodayKey();
  const client = await db.getClient();
  try {
    await client.query("INSERT INTO daily_secret_character (date, GuessCharacterId, GuessVoiceId, GuessPictureId, Voice, Picture) VALUES ($1, $2, $3, $4, $5, $6)", [today, guessCharId, guessVoiceId, guessPictureId, voice, picture]);
  } finally {
    client.release();
  }
}
export const resetDailySecret = async () => {
  const today = getTodayKey();
  const client = await db.getClient();
  try {
    await client.query("DELETE FROM daily_secret_character WHERE date = $1", [today]);
      secretCharacter = undefined;
  secretVoiceCharacter = undefined;
  secretLargeCharacter = undefined;
  } finally {
    client.release();
  }
};
let secretCharacter: Personaje | undefined;
let secretVoiceCharacter: Personaje | undefined;
let secretLargeCharacter : Personaje | undefined;


export const iniciarJuego = async (): Promise<{
  id: number; voiceid: number; pictureId: number; voice: string; picture: string;
} | null> => {
  const today = getTodayKey();
  let record = await getDailySecret();

  if (!record) {
    const personajes = getAllPersonajes();
    const withVoice = personajes.filter(p => p.voice && p.voice !== "None");
    const withPicture = personajes.filter(p => p.image_url_large);

    if (!personajes.length || !withVoice.length || !withPicture.length) {
      console.error("No hay suficientes datos para iniciar el juego.");
      return null;
    }

    const chosen       = personajes[Math.floor(Math.random() * personajes.length)];
    const chosenVoice  = withVoice[Math.floor(Math.random() * withVoice.length)];
    const chosenPic    = withPicture[Math.floor(Math.random() * withPicture.length)];

    await saveDailySecret(
      chosen.id, chosenVoice.id, chosenPic.id, chosenVoice.voice, chosenPic.image_url_large
    );

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
  const guessCharacterId = (record as any).GuessCharacterId ?? (record as any).guesscharacterid;
  const guessVoiceId     = (record as any).GuessVoiceId ?? (record as any).guessvoiceid;
  const guessPictureId   = (record as any).GuessPictureId ?? (record as any).guesspictureid;

  secretCharacter      = getPersonajeById(guessCharacterId);
  secretVoiceCharacter = getPersonajeById(guessVoiceId);
  secretLargeCharacter = getPersonajeById(guessPictureId);

  if (!secretCharacter || !secretVoiceCharacter || !secretLargeCharacter) {
    console.error("No se pudo hidratar el estado secreto desde el record:", record);
    return null;
  }

  // 🔥 siempre devuelve lo mismo, con o sin record
  return {
  id: secretCharacter.id,
  voiceid: secretVoiceCharacter.id,
  pictureId: secretLargeCharacter.id,
  voice: secretVoiceCharacter.voice,      // 🔹 usar la propiedad real
  picture: secretLargeCharacter.image_url_large // 🔹 usar la propiedad real
};
};

export const getPersonajeSecreto = () => secretCharacter;
export const getPistaPersonaje= () => {
  const person = secretCharacter ? ({id: secretCharacter.id, personality: secretCharacter.personality, appearance: secretCharacter.appearance, image_url: secretCharacter.image_url, abilities: secretCharacter.abilities}) : null;
  return person;
}
export const compararConVoice = (intento: Personaje) => {
  if (!secretVoiceCharacter) return null;
  console.log("Comparando intento (voz):", intento, "con personaje secreto (voz):", secretVoiceCharacter);
  const result = {
    name: intento.name === secretVoiceCharacter.name ? true : false,
    voice: intento.voice === secretVoiceCharacter.voice ? true : false
  };
  const { ...strictMatches } = result;
  const hasWon = Object.values(strictMatches).every(val => val === true);
  return { result, hasWon };

};
export const compararConPicture = (intento: Personaje) => {
  if (!secretLargeCharacter) return null;
  console.log("Comparando intento (picture):", intento, "con personaje secreto (picture):", secretLargeCharacter);
  const hasWon = intento.name === secretLargeCharacter.name;
  const result = { name: hasWon };
  return { result, hasWon };

};
const getGradeIndex = (grade?: GradeOrder) => {
        if (!grade) return -1
        return gradeOrder.indexOf(grade as GradeOrder);
      }
export const compararConSecreto = (intento: Personaje) => {
  if (!secretCharacter) return null;
    console.log("Comparando intento:", intento, "con personaje secreto:", secretCharacter);
      const tieneDomain = (p: Personaje) => p.abilities?.has_domain === true;
      const tieneRCT = (p: Personaje) => p.abilities?.has_rct === true;

  const result = {
    name: intento.name === secretCharacter.name ? true : false,
    age: intento.age === secretCharacter.age ? true : false,
    ageDifference: (() => {
  if (intento.age == null || secretCharacter?.age == null) return null;

  const intentoAgeNum = Array.isArray(intento.age)
    ? parseInt(intento.age[0], 10)
    : intento.age;

  const secretAgeNum = Array.isArray(secretCharacter.age)
    ? parseInt(secretCharacter.age[0], 10)
    : secretCharacter.age;

  if (isNaN(intentoAgeNum) || isNaN(secretAgeNum)) return null;

  if (intentoAgeNum === secretAgeNum) return "igual";
  return intentoAgeNum < secretAgeNum ? "menor" : "mayor";
})(),
    gradeDifference: (() =>{
      const intentoIndex = getGradeIndex(intento.grade as GradeOrder);
      const secretoIndex = getGradeIndex(secretCharacter.grade as GradeOrder);
      if (intentoIndex === -1 || secretoIndex === -1) return null;
      if (intentoIndex === secretoIndex) return "igual";
      if (intentoIndex < secretoIndex) return "menor";
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
  const { ageDifference, gradeDifference, ...strictMatches } = result;

const hasWon = Object.values(strictMatches).every(val => val === true);
  return { result, hasWon };
};