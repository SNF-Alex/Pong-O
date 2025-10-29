import React, { useState, useEffect } from 'react';
import MenuScreen from './src/screens/MenuScreen';
import GameScreen from './src/screens/GameScreen';
import ShopScreen from './src/screens/ShopScreen';
import PlinkoScreen from './src/screens/PlinkoScreen';
import RewardRevealScreen from './src/screens/RewardRevealScreen';
import BackpackScreen from './src/screens/BackpackScreen';
import { initializeDefaultData } from './src/utils/storage';

export default function App() {
  const [currentScreen, setCurrentScreen] = useState('Menu');
  const [screenParams, setScreenParams] = useState({});

  // Initialize default data on app start
  useEffect(() => {
    initializeDefaultData();
  }, []);

  const navigation = {
    navigate: (screenName, params = {}) => {
      setScreenParams(params);
      setCurrentScreen(screenName);
    },
    replace: (screenName, params = {}) => {
      setScreenParams(params);
      setCurrentScreen(screenName);
    },
    goBack: () => {
      setCurrentScreen('Menu');
      setScreenParams({});
    },
  };

  const route = {
    params: screenParams
  };

  // Render current screen
  if (currentScreen === 'Menu') {
    return <MenuScreen navigation={navigation} />;
  } else if (currentScreen === 'Game') {
    return <GameScreen route={route} navigation={navigation} />;
  } else if (currentScreen === 'Shop') {
    return <ShopScreen navigation={navigation} />;
  } else if (currentScreen === 'Plinko') {
    return <PlinkoScreen route={route} navigation={navigation} />;
  } else if (currentScreen === 'RewardReveal') {
    return <RewardRevealScreen route={route} navigation={navigation} />;
  } else if (currentScreen === 'Backpack') {
    return <BackpackScreen navigation={navigation} />;
  } else if (currentScreen === 'Help') {
    // TODO: Create Help screen
    return <MenuScreen navigation={navigation} />;
  }

  return null;
}
