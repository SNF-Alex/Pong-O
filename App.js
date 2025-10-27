import React, { useState } from 'react';
import MenuScreen from './src/screens/MenuScreen';
import GameScreen from './src/screens/GameScreen';

export default function App() {
  const [currentScreen, setCurrentScreen] = useState('Menu');
  const [difficulty, setDifficulty] = useState(null);

  const navigation = {
    navigate: (screenName, params) => {
      if (screenName === 'Game') {
        setDifficulty(params.difficulty);
        setCurrentScreen('Game');
      } else if (screenName === 'Menu') {
        setCurrentScreen('Menu');
      }
    },
    goBack: () => {
      setCurrentScreen('Menu');
    },
  };

  const route = {
    params: { difficulty }
  };

  if (currentScreen === 'Menu') {
    return <MenuScreen navigation={navigation} />;
  } else if (currentScreen === 'Game') {
    return <GameScreen route={route} navigation={navigation} />;
  }

  return null;
}
