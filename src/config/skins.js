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

  // EPIC SKINS (5% total - 2.5% each)
  ball_purple: {
    id: 'ball_purple',
    name: 'Purple Ball',
    type: 'ball',
    color: '#A855F7',
    rarity: 'epic',
    animated: false,
    unlocked: false,
  },
  ball_pink: {
    id: 'ball_pink',
    name: 'Pink Ball',
    type: 'ball',
    color: '#EC4899',
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

  // SECRET DEVELOPER SKIN (Not in loot boxes)
  ball_dev_x: {
    id: 'ball_dev_x',
    name: 'X Marks the Dev',
    type: 'ball',
    color: '#374151', // Dark grey
    accentColor: '#10B981', // Neon green for X
    rarity: 'secret',
    animated: false,
    unlocked: false,
    secret: true,
  },
};

// Paddle skin definitions
// Rarity distribution: Common (64%), Uncommon (20%), Rare (10%), Epic (5%), Legendary (1%)

export const PADDLE_SKINS = {
  // COMMON SKINS (64% total - 16% each)
  paddle_red: {
    id: 'paddle_red',
    name: 'Red Paddle',
    type: 'paddle',
    color: '#EF4444',
    rarity: 'common',
    animated: false,
    unlocked: true, // Default starter skin
  },
  paddle_orange: {
    id: 'paddle_orange',
    name: 'Orange Paddle',
    type: 'paddle',
    color: '#F97316',
    rarity: 'common',
    animated: false,
    unlocked: false,
  },
  paddle_yellow: {
    id: 'paddle_yellow',
    name: 'Yellow Paddle',
    type: 'paddle',
    color: '#EAB308',
    rarity: 'common',
    animated: false,
    unlocked: false,
  },
  paddle_brown: {
    id: 'paddle_brown',
    name: 'Brown Paddle',
    type: 'paddle',
    color: '#92400E',
    rarity: 'common',
    animated: false,
    unlocked: false,
  },

  // UNCOMMON SKINS (20% total - 10% each)
  paddle_green: {
    id: 'paddle_green',
    name: 'Green Paddle',
    type: 'paddle',
    color: '#10B981',
    rarity: 'uncommon',
    animated: false,
    unlocked: false,
  },
  paddle_grey: {
    id: 'paddle_grey',
    name: 'Grey Paddle',
    type: 'paddle',
    color: '#6B7280',
    rarity: 'uncommon',
    animated: false,
    unlocked: false,
  },

  // RARE SKIN (10%)
  paddle_blue: {
    id: 'paddle_blue',
    name: 'Blue Paddle',
    type: 'paddle',
    color: '#3B82F6',
    rarity: 'rare',
    animated: false,
    unlocked: false,
  },

  // EPIC SKINS (5% total - 2.5% each)
  paddle_purple: {
    id: 'paddle_purple',
    name: 'Purple Paddle',
    type: 'paddle',
    color: '#A855F7',
    rarity: 'epic',
    animated: false,
    unlocked: false,
  },
  paddle_pink: {
    id: 'paddle_pink',
    name: 'Pink Paddle',
    type: 'paddle',
    color: '#EC4899',
    rarity: 'epic',
    animated: false,
    unlocked: false,
  },

  // LEGENDARY SKIN (1%)
  paddle_rainbow: {
    id: 'paddle_rainbow',
    name: 'Rainbow Paddle',
    type: 'paddle',
    colors: ['#EF4444', '#F97316', '#EAB308', '#10B981', '#3B82F6', '#6366F1', '#A855F7'],
    rarity: 'legendary',
    animated: true,
    animationType: 'rainbow-cycle',
    animationSpeed: 300,
    unlocked: false,
  },
};

// Helper to get skins by rarity
export const getSkinsByRarity = (rarity) => {
  return Object.values(BALL_SKINS).filter(skin => skin.rarity === rarity);
};

// Helper to get paddle skins by rarity
export const getPaddleSkinsByRarity = (rarity) => {
  return Object.values(PADDLE_SKINS).filter(skin => skin.rarity === rarity);
};

// Helper to get all skins as array
export const getAllSkins = () => {
  return Object.values(BALL_SKINS);
};

// Helper to get all paddle skins as array
export const getAllPaddleSkins = () => {
  return Object.values(PADDLE_SKINS);
};

// Theme definitions
// Themes change the entire app color scheme
// Rarity distribution: Common (64%), Uncommon (20%), Rare (10%), Epic (5%), Legendary (1%)

export const THEME_SKINS = {
  // COMMON THEMES (64% total - 16% each)
  theme_default: {
    id: 'theme_default',
    name: 'Dark Blue',
    type: 'theme',
    rarity: 'common',
    animated: false,
    unlocked: true, // Default starter theme
    colors: {
      background: '#0F172A',
      surface: '#1E293B',
      primary: '#3B82F6',
      secondary: '#64748B',
      text: '#F1F5F9',
      textSecondary: '#94A3B8',
      accent: '#60A5FA',
      border: 'rgba(59, 130, 246, 0.2)',
    },
  },
  theme_dark_grey: {
    id: 'theme_dark_grey',
    name: 'Dark Grey',
    type: 'theme',
    rarity: 'common',
    animated: false,
    unlocked: false,
    colors: {
      background: '#111827',
      surface: '#1F2937',
      primary: '#6B7280',
      secondary: '#4B5563',
      text: '#F9FAFB',
      textSecondary: '#9CA3AF',
      accent: '#9CA3AF',
      border: 'rgba(107, 114, 128, 0.2)',
    },
  },
  theme_light_grey: {
    id: 'theme_light_grey',
    name: 'Light Grey',
    type: 'theme',
    rarity: 'common',
    animated: false,
    unlocked: false,
    colors: {
      background: '#F3F4F6',
      surface: '#E5E7EB',
      primary: '#6B7280',
      secondary: '#9CA3AF',
      text: '#111827',
      textSecondary: '#4B5563',
      accent: '#4B5563',
      border: 'rgba(107, 114, 128, 0.3)',
    },
  },
  theme_navy: {
    id: 'theme_navy',
    name: 'Navy',
    type: 'theme',
    rarity: 'common',
    animated: false,
    unlocked: false,
    colors: {
      background: '#0C1633',
      surface: '#1A2847',
      primary: '#1E40AF',
      secondary: '#3730A3',
      text: '#E0E7FF',
      textSecondary: '#A5B4FC',
      accent: '#60A5FA',
      border: 'rgba(30, 64, 175, 0.2)',
    },
  },

  // UNCOMMON THEMES (20% total - 10% each)
  theme_forest: {
    id: 'theme_forest',
    name: 'Forest',
    type: 'theme',
    rarity: 'uncommon',
    animated: false,
    unlocked: false,
    colors: {
      background: '#14532D',
      surface: '#166534',
      primary: '#22C55E',
      secondary: '#16A34A',
      text: '#F0FDF4',
      textSecondary: '#86EFAC',
      accent: '#4ADE80',
      border: 'rgba(34, 197, 94, 0.2)',
    },
  },
  theme_lavender: {
    id: 'theme_lavender',
    name: 'Lavender',
    type: 'theme',
    rarity: 'uncommon',
    animated: false,
    unlocked: false,
    colors: {
      background: '#2E1065',
      surface: '#4C1D95',
      primary: '#A78BFA',
      secondary: '#8B5CF6',
      text: '#F5F3FF',
      textSecondary: '#C4B5FD',
      accent: '#C4B5FD',
      border: 'rgba(167, 139, 250, 0.2)',
    },
  },

  // RARE THEMES (10% total - 5% each)
  theme_sand: {
    id: 'theme_sand',
    name: 'Desert Sand',
    type: 'theme',
    rarity: 'rare',
    animated: false,
    unlocked: false,
    colors: {
      background: '#78350F',
      surface: '#92400E',
      primary: '#F59E0B',
      secondary: '#D97706',
      text: '#FFFBEB',
      textSecondary: '#FCD34D',
      accent: '#FBBF24',
      border: 'rgba(245, 158, 11, 0.2)',
    },
  },
  theme_ocean: {
    id: 'theme_ocean',
    name: 'Ocean',
    type: 'theme',
    rarity: 'rare',
    animated: false,
    unlocked: false,
    colors: {
      background: '#164E63',
      surface: '#0E7490',
      primary: '#06B6D4',
      secondary: '#0891B2',
      text: '#ECFEFF',
      textSecondary: '#67E8F9',
      accent: '#22D3EE',
      border: 'rgba(6, 182, 212, 0.2)',
    },
  },

  // EPIC THEME (5%)
  theme_white: {
    id: 'theme_white',
    name: 'Pure White',
    type: 'theme',
    rarity: 'epic',
    animated: false,
    unlocked: false,
    colors: {
      background: '#FFFFFF',
      surface: '#F9FAFB',
      primary: '#3B82F6',
      secondary: '#60A5FA',
      text: '#111827',
      textSecondary: '#6B7280',
      accent: '#2563EB',
      border: 'rgba(59, 130, 246, 0.3)',
    },
  },

  // LEGENDARY THEME (1%)
  theme_neon: {
    id: 'theme_neon',
    name: 'Neon Cyberpunk',
    type: 'theme',
    rarity: 'legendary',
    animated: true,
    animationType: 'neon-pulse',
    animationSpeed: 2000,
    unlocked: false,
    hasVariants: true,
    defaultVariant: 'pink', // Default to pink/magenta
    // Color variants user can choose from
    variants: {
      pink: {
        name: 'Neon Pink',
        primary: '#FF00FF', // Magenta
        secondary: '#FF1493', // Deep Pink
        accent: '#FF69B4', // Hot Pink
      },
      red: {
        name: 'Neon Red',
        primary: '#FF0000',
        secondary: '#FF4444',
        accent: '#FF6666',
      },
      orange: {
        name: 'Neon Orange',
        primary: '#FF6600',
        secondary: '#FF8800',
        accent: '#FFAA00',
      },
      yellow: {
        name: 'Neon Yellow',
        primary: '#FFFF00',
        secondary: '#FFDD00',
        accent: '#FFBB00',
      },
      green: {
        name: 'Neon Green',
        primary: '#00FF00',
        secondary: '#00FF66',
        accent: '#00FF99',
      },
      blue: {
        name: 'Neon Blue',
        primary: '#00FFFF', // Cyan
        secondary: '#0099FF',
        accent: '#00CCFF',
      },
      purple: {
        name: 'Neon Purple',
        primary: '#9900FF',
        secondary: '#BB00FF',
        accent: '#CC66FF',
      },
      white: {
        name: 'Neon White',
        primary: '#FFFFFF',
        secondary: '#EEEEEE',
        accent: '#DDDDDD',
      },
    },
    colors: {
      background: '#0A0A0A',
      surface: '#1A1A1A',
      primary: '#FF00FF', // Default to pink
      secondary: '#FF1493',
      text: '#FFFFFF',
      textSecondary: '#FF00FF',
      accent: '#FF69B4',
      border: 'rgba(255, 0, 255, 0.5)',
    },
  },
};

// Helper to get theme skins by rarity
export const getThemeSkinsByRarity = (rarity) => {
  return Object.values(THEME_SKINS).filter(theme => theme.rarity === rarity);
};

// Helper to get all theme skins as array
export const getAllThemeSkins = () => {
  return Object.values(THEME_SKINS);
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
  secret: {
    label: 'Secret',
    color: '#10B981', // Neon green text and border
    glowColor: 'rgba(0, 0, 0, 0.9)', // Black background
    dropRate: 0,
  },
};
