// import React to that we can use JSX
import React, {useContext, useEffect, useState} from 'react';
// import all the components from Semantic UI React
import {
  Button,
  Container,
  Form,
  Header,
  TextArea
} from 'semantic-ui-react';

import Answer from './components/Answer';
import Buttons from './components/Buttons';
import Stats from './components/Stats';
import { CardContext } from '../../services/CardContext';
import {StatsContext} from '../../services/StatsContext';
import { CardActionTypes, StatsActionType } from '../../types';


const Answering = () => {
  console.log(
    '\n !!!>>  ANSWERING - WELCOME TO THE JUNGLE!!!: \n',
    '\n\n !!!>>> ANSWERING - THIS IS CardContext: \n', CardContext
  )
  // get cards and current index from CardContext
  const {cards, current, dispatch} = useContext(CardContext);
  const {dispatch: statsDispatch} = useContext(StatsContext);

  // get the question from the current card
  let {question} = cards[current];

  const [showAnswer, setShowAnswer] = useState(false);

  console.log(
    '\n !!!>>  THIS IS Answering - showAnswer: \n', showAnswer,
    '\n !!!>>  THIS IS Answering - setShowAnswer: \n', setShowAnswer,
    '\n !!!>>  THIS IS Answering - cards: \n', cards,
    '\n !!!>>  THIS IS Answering - current: \n', current,
    '\n !!!>>  THIS IS Answering - question: \n', question,
  )

  // the value of the textarea where the user types their input 
  const [input, setInput] = useState('');

  // compare if input is correct or not
  const inputResult: StatsActionType = input === cards[current].answer
    ? StatsActionType.right
    : StatsActionType.wrong;


  useEffect(() => {
    // hide the answer
    setShowAnswer(false);

    // clear the TextArea
    setInput('');

    // useEffect triggers when the value of current changes
  }, [current, setShowAnswer, setInput]);

  console.log(
    '\n !!!>>  THIS IS Answering - setInput: \n', setInput,
    '\n !!!>>  THIS IS Answering - current: \n', current,
    '\n !!!>>  THIS IS Answering - input: \n', input,
    '\n !!!>>  THIS IS Answering - inputResult: \n', inputResult,
  )

  // // ORIGINAL
  // return (
  //   <Container data-testid='container' style={{position: 'absolute', left: 200}}>
  //     <Header data-testid='question'><Stats/>{question}</Header>
  //     <Button onClick={() => {
  //       dispatch({type: CardActionTypes.next});
  //       statsDispatch({type: StatsActionType.skip, question});
  //     }}>Next or Skip</Button>
  //     <Form>
  //       <TextArea data-testid='textarea'
  //       value={input}
  //       onChange={(e: any, {value}) => typeof(value) === 'string' && setInput(value)}
  //       />
  //     </Form>
  //     <Buttons answered={showAnswer} isCorrect={(theAnswer === input) ? true : false} submit={() => setShowAnswer(true)}/>
  //     <Answer visible={showAnswer}/>
  //   </Container>
  // )};

  // NEW
  return (
    <Container data-testid='container' style={{position: 'absolute', left: 200}}>
      <Header data-testid='question'><Stats/>{question}</Header>
      <Button onClick={() => {
        dispatch({type: CardActionTypes.next});
        statsDispatch({type: StatsActionType.skip, question});
      }}>Next or Skip</Button>
      <Form>
        <TextArea data-testid='textarea'
        value={input}
        onChange={(e: any, {value}) => typeof(value) === 'string' && setInput(value)}/>
      </Form>
      <Buttons answered={showAnswer} submit={() => setShowAnswer(true)}/>
      <Button content='Submit Answer' 
        onClick={() => {
          statsDispatch({type: inputResult, question})
          dispatch({type: CardActionTypes.next})
        }}/>
      <Answer visible={showAnswer}/>
    </Container>
  )};

  export default Answering;
