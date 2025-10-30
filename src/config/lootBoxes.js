import { BALL_SKINS, PADDLE_SKINS, THEME_SKINS } from './skins';

// Loot box definitions
export const LOOT_BOXES = {
  basic_ball_box: {
    id: 'basic_ball_box',
    name: 'Basic Ball Box',
    type: 'ball',
    description: 'Contains all 10 ball skins',
    price: 0, // TODO: Change to 1000 after testing
    icon: 'cube-outline',
    
    // All skins available in this box
    skinPool: [
      'ball_red',
      'ball_orange',
      'ball_yellow',
      'ball_brown',
      'ball_green',
      'ball_grey',
      'ball_blue',
      'ball_purple',
      'ball_pink',
      'ball_rainbow',
    ],
    
    // Rarity drop rates (must sum to 100)
    rarityWeights: {
      common: 64,      // Red, Orange, Yellow, Brown
      uncommon: 20,    // Green, Grey
      rare: 10,        // Blue
      epic: 5,         // Purple, Pink (2.5% each)
      legendary: 1,    // Rainbow
    },
  },
  basic_paddle_box: {
    id: 'basic_paddle_box',
    name: 'Basic Paddle Box',
    type: 'paddle',
    description: 'Contains all 10 paddle skins',
    price: 0, // TODO: Change to 1000 after testing
    icon: 'cube-outline',
    
    // All skins available in this box
    skinPool: [
      'paddle_red',
      'paddle_orange',
      'paddle_yellow',
      'paddle_brown',
      'paddle_green',
      'paddle_grey',
      'paddle_blue',
      'paddle_purple',
      'paddle_pink',
      'paddle_rainbow',
    ],
    
    // Rarity drop rates (must sum to 100)
    rarityWeights: {
      common: 64,      // Red, Orange, Yellow, Brown
      uncommon: 20,    // Green, Grey
      rare: 10,        // Blue
      epic: 5,         // Purple, Pink (2.5% each)
      legendary: 1,    // Rainbow
    },
  },
  basic_theme_box: {
    id: 'basic_theme_box',
    name: 'Basic Theme Box',
    type: 'theme',
    description: 'Contains all 10 game themes',
    price: 0, // TODO: Change to 1000 after testing
    icon: 'cube-outline',
    
    // All themes available in this box
    skinPool: [
      'theme_default',
      'theme_dark_grey',
      'theme_light_grey',
      'theme_navy',
      'theme_forest',
      'theme_lavender',
      'theme_sand',
      'theme_ocean',
      'theme_white',
      'theme_neon',
    ],
    
    // Rarity drop rates (must sum to 100)
    rarityWeights: {
      common: 64,      // Default, Dark Grey, Light Grey, Navy
      uncommon: 20,    // Forest, Lavender
      rare: 10,        // Sand, Ocean (5% each)
      epic: 5,         // White
      legendary: 1,    // Neon
    },
  },
};

// Helper function to roll a random skin from a loot box
export const rollLootBox = (boxId) => {
  console.log('rollLootBox called with boxId:', boxId);
  const box = LOOT_BOXES[boxId];
  
  if (!box) {
    console.error('Box not found:', boxId);
    return null;
  }

  // Roll random number 1-100
  const roll = Math.random() * 100;
  console.log('Rolled:', roll);
  
  // Determine rarity tier based on weights
  let rarity;
  let cumulative = 0;
  
  cumulative += box.rarityWeights.legendary;
  if (roll < cumulative) {
    rarity = 'legendary';
  } else {
    cumulative += box.rarityWeights.epic;
    if (roll < cumulative) {
      rarity = 'epic';
    } else {
      cumulative += box.rarityWeights.rare;
      if (roll < cumulative) {
        rarity = 'rare';
      } else {
        cumulative += box.rarityWeights.uncommon;
        if (roll < cumulative) {
          rarity = 'uncommon';
        } else {
          rarity = 'common';
        }
      }
    }
  }
  
  console.log('Determined rarity:', rarity);
  
  // Get the appropriate skin collection based on box type
  const SKIN_COLLECTION = box.type === 'paddle' ? PADDLE_SKINS : box.type === 'theme' ? THEME_SKINS : BALL_SKINS;
  
  // Get all skins of that rarity from the box's pool
  const skinsOfRarity = box.skinPool
    .map(skinId => SKIN_COLLECTION[skinId])
    .filter(skin => skin && skin.rarity === rarity);
  
  console.log('Skins of rarity', rarity, ':', skinsOfRarity.length);
  
  // Randomly pick one skin from that rarity tier
  if (skinsOfRarity.length === 0) {
    console.error('No skins found for rarity:', rarity);
    return null;
  }
  
  const randomSkin = skinsOfRarity[Math.floor(Math.random() * skinsOfRarity.length)];
  console.log('Selected skin:', randomSkin?.name);
  
  return {
    skin: randomSkin,
    rarity: rarity,
  };
};

// Get slot index for Plinko board based on rarity (for animation guidance)
// Slots are arranged: [C][U][C][R][C][E][C][L][C][E][C][R][C][U][C] (15 slots)
export const getSlotIndexForRarity = (rarity) => {
  const slotsByRarity = {
    common: [0, 2, 4, 8, 10, 12, 14], // 7 slots
    uncommon: [1, 13], // 2 slots
    rare: [3, 11], // 2 slots
    epic: [5, 9], // 2 slots
    legendary: [7], // 1 slot (center)
  };
  
  const slots = slotsByRarity[rarity];
  return slots[Math.floor(Math.random() * slots.length)];
};
