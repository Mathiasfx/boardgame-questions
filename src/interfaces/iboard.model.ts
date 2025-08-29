// Interfaces para las preguntas según el tipo de juego
export interface BoardGameQuestion {
  question: string;
  answer: string;
}

export interface TriviaQuestion {
  question: string;
  options: string[];
  correctOptionIndex: number;
}

export interface Board {
  userId: string;
  title: string;
  colorPrimary: string;
  colorSecondary: string;
  background: string;
  backgroundColor?: string;
  gameType?: 'boardgame' | 'trivia';
  questions?: BoardGameQuestion[];
  triviaQuestions?: TriviaQuestion[];
  diceFaces?: string[];
}