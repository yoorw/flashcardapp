import React, {Fragment, useContext} from 'react';
import {Icon, Menu} from 'semantic-ui-react';
import {CardContext} from '../../../../services/CardContext';
import { CardActionTypes } from '../../../../types';


const Subject = ({
  subject
}: {
  subject: string
}) => {
  const {cards, current, dispatch} = useContext(CardContext);

  const currentCard = cards[current];

  // true if the subject is in the array show
  // const expanded = show.includes(subject);  // ORIGINAL
  const expanded = false; // do not expand subject cards

  // use filter to pull only the cards that have this subject 
  const subjectCards = cards
    .filter((card) => card.subject === subject)
    // .sort will put the cards in alphabetical order by question
    .sort((a, b) => a.question.toLowerCase().localeCompare(b.question.toLowerCase()));

  // cardsChild will return an array of <Menu.Item/> components
  const cardsChild = subjectCards.map((card) => {
    const {question} = card;
    return <Menu.Item
      active={!!currentCard && question === currentCard.question}
      as='a'
      content={question}
      key={question}
      onClick={() => dispatch({type: CardActionTypes.select, question})}
      />
  });

  return (
    <Fragment>
      <Menu.Item as='a'
        active={!!currentCard && currentCard.subject === subject}
        onClick={() => dispatch({type: CardActionTypes.select, subject})}>
        <Icon name='list'/>
        {subject}
      </Menu.Item>
      {expanded && cardsChild}
    </Fragment>
  );
};

export default Subject;
