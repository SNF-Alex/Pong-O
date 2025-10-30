import React, { createContext, useState, useEffect, useContext } from 'react';
import { getEquippedThemeSkin } from '../utils/storage';
import { COLORS } from '../constants/gameConfig';

const ThemeContext = createContext();

export const ThemeProvider = ({ children }) => {
  const [theme, setTheme] = useState(null);
  const [loading, setLoading] = useState(true);

  // Load equipped theme on mount
  useEffect(() => {
    loadTheme();
  }, []);

  const loadTheme = async () => {
    try {
      const equippedTheme = await getEquippedThemeSkin();
      setTheme(equippedTheme);
    } catch (error) {
      console.error('Error loading theme:', error);
    } finally {
      setLoading(false);
    }
  };

  // Refresh theme (call this after equipping a new theme)
  const refreshTheme = async () => {
    await loadTheme();
  };

  // Get colors from theme, fallback to default COLORS
  const colors = theme?.colors || COLORS;

  return (
    <ThemeContext.Provider value={{ theme, colors, loading, refreshTheme }}>
      {children}
    </ThemeContext.Provider>
  );
};

export const useTheme = () => {
  const context = useContext(ThemeContext);
  if (!context) {
    throw new Error('useTheme must be used within a ThemeProvider');
  }
  return context;
};
