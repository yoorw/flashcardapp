import { getAdditionCard } from '../../../shared/utils';
import { Card, CardAction, CardState } from '../../../types';


// card objects
const card1: Card = {
  question: 'What is a linked list?',
  subject: 'Linked List',
  answer: `A linked list is a sequential list of nodes. 
  The nodes hold data.
  The nodes hold pointers that point ot other nodes containing data.`
};
const card2: Card = {
  question: 'What is a stack?',
  subject: 'Stack',
  answer: `A stack is a one ended linear data structure.
  The stack models real world situations by having two primary operations: push and pop.
  Push adds an element to the stack.
  Pop pulls the top element off the stack.`
};
const card3: Card = getAdditionCard();

export const cards = [card1, card2, card3];

// a function that loads the cards from localStorage
// and returns a CardState object
export const getInitialState = () => {

  return ({

    // the cards that are displayed to the user
    // if loadedCards is undefined, use cards
    // cards: loadedCards ? shuffle(loadedCards) : cards,       // ORIGINAL
    cards: cards,
  
    // index of the currently displayed card
    current: 0,
  
    // placeholder for the dispatch function
    dispatch: (action: CardAction) => undefined,
  
    // the array of subjects to show the user
    show: []
  } as CardState);
};

export const getNext = ({
  cards,
  current,
  show
}: {
  cards: Card[],
  current: number,
  show: string[]
}) => {
  // show array is empty, so we are showing all card
  if(show.length === 0) {
    const total = cards.length - 1;
    // just add 1, if +1 is too big return 0
    const next = current + 1 <= total
      ? current + 1
      : 0;

    return next;
  } else {
    // filter cards. Only keep cards with a subject that's in show
    const showCards = cards.filter((card) => show.includes(card.subject));

    // get the index of the current card in the showCards array
    const showCurrent = showCards.findIndex((card) => card.question === cards[current].question);

    const showTotal = showCards.length - 1;

    // showNext gives us the next index in the showCards array
    const showNext = showCurrent + 1 <= showTotal
      ? showCurrent + 1
      : 0;

    // translate the showNext index to the index of the same card in cards
    const next = cards.findIndex((card) => card.question === showCards[showNext].question);

    return next;
  }
};

export const getPrevious = ({
  cards,
  current,
  show
}: {
  cards: Card[],
  current: number,
  show: string[]
}) => {
  // show array is empty, so we are showing all cards
  if(show.length === 0) {
    // decrease current by 1, unless decrementing results in negative
    const previous = current - 1 >= 0
      ? current - 1
      : 0;

    return previous;
  } else {
    // filter cards. only keep cards with a subject that's in show
    const showCards = cards.filter((card) => show.includes(card.subject));

    // get the index of the current card in the showCards array
    const showCurrent = showCards.findIndex((card) => card.question === cards[current].question);

    // get previous index in showCards array
    const showPrevious = showCurrent - 1 >= 0
      ? showCurrent - 1
      : 0;

    // translate the showPrevious index to the index of the same card in cards
    const previous = cards.findIndex((card) => card.question === showCards[showPrevious].question);

    return previous;
  }
};
