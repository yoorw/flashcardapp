import React, {createContext, useEffect, useReducer} from "react";
import { getAdditionCard } from "../../shared/utils";
import {Card, CardState} from '../../types';
import {saveCards} from '../Save';
import {getInitialState, getNext} from './services';


// the reducer handles actions 
export const reducer = (state: CardState, action: any) => {
  // switch statement looks at the action type
  // if there is a case that matches the type it will run that code 
  // otherwise it will run the default case
  switch(action.type) {
    // action delete
    case 'delete': {
      let {cards, current} = state;
      // the question is the unique identifier of a card
      const {question} = action;

      // creating a new array of cards by spreading the current array of cards
      const newCards = [...cards];

      // finds the index of the target card
      const index = newCards.findIndex(card => card.question === question);

      // splice removes the target card from the array
      newCards.splice(index, 1);

      // current tells the components what card to display
      // decrement current
      current = current -1;

      // don't pass -1 as current
      if(current < 0) current = 0;

      // spread the old state
      // add the new value of current
      // and return the newCards array as the value of cards
      return {
        ...state,
        current,
        cards: newCards
      };
    }

    // action new
    case 'new': {
      return {
        ...state,
        current: -1
      };
    }

    // action next
    case 'next': {
      // get cards and current index from state
      const {cards, current, show} = state;

      if(cards[current].subject === 'Math') {
        // do math stuff
        const nextMathCard: Card = getAdditionCard();
        cards.push(nextMathCard);
  
        return {
          ...state,
          cards,
          current: current+1
        };
      } else {
        // call to the getNext function
        const next = getNext({
          cards,
          current,
          show
        });

        return {
          ...state,
          current: next
        };
      }
    }

    // action save
    case 'save': {
      const {cards} = state;
      const {answer, question, subject} = action;

      // get the index of the card with this question
      // if there is no existing card with that question
      // index will be -1
      const index = cards.findIndex(card => card.question === question);

      // A card object with the values received in the action
      const card = {
        answer,
        question,
        subject
      } as Card;

      // create a new array of cards
      // filter out 'invalid' cards that don't have a question
      // aka filter for only cards that have a question
      const newCards = cards.filter(v => !!v.question);

      // if the question already exists in the array
      if(index > -1) {
        // assign the card object to the index
        newCards[index] = card;
      } else {
        // if the question does not already exist in the array
        // add the card object to the array
        newCards.push(card);
      }

      // return new context
      return {
        ...state,
        cards: newCards
      };
    }

    // action select
    case 'select': {
      const {cards} = state;
      const {question, subject} = action;

      const currentQuestion = question
        ? question
        : cards.filter((card) => card.subject === subject)[0].question;

      const current = cards.findIndex(card => card.question === currentQuestion);

      if(current < 0) return state;

      return {
        ...state,
        current
      };
    };

    // action showAdd
    case 'showAdd': {
      const {subject} = action;
      const show = [...state.show];

      !show.includes(subject) && show.push(subject);

      // add updated show to state
      Object.assign(state, {show});

      return {
        ...state,
        show
      };
    };

    // action showAll
    case 'showAll': 
      return {
        ...state,
        show: []
      };
    ;

    // action showRemove
    case 'showRemove': {
      const {subject} = action;
      const show = state.show.filter(subj => subj !== subject);

      return {
        ...state,
        show
      };
    };

    // default case returns the previous state without changing it
    default: 
      return state;
  }
}

// the object that we use to make the first Context
export const initialState = getInitialState();

// a context object made from initialState
const CardContext = createContext(initialState);

// the Props that the CardProvider will accept
type CardProviderProps = {
  // you can put react components inside of the Provider component 
  children: React.ReactNode;

  // We might want to pass a state into the CardProvider for testing purposes
  testState?: CardState
};

const CardProvider = ({children, testState}: CardProviderProps) => {
  // useReducer returns an array containing the state at [0]
  // and the dispatch method at [1]
  // use array destructuring to get state and dispatch
  const [state, dispatch] = useReducer(reducer, testState ? testState : initialState); 

  // hook to trigger a function anytime cards changes
  useEffect(() => {
    // save cards to localStorage
    saveCards(state.cards);
  }, [state.cards]);

  // value is an object created by spreading state
  // and adding the dispatch method
  const value = {...state, dispatch};

  return (
    // returns a Provider with the state and dispatch that we created above
    <CardContext.Provider value={value}>
      {children}
    </CardContext.Provider>
  );
}

export {
  // some components will import CardContext so they can access the state using useContext
  CardContext,
  // the App will import the CardProvider so the CardContext will be available to components
  CardProvider
};
