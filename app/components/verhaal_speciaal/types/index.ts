export interface BoxState {
  x: number;
  y: number;
  label: string;
  angle: number;
}
export type PageType = "setting" | "character" | "attributes" | "role_select";

export enum ButtonType {
  Primary,
  Secondary,
}

export type ColorType = "green" | "red" | "default";

export interface Character {
  id: number /* 0 = Narrator | 1 = User 1 | 2 = User 2*/;
  name: string;
  attributes: string[];
  readingLevel: string;
}

export interface Story {
  acts: Act[];
  title: string;
  characters: Character[];
}

export interface Act {
  act: number;
  title: string;
  lines: Line[];
  backgroundImage: string;
  question: string;
  answer: string;
}

export interface Line {
  user: number;
  actor: string;
  line: string;
}

export interface StoryPrompt {
  location: string;
  characters: Character[];
}
export interface StoryResponse {
  act: number;
  answer: {
    characterId: number;
    line: string;
  }
  imagePrompt: {
    characterId: number;
    line: string;
  }
  lines: Array<{characterId: number, line: string}>;
  question: {    
    characterId: number;
    line: string;
  }
  title: string;
}
