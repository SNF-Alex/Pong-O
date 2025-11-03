import React, { useState, useEffect } from 'react';
import MenuScreen from './src/screens/MenuScreen';
import GameScreen from './src/screens/GameScreen';
import ShopScreen from './src/screens/ShopScreen';
import PlinkoScreen from './src/screens/PlinkoScreen';
import RewardRevealScreen from './src/screens/RewardRevealScreen';
import BackpackScreen from './src/screens/BackpackScreen';
import SignInScreen from './src/screens/SignInScreen';
import HelpScreen from './src/screens/HelpScreen';
import { initializeDefaultData } from './src/utils/storage';
import { ThemeProvider } from './src/contexts/ThemeContext';
import { AuthProvider, useAuth } from './src/contexts/AuthContext';

function AppNavigator() {
  const { loading, isSignedIn, hasSeenWarning } = useAuth();
  const [currentScreen, setCurrentScreen] = useState('Loading');
  const [screenParams, setScreenParams] = useState({});

  // Initialize default data on app start
  useEffect(() => {
    initializeDefaultData();
  }, []);

  // Determine initial screen after auth loads
  useEffect(() => {
    if (!loading) {
      if (!isSignedIn && !hasSeenWarning) {
        setCurrentScreen('SignIn');
      } else if (currentScreen === 'Loading' || currentScreen === 'SignIn') {
        setCurrentScreen('Menu');
      }
    }
  }, [loading, isSignedIn, hasSeenWarning]);

  // Auto-navigate to Menu when user signs in
  useEffect(() => {
    if (!loading && isSignedIn && currentScreen === 'SignIn') {
      setCurrentScreen('Menu');
    }
  }, [isSignedIn, loading]);

  const handleNavigate = (screenName, params = {}) => {
    setScreenParams(params);
    setCurrentScreen(screenName);
  };

  const renderScreen = () => {
    if (loading || currentScreen === 'Loading') {
      // Could add a loading screen component here
      return null;
    }

    switch (currentScreen) {
      case 'SignIn':
        return <SignInScreen onNavigate={handleNavigate} />;
      case 'Menu':
        return <MenuScreen onNavigate={handleNavigate} />;
      case 'Game':
        return <GameScreen onNavigate={handleNavigate} params={screenParams} />;
      case 'Shop':
        return <ShopScreen onNavigate={handleNavigate} params={screenParams} />;
      case 'Plinko':
        return <PlinkoScreen onNavigate={handleNavigate} params={screenParams} />;
      case 'RewardReveal':
        return <RewardRevealScreen onNavigate={handleNavigate} params={screenParams} />;
      case 'Backpack':
        return <BackpackScreen onNavigate={handleNavigate} params={screenParams} />;
      case 'Help':
        return <HelpScreen onNavigate={handleNavigate} />;
      default:
        return <MenuScreen onNavigate={handleNavigate} />;
    }
  };

  return (
    <ThemeProvider>
      {renderScreen()}
    </ThemeProvider>
  );
}

export default function App() {
  return (
    <AuthProvider>
      <AppNavigator />
    </AuthProvider>
  );
}
