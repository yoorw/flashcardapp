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

  // The Stats for a single question
  export interface Stats {
    // number of times user has gotten it right
    right: number,

    // number of times user has gotten it wrong
    wrong: number,

    // number of times user has seen thew question but skipped it
    // instead of answering it
    skip: number
  };

  // interface with a string index signature
  // each string is expected to return an object that fits the Stats interface
  // the string that we will use for a signature is the question from a Card object
  export interface StatsType {
    [key: string]: Stats
  };

  // The StatsDispatch function 
  interface StatsDisaptch {
    dispatch: (action: StatsAction) => void
  };

  // union type. The stats state will have a Stats object for any given key
  // except dispatch will return the StatsDispatch function
  export type StatsState = StatsType & StatsDisaptch;

  // an enum listing the three types of StatsAction
  // A User can get a question right, wrong, or skip it
  export enum StatsActionType {
    right = 'right',
    skip = 'skip',
    wrong = 'wrong'
  };

  // Stats Action - takes a question from a card
  export type StatsAction = {
    type: StatsActionType,
    question: string
  };
