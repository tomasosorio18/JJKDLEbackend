export interface Personaje {
  id: number;
  name: string;
  species: string;
  birthday: string | null;  // acepta null
  gender: string;
  age: string[];            // es un array de strings según el JSON
  status: string;
  grade: string;
  appearance: string;
  personality: string;
  abilities: Abilities;
  group: string;
  image_url: string;
  profile_url: string;
  image_url_large: string;
  voice: string;
}

export interface Abilities {
  special_trait: string;
  innate_technique: string;
  description: string;
  has_domain: boolean;
  has_rct: boolean;
  domain_expansion: string; 
}