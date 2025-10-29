import AsyncStorage from '@react-native-async-storage/async-storage';
import { BALL_SKINS } from '../config/skins';

// Storage keys
const KEYS = {
  COINS: '@ponggame:coins',
  UNLOCKED_SKINS: '@ponggame:unlocked_skins',
  EQUIPPED_BALL: '@ponggame:equipped_ball',
  EQUIPPED_PADDLE: '@ponggame:equipped_paddle',
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
      KEYS.EQUIPPED_BALL,
      KEYS.EQUIPPED_PADDLE,
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
      await AsyncStorage.setItem(KEYS.EQUIPPED_BALL, 'ball_red');
    }
    
    return true;
  } catch (error) {
    console.error('Error initializing default data:', error);
    return false;
  }
};
