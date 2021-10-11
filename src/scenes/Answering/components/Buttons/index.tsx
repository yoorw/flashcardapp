import React, {useContext} from 'react';
import {Button} from 'semantic-ui-react';
import { CardContext } from '../../../../services/CardContext';
import { CardActionTypes } from '../../../../types';


const Buttons = ({
  answered,
  submit
}: {
  answered: boolean,
  submit: () => void
}) => {
  const {dispatch} = useContext(CardContext);

  return answered
    ? <Button.Group>
      <Button content='Right' positive
        onClick={() => dispatch({type: CardActionTypes.next})}
      />
      <Button.Or/>
      <Button content='Wrong' negative
        onClick={() => dispatch({type: CardActionTypes.next})}
      />
      </Button.Group>
    : <Button content='Submit' onClick={() => submit()}/>
};

export default Buttons;
