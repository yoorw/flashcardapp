// import React to that we can use JSX
import React, {useContext, useState} from 'react';
import Answer from './components/Answer';

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

  return (
    <Container data-testid='container' style={{position: 'absolute', left: 200}}>
      <Header data-testid='question' content={question}/>
      <Button onClick={() => dispatch({type: CardActionTypes.next})}>Skip</Button>
      <Form>
        <TextArea data-testid='textarea'/>
      </Form>
      <Button onClick={() => setShowAnswer(true)}>Submit</Button>
      <Answer visible={showAnswer}/>
    </Container>
  )};

  export default Answering;
