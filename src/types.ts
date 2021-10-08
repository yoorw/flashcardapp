// defines the flashcard objects that the app stores and displays
export interface Card {
  answer: string,   // answer to the question
  question: string, // question prompt
  subject: string   // subject of the question and answer
}

// the shape of the state that CardContext returns
export interface CardState {
  // the array of Card objects
  cards: Card[],

  // the index of the currently displayed card object
  current: number,

  // the dispatch function that accepts actions
  // actions are handled by the reducer in CardContext
  dispatch: (action: any) => void
}

// the types of action that the reducer in CardContext will handle
export enum CardActionTypes {
  next = 'next',
};

export type CardAction = 
  // moves to the next card
  | { type: CardActionTypes.next }
