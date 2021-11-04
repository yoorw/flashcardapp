import React, {useState} from 'react';
import './App.css';
import Answering from './scenes/Answering';
import {CardProvider} from './services/CardContext';
import {StatsProvider} from './services/StatsContext';
import Writing from './scenes/Writing';
import NavBar from './components/NavBar';
import Selector from './components/Selector';
import { SceneTypes } from './types';


const App: React.FC = () => {
  const [showScene, setShowScene] = useState(SceneTypes.answering);

  return (
    <CardProvider>
    <StatsProvider>
      <NavBar setShowScene={setShowScene} showScene={showScene} />
      <Selector/>
      {showScene === SceneTypes.answering && <Answering />}
      {showScene === SceneTypes.writing && <Writing />}
    </StatsProvider>
  </CardProvider>
  );
};

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
