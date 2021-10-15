import React from 'react';
import './App.css';
import Answering from './scenes/Answering';
import {CardProvider} from './services/CardContext';
import {StatsProvider} from './services/StatsContext';

const App: React.FC = () =>
  <CardProvider>
    <StatsProvider>
      <Answering/>
    </StatsProvider>
  </CardProvider>;

// function App() {
//   const [cards, setCards] = useState(SAMPLE_CARDS);

//   return (
//     // <FlashcardList flashcards={cards} />
//     <h1>Hello World! </h1>
//   );
// }

// const SAMPLE_CARDS = [
//   {
//     id: 1,
//     question: 'What is Question 1?',
//     answer: '4',
//     options: ['blah', 'blah', 'blah', '4']
//   },
//   {
//     id: 2,
//     question: 'What is Question 2?',
//     answer: 'foo',
//     options: ['blah', 'foo', 'blah', '4']
//   },
//   {
//     id: 1,
//     question: 'What is Question 3?',
//     answer: 'bar',
//     options: ['bar', 'blah', 'blah', '4']
//   }
// ];

export default App;
