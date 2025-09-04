import personajeData from './personajes.json';
import { Personaje } from '../types/types';

const personajes: Personaje[] = (personajeData as unknown as { data: Personaje[] }).data;
export const getAllPersonajes = () => personajes
export const getLimitedInfoPersonajes = () => personajes.map(({ id, name, age, species, status, grade, image_url }) => ({ id, age, name, species,status,grade, image_url }));
export const getPersonajeById = (id: number) => personajes.find((personaje) => personaje.id === id);
export const getPersonajesVoice = () => {

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
export const getPersonajeVoiceById = (id: number) => {
  const personaje = personajes.find(
    (p) => p.id === id && p.voice && p.voice !== "None"
  );
  return personaje || null;
};
export const getPersonajePictureById = (id: number) => {
  const personaje = personajes.find(
    (p) => p.id === id && p.image_url_large
  );
  return personaje || null;
};
