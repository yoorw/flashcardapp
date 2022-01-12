import { Card } from "../types";

// upper limit for math questions
const mathLimit = 10;

export const getRandomNumber = (): number => {
  return Math.floor(Math.random() * mathLimit);
};

export const getAdditionCard = (): Card => {
  const num1: number = getRandomNumber();
  const num2: number = getRandomNumber();
  const question = `${num1} + ${num2} = ?`;
  const answer = (num1 + num2).toString();
  return {
    answer,
    question,
    subject: 'Math'
  };
};

export const isCardFirstInSubject = (cards: Card[], current: number, show: string[]): boolean => {
  let backDisabled: boolean = false;

  // if subject isn't selected and current isn't the first card
  if(show.length === 0) {
    return current === 0 ? true : false;
  } else {
    // else subject is selected 
    const currentQuestion = cards[current].question;
    const currentSubject = cards[current].subject;

    const subjectCards: Card[] = cards.filter((card) => card.subject === currentSubject);

    // first card in selected subject equals current card
    backDisabled = subjectCards[0].question === currentQuestion ? true : false;
    return backDisabled;
  }
};
