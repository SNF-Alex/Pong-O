import AsyncStorage from '@react-native-async-storage/async-storage';
import { BALL_SKINS, PADDLE_SKINS, THEME_SKINS } from '../config/skins';

// Storage keys
const KEYS = {
  COINS: '@ponggame:coins',
  UNLOCKED_SKINS: '@ponggame:unlocked_skins',
  UNLOCKED_PADDLES: '@ponggame:unlocked_paddles',
  UNLOCKED_THEMES: '@ponggame:unlocked_themes',
  EQUIPPED_BALL: '@ponggame:equipped_ball',
  EQUIPPED_PADDLE: '@ponggame:equipped_paddle',
  EQUIPPED_THEME: '@ponggame:equipped_theme',
  THEME_VARIANT: '@ponggame:theme_variant',
};

// ============ COINS ============

export const getCoins = async () => {
  try {
    const coins = await AsyncStorage.getItem(KEYS.COINS);
    return coins ? parseInt(coins, 10) : 0;
  } catch (error) {
    console.error('Error loading coins:', error);
    return 0;
  }
};

export const setCoins = async (amount) => {
  try {
    await AsyncStorage.setItem(KEYS.COINS, amount.toString());
    return true;
  } catch (error) {
    console.error('Error saving coins:', error);
    return false;
  }
};

export const addCoins = async (amount) => {
  try {
    const current = await getCoins();
    const newAmount = current + amount;
    await setCoins(newAmount);
    return newAmount;
  } catch (error) {
    console.error('Error adding coins:', error);
    return null;
  }
};

export const subtractCoins = async (amount) => {
  try {
    const current = await getCoins();
    if (current < amount) {
      return null; // Insufficient funds
    }
    const newAmount = current - amount;
    await setCoins(newAmount);
    return newAmount;
  } catch (error) {
    console.error('Error subtracting coins:', error);
    return null;
  }
};

// ============ SKINS ============

export const getUnlockedSkins = async () => {
  try {
    const skins = await AsyncStorage.getItem(KEYS.UNLOCKED_SKINS);
    if (skins) {
      return JSON.parse(skins);
    }
    // Return default unlocked skins (Red ball is default)
    return ['ball_red'];
  } catch (error) {
    console.error('Error loading unlocked skins:', error);
    return ['ball_red'];
  }
};

export const unlockSkin = async (skinId) => {
  try {
    const unlocked = await getUnlockedSkins();
    if (!unlocked.includes(skinId)) {
      unlocked.push(skinId);
      await AsyncStorage.setItem(KEYS.UNLOCKED_SKINS, JSON.stringify(unlocked));
    }
    return true;
  } catch (error) {
    console.error('Error unlocking skin:', error);
    return false;
  }
};

export const isSkinUnlocked = async (skinId) => {
  try {
    const unlocked = await getUnlockedSkins();
    return unlocked.includes(skinId);
  } catch (error) {
    console.error('Error checking skin unlock:', error);
    return false;
  }
};

// ============ EQUIPPED SKINS ============

export const getEquippedBall = async () => {
  try {
    const skinId = await AsyncStorage.getItem(KEYS.EQUIPPED_BALL);
    return skinId || 'ball_red'; // Default to red ball
  } catch (error) {
    console.error('Error loading equipped ball:', error);
    return 'ball_red';
  }
};

export const equipBall = async (skinId) => {
  try {
    // Check if skin is unlocked first
    const isUnlocked = await isSkinUnlocked(skinId);
    if (!isUnlocked) {
      console.warn('Cannot equip locked skin:', skinId);
      return false;
    }
    
    await AsyncStorage.setItem(KEYS.EQUIPPED_BALL, skinId);
    return true;
  } catch (error) {
    console.error('Error equipping ball:', error);
    return false;
  }
};

export const getEquippedBallSkin = async () => {
  try {
    const skinId = await getEquippedBall();
    return BALL_SKINS[skinId] || BALL_SKINS.ball_red;
  } catch (error) {
    console.error('Error loading equipped ball skin:', error);
    return BALL_SKINS.ball_red;
  }
};

// ============ PADDLE SKINS ============

export const getUnlockedPaddleSkins = async () => {
  try {
    const paddles = await AsyncStorage.getItem(KEYS.UNLOCKED_PADDLES);
    if (paddles) {
      return JSON.parse(paddles);
    }
    // Return default unlocked paddle (Red paddle is default)
    return ['paddle_red'];
  } catch (error) {
    console.error('Error loading unlocked paddles:', error);
    return ['paddle_red'];
  }
};

export const unlockPaddleSkin = async (paddleId) => {
  try {
    const unlocked = await getUnlockedPaddleSkins();
    if (!unlocked.includes(paddleId)) {
      unlocked.push(paddleId);
      await AsyncStorage.setItem(KEYS.UNLOCKED_PADDLES, JSON.stringify(unlocked));
    }
    return true;
  } catch (error) {
    console.error('Error unlocking paddle:', error);
    return false;
  }
};

export const isPaddleSkinUnlocked = async (paddleId) => {
  try {
    const unlocked = await getUnlockedPaddleSkins();
    return unlocked.includes(paddleId);
  } catch (error) {
    console.error('Error checking paddle unlock:', error);
    return false;
  }
};

export const getEquippedPaddle = async () => {
  try {
    const paddleId = await AsyncStorage.getItem(KEYS.EQUIPPED_PADDLE);
    return paddleId || 'paddle_red'; // Default to red paddle
  } catch (error) {
    console.error('Error loading equipped paddle:', error);
    return 'paddle_red';
  }
};

export const equipPaddle = async (paddleId) => {
  try {
    // Check if paddle is unlocked first
    const isUnlocked = await isPaddleSkinUnlocked(paddleId);
    if (!isUnlocked) {
      console.warn('Cannot equip locked paddle:', paddleId);
      return false;
    }
    
    await AsyncStorage.setItem(KEYS.EQUIPPED_PADDLE, paddleId);
    return true;
  } catch (error) {
    console.error('Error equipping paddle:', error);
    return false;
  }
};

export const getEquippedPaddleSkin = async () => {
  try {
    const paddleId = await getEquippedPaddle();
    return PADDLE_SKINS[paddleId] || PADDLE_SKINS.paddle_red;
  } catch (error) {
    console.error('Error loading equipped paddle skin:', error);
    return PADDLE_SKINS.paddle_red;
  }
};

// ============ THEME SKINS ============

export const getUnlockedThemes = async () => {
  try {
    const themes = await AsyncStorage.getItem(KEYS.UNLOCKED_THEMES);
    if (themes) {
      return JSON.parse(themes);
    }
    // Return default unlocked theme (Dark Blue is default)
    return ['theme_default'];
  } catch (error) {
    console.error('Error loading unlocked themes:', error);
    return ['theme_default'];
  }
};

export const unlockTheme = async (themeId) => {
  try {
    const unlocked = await getUnlockedThemes();
    if (!unlocked.includes(themeId)) {
      unlocked.push(themeId);
      await AsyncStorage.setItem(KEYS.UNLOCKED_THEMES, JSON.stringify(unlocked));
    }
    return true;
  } catch (error) {
    console.error('Error unlocking theme:', error);
    return false;
  }
};

export const isThemeSkinUnlocked = async (themeId) => {
  try {
    const unlocked = await getUnlockedThemes();
    return unlocked.includes(themeId);
  } catch (error) {
    console.error('Error checking theme unlock:', error);
    return false;
  }
};

export const getEquippedTheme = async () => {
  try {
    const themeId = await AsyncStorage.getItem(KEYS.EQUIPPED_THEME);
    return themeId || 'theme_default'; // Default to dark blue theme
  } catch (error) {
    console.error('Error loading equipped theme:', error);
    return 'theme_default';
  }
};

export const equipTheme = async (themeId) => {
  try {
    // Check if theme is unlocked first
    const isUnlocked = await isThemeSkinUnlocked(themeId);
    if (!isUnlocked) {
      console.warn('Cannot equip locked theme:', themeId);
      return false;
    }
    
    await AsyncStorage.setItem(KEYS.EQUIPPED_THEME, themeId);
    return true;
  } catch (error) {
    console.error('Error equipping theme:', error);
    return false;
  }
};

export const getEquippedThemeSkin = async () => {
  try {
    const themeId = await getEquippedTheme();
    const theme = THEME_SKINS[themeId] || THEME_SKINS.theme_default;
    
    // If theme has variants, apply the selected variant colors
    if (theme.hasVariants) {
      const variant = await getThemeVariant(themeId);
      const variantColors = theme.variants[variant];
      if (variantColors) {
        return {
          ...theme,
          colors: {
            ...theme.colors,
            primary: variantColors.primary,
            secondary: variantColors.secondary,
            accent: variantColors.accent,
            textSecondary: variantColors.primary,
            border: `rgba(${parseInt(variantColors.primary.slice(1, 3), 16)}, ${parseInt(variantColors.primary.slice(3, 5), 16)}, ${parseInt(variantColors.primary.slice(5, 7), 16)}, 0.5)`,
          },
        };
      }
    }
    
    return theme;
  } catch (error) {
    console.error('Error loading equipped theme skin:', error);
    return THEME_SKINS.theme_default;
  }
};

// ============ THEME VARIANTS ============

export const getThemeVariant = async (themeId) => {
  try {
    const variant = await AsyncStorage.getItem(`${KEYS.THEME_VARIANT}:${themeId}`);
    if (variant) {
      return variant;
    }
    // Return default variant if available
    const theme = THEME_SKINS[themeId];
    return theme?.defaultVariant || 'pink';
  } catch (error) {
    console.error('Error loading theme variant:', error);
    return 'pink';
  }
};

export const setThemeVariant = async (themeId, variant) => {
  try {
    await AsyncStorage.setItem(`${KEYS.THEME_VARIANT}:${themeId}`, variant);
    return true;
  } catch (error) {
    console.error('Error saving theme variant:', error);
    return false;
  }
};

// ============ HELPER FUNCTIONS ============

// Get all unlocked skin objects (not just IDs)
export const getUnlockedSkinObjects = async () => {
  try {
    const unlockedIds = await getUnlockedSkins();
    return unlockedIds.map(id => BALL_SKINS[id]).filter(Boolean);
  } catch (error) {
    console.error('Error loading unlocked skin objects:', error);
    return [BALL_SKINS.ball_red];
  }
};

// Clear all data (for testing/reset)
export const clearAllData = async () => {
  try {
    await AsyncStorage.multiRemove([
      KEYS.COINS,
      KEYS.UNLOCKED_SKINS,
      KEYS.UNLOCKED_PADDLES,
      KEYS.UNLOCKED_THEMES,
      KEYS.EQUIPPED_BALL,
      KEYS.EQUIPPED_PADDLE,
      KEYS.EQUIPPED_THEME,
    ]);
    return true;
  } catch (error) {
    console.error('Error clearing data:', error);
    return false;
  }
};

// Initialize default data for first-time users
export const initializeDefaultData = async () => {
  try {
    const coins = await getCoins();
    const unlocked = await getUnlockedSkins();
    const equipped = await getEquippedBall();
    
    // If this is first time (no coins saved), set defaults
    const coinsStr = await AsyncStorage.getItem(KEYS.COINS);
    if (coinsStr === null) {
      await setCoins(0); // Start with 0 coins
      await AsyncStorage.setItem(KEYS.UNLOCKED_SKINS, JSON.stringify(['ball_red']));
      await AsyncStorage.setItem(KEYS.UNLOCKED_PADDLES, JSON.stringify(['paddle_red']));
      await AsyncStorage.setItem(KEYS.UNLOCKED_THEMES, JSON.stringify(['theme_default']));
      await AsyncStorage.setItem(KEYS.EQUIPPED_BALL, 'ball_red');
      await AsyncStorage.setItem(KEYS.EQUIPPED_PADDLE, 'paddle_red');
      await AsyncStorage.setItem(KEYS.EQUIPPED_THEME, 'theme_default');
    }
    
    return true;
  } catch (error) {
    console.error('Error initializing default data:', error);
    return false;
  }
};
