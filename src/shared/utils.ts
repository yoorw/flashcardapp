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
