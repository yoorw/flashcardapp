// import React to that we can use JSX
import React, {useContext, useEffect, useState} from 'react';
import Answer from './components/Answer';
import Buttons from './components/Buttons';

// import all the components from Semantic UI React
import {
  Button,
  Container,
  Form,
  Header,
  TextArea
} from 'semantic-ui-react';
import { CardContext } from '../../services/CardContext';
import { CardActionTypes } from '../../types';

const Answering = () => {
  // get cards and current index from CardContext
  const {cards, current, dispatch} = useContext(CardContext);

  // get the question from the current card
  const {question} = cards[current];

  const [showAnswer, setShowAnswer] = useState(false);

  // the value of the textarea where the user types their input 
  const [input, setInput] = useState('');

  useEffect(() => {
    // hide the answer
    setShowAnswer(false);

    // clear the TextArea
    setInput('');

    // useEffect triggers when the value of current changes
  }, [current, setShowAnswer, setInput]);

  return (
    <Container data-testid='container' style={{position: 'absolute', left: 200}}>
      <Header data-testid='question' content={question}/>
      <Button onClick={() => dispatch({type: CardActionTypes.next})}>Skip</Button>
      <Form>
        <TextArea data-testid='textarea'
        value={input}
        onChange={(e: any, {value}) => typeof(value) === 'string' && setInput(value)}/>
      </Form>
      <Buttons answered={showAnswer} submit={() => setShowAnswer(true)}/>
      <Answer visible={showAnswer}/>
    </Container>
  )};

  export default Answering;
