interface TriviaQuestion {
  category: string;
  type: string;
  difficulty: string;
  question: string;
  correct_answer: string;
  incorrect_answers: string[];
}

export interface Trivia {
  response_code: number;
  results: TriviaQuestion[];
}
