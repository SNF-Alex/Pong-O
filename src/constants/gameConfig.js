// Game configuration constants
export const GAME_CONFIG = {
  BALL_SIZE: 14,
  PADDLE_WIDTH: 15,
  PADDLE_HEIGHT: 120,
  INITIAL_BALL_SPEED: 6, // Starting ball speed
  BALL_SPEED_INCREMENT: 0.15, // Ball speeds up by 0.15 each hit
  MAX_BALL_SPEED: 14, // Cap at 14 for playability
  
  // Difficulty settings
  DIFFICULTY: {
    EASY: {
      AI_SPEED: 4,
      AI_REACTION_DELAY: 0.3, // AI reacts slower
      AI_ERROR_MARGIN: 30, // AI aims within 30px of ball
      COIN_REWARD: 10,
    },
    MEDIUM: {
      AI_SPEED: 6,
      AI_REACTION_DELAY: 0.15,
      AI_ERROR_MARGIN: 15,
      COIN_REWARD: 50,
    },
    HARD: {
      AI_SPEED: 8,
      AI_REACTION_DELAY: 0.05,
      AI_ERROR_MARGIN: 5,
      COIN_REWARD: 100,
    },
  },
  
  // Coin rewards
  RALLY_COIN_THRESHOLD: 5, // Hits before earning rally coins
  RALLY_COIN_REWARD: 10,
};

// Modern color scheme
export const COLORS = {
  background: '#0F172A', // Dark blue-gray
  primary: '#3B82F6', // Bright blue
  secondary: '#8B5CF6', // Purple
  accent: '#10B981', // Green
  text: '#F1F5F9',
  textSecondary: '#94A3B8',
  paddle: '#3B82F6',
  ball: '#FFFFFF',
  aiPaddle: '#EF4444', // Red for AI
};
