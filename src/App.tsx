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

export default App;
