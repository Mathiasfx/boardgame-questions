import { Question } from "./iquestion.model";

export interface GameConfig {
    title: string;
    slug: string;
    colorPrimary: string;
    colorSecondary: string;
    background?: string;
    questions: Question[];
  }