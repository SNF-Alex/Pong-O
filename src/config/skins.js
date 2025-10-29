// Ball skin definitions
// Rarity distribution: Common (64%), Uncommon (20%), Rare (10%), Epic (5%), Legendary (1%)

export const BALL_SKINS = {
  // COMMON SKINS (64% total - 16% each)
  ball_red: {
    id: 'ball_red',
    name: 'Red Ball',
    type: 'ball',
    color: '#EF4444',
    rarity: 'common',
    animated: false,
    unlocked: true, // Default starter skin
  },
  ball_orange: {
    id: 'ball_orange',
    name: 'Orange Ball',
    type: 'ball',
    color: '#F97316',
    rarity: 'common',
    animated: false,
    unlocked: false,
  },
  ball_yellow: {
    id: 'ball_yellow',
    name: 'Yellow Ball',
    type: 'ball',
    color: '#EAB308',
    rarity: 'common',
    animated: false,
    unlocked: false,
  },
  ball_brown: {
    id: 'ball_brown',
    name: 'Brown Ball',
    type: 'ball',
    color: '#92400E',
    rarity: 'common',
    animated: false,
    unlocked: false,
  },

  // UNCOMMON SKINS (20% total - 10% each)
  ball_green: {
    id: 'ball_green',
    name: 'Green Ball',
    type: 'ball',
    color: '#10B981',
    rarity: 'uncommon',
    animated: false,
    unlocked: false,
  },
  ball_grey: {
    id: 'ball_grey',
    name: 'Grey Ball',
    type: 'ball',
    color: '#6B7280',
    rarity: 'uncommon',
    animated: false,
    unlocked: false,
  },

  // RARE SKIN (10%)
  ball_blue: {
    id: 'ball_blue',
    name: 'Blue Ball',
    type: 'ball',
    color: '#3B82F6',
    rarity: 'rare',
    animated: false,
    unlocked: false,
  },

  // EPIC SKIN (5%)
  ball_purple: {
    id: 'ball_purple',
    name: 'Purple Ball',
    type: 'ball',
    color: '#A855F7',
    rarity: 'epic',
    animated: false,
    unlocked: false,
  },

  // LEGENDARY SKIN (1%)
  ball_rainbow: {
    id: 'ball_rainbow',
    name: 'Rainbow Ball',
    type: 'ball',
    colors: ['#EF4444', '#F97316', '#EAB308', '#10B981', '#3B82F6', '#6366F1', '#A855F7'], // RGB spectrum
    rarity: 'legendary',
    animated: true,
    animationType: 'rainbow-cycle',
    animationSpeed: 300, // ms between color changes (slowed down from 100)
    unlocked: false,
  },
};

// Helper to get skins by rarity
export const getSkinsByRarity = (rarity) => {
  return Object.values(BALL_SKINS).filter(skin => skin.rarity === rarity);
};

// Helper to get all skins as array
export const getAllSkins = () => {
  return Object.values(BALL_SKINS);
};

// Rarity metadata
export const RARITY_INFO = {
  common: {
    label: 'Common',
    color: '#9CA3AF',
    glowColor: 'rgba(156, 163, 175, 0.3)',
    dropRate: 64,
  },
  uncommon: {
    label: 'Uncommon',
    color: '#10B981',
    glowColor: 'rgba(16, 185, 129, 0.3)',
    dropRate: 20,
  },
  rare: {
    label: 'Rare',
    color: '#3B82F6',
    glowColor: 'rgba(59, 130, 246, 0.3)',
    dropRate: 10,
  },
  epic: {
    label: 'Epic',
    color: '#A855F7',
    glowColor: 'rgba(168, 85, 247, 0.3)',
    dropRate: 5,
  },
  legendary: {
    label: 'Legendary',
    color: '#F59E0B',
    glowColor: 'rgba(245, 158, 11, 0.5)',
    dropRate: 1,
  },
};
