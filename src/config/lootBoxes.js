import { BALL_SKINS } from './skins';

// Loot box definitions
export const LOOT_BOXES = {
  basic_box: {
    id: 'basic_box',
    name: 'Basic Box',
    description: 'Contains all 9 ball skins',
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
      'ball_rainbow',
    ],
    
    // Rarity drop rates (must sum to 100)
    rarityWeights: {
      common: 64,      // Red, Orange, Yellow, Brown
      uncommon: 20,    // Green, Grey
      rare: 10,        // Blue
      epic: 5,         // Purple
      legendary: 1,    // Rainbow
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
  
  // Get all skins of that rarity from the box's pool
  const skinsOfRarity = box.skinPool
    .map(skinId => BALL_SKINS[skinId])
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
