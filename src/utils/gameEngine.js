import { GAME_CONFIG } from '../constants/gameConfig';

// Initialize game state
export const initializeGame = (screenWidth, screenHeight, difficulty) => {
  const difficultySettings = GAME_CONFIG.DIFFICULTY[difficulty];
  
  return {
    ball: {
      x: screenWidth / 2,
      y: screenHeight / 2,
      velocityX: 0, // Start stationary
      velocityY: 0,
      speed: GAME_CONFIG.INITIAL_BALL_SPEED, // Use consistent initial speed
    },
    playerPaddle: {
      x: 20,
      y: screenHeight / 2 - GAME_CONFIG.PADDLE_HEIGHT / 2,
    },
    aiPaddle: {
      x: screenWidth - 20 - GAME_CONFIG.PADDLE_WIDTH,
      y: screenHeight / 2 - GAME_CONFIG.PADDLE_HEIGHT / 2,
    },
    score: {
      player: 0,
      ai: 0,
    },
    difficulty: difficulty,
    difficultySettings: difficultySettings,
    rallyCount: 0,
    totalCoins: 0,
    screenWidth,
    screenHeight,
    isPaused: false,
    gameOver: false,
    serving: 'player', // Who is serving (has the ball)
    serveTimer: 0, // Timer for auto-serve after 10 seconds
    ballActive: false, // Is ball moving
    aiTargetY: screenHeight / 2, // AI target position (reduces jitter)
  };
};

// Update ball position and handle collisions
export const updateBall = (gameState) => {
  if (gameState.isPaused || gameState.gameOver) return gameState;

  const newState = { ...gameState };
  const { ball, playerPaddle, aiPaddle, screenWidth, screenHeight } = newState;

  // If ball is not active (waiting to serve), position it with the server
  if (!newState.ballActive) {
    if (newState.serving === 'player') {
      ball.x = playerPaddle.x + GAME_CONFIG.PADDLE_WIDTH + 10;
      ball.y = playerPaddle.y + GAME_CONFIG.PADDLE_HEIGHT / 2 - GAME_CONFIG.BALL_SIZE / 2;
      
      // Increment serve timer
      newState.serveTimer += 1;
      
      // Auto-serve after 10 seconds (600 frames at 60fps)
      if (newState.serveTimer > 600) {
        activateBall(newState);
      }
    } else {
      // AI serving
      ball.x = aiPaddle.x - GAME_CONFIG.BALL_SIZE - 10;
      ball.y = aiPaddle.y + GAME_CONFIG.PADDLE_HEIGHT / 2 - GAME_CONFIG.BALL_SIZE / 2;
      
      // Increment serve timer
      newState.serveTimer += 1;
      
      // AI auto-serves after 3 seconds (180 frames at 60fps)
      if (newState.serveTimer > 180) {
        activateBall(newState);
      }
    }
    
    return newState;
  }

  // Update ball position
  ball.x += ball.velocityX;
  ball.y += ball.velocityY;

  // Top wall collision - ensure ball stays in bounds
  if (ball.y <= 0) {
    ball.velocityY = Math.abs(ball.velocityY); // Force downward
    ball.y = 1; // Prevent getting stuck
  }
  
  // Bottom wall collision - ensure ball stays in bounds
  if (ball.y >= screenHeight - GAME_CONFIG.BALL_SIZE) {
    ball.velocityY = -Math.abs(ball.velocityY); // Force upward
    ball.y = screenHeight - GAME_CONFIG.BALL_SIZE - 1; // Prevent getting stuck
  }

  // Player paddle collision
  if (
    ball.x <= playerPaddle.x + GAME_CONFIG.PADDLE_WIDTH &&
    ball.x >= playerPaddle.x &&
    ball.y + GAME_CONFIG.BALL_SIZE >= playerPaddle.y &&
    ball.y <= playerPaddle.y + GAME_CONFIG.PADDLE_HEIGHT
  ) {
    handlePaddleCollision(ball, playerPaddle, screenHeight);
    newState.rallyCount += 1;
    checkRallyBonus(newState);
  }

  // AI paddle collision
  if (
    ball.x + GAME_CONFIG.BALL_SIZE >= aiPaddle.x &&
    ball.x <= aiPaddle.x + GAME_CONFIG.PADDLE_WIDTH &&
    ball.y + GAME_CONFIG.BALL_SIZE >= aiPaddle.y &&
    ball.y <= aiPaddle.y + GAME_CONFIG.PADDLE_HEIGHT
  ) {
    handlePaddleCollision(ball, aiPaddle, screenHeight);
    newState.rallyCount += 1;
    checkRallyBonus(newState);
  }

  // Ball goes out of bounds (scoring)
  if (ball.x < 0) {
    // AI scores, player will serve next
    newState.score.ai += 1;
    resetBall(newState, screenWidth, screenHeight, 'player');
    newState.rallyCount = 0;
  } else if (ball.x > screenWidth) {
    // Player scores, AI will serve next
    newState.score.player += 1;
    resetBall(newState, screenWidth, screenHeight, 'ai');
    newState.rallyCount = 0;
  }

  // Check for game over (first to 5)
  if (newState.score.player >= 5) {
    newState.gameOver = true;
    newState.totalCoins += newState.difficultySettings.COIN_REWARD;
  } else if (newState.score.ai >= 5) {
    newState.gameOver = true;
    // No coins for losing
  }

  return newState;
};

// Handle paddle collision physics
const handlePaddleCollision = (ball, paddle, screenHeight) => {
  // Reverse X direction
  ball.velocityX *= -1;

  // Add spin based on where ball hits paddle
  const paddleCenter = paddle.y + GAME_CONFIG.PADDLE_HEIGHT / 2;
  const hitPosition = (ball.y + GAME_CONFIG.BALL_SIZE / 2 - paddleCenter) / (GAME_CONFIG.PADDLE_HEIGHT / 2);
  
  // Calculate angle from hit position (-1 to 1)
  const angle = hitPosition * (Math.PI / 4); // Max 45 degrees
  
  // Increase ball speed incrementally (not by percentage)
  ball.speed = Math.min(ball.speed + GAME_CONFIG.BALL_SPEED_INCREMENT, GAME_CONFIG.MAX_BALL_SPEED);
  
  // Set velocity based on speed and angle
  const direction = ball.velocityX > 0 ? 1 : -1;
  ball.velocityX = direction * ball.speed * Math.cos(angle);
  ball.velocityY = ball.speed * Math.sin(angle);
};

// Reset ball to center
const resetBall = (gameState, screenWidth, screenHeight, server) => {
  gameState.ball.x = screenWidth / 2;
  gameState.ball.y = screenHeight / 2;
  gameState.ball.velocityX = 0;
  gameState.ball.velocityY = 0;
  gameState.ball.speed = GAME_CONFIG.INITIAL_BALL_SPEED; // Reset to initial speed
  gameState.ballActive = false;
  gameState.serving = server;
  gameState.serveTimer = 0;
};

// Activate ball (start it moving)
const activateBall = (gameState) => {
  const direction = gameState.serving === 'player' ? 1 : -1;
  const angle = (Math.random() - 0.5) * (Math.PI / 6); // Random angle between -15 and +15 degrees
  
  gameState.ball.velocityX = direction * gameState.ball.speed * Math.cos(angle);
  gameState.ball.velocityY = gameState.ball.speed * Math.sin(angle);
  gameState.ballActive = true;
  gameState.serveTimer = 0;
};

// Serve ball when player moves (call this from paddle movement)
export const serveBall = (gameState) => {
  // Only allow player to serve after 1 second delay (60 frames at 60fps)
  if (!gameState.ballActive && gameState.serving === 'player' && gameState.serveTimer >= 60) {
    activateBall(gameState);
  }
  return gameState;
};

// Check rally bonus
const checkRallyBonus = (gameState) => {
  if (gameState.rallyCount > 0 && gameState.rallyCount % GAME_CONFIG.RALLY_COIN_THRESHOLD === 0) {
    gameState.totalCoins += GAME_CONFIG.RALLY_COIN_REWARD;
  }
};

// Update AI paddle position
export const updateAI = (gameState) => {
  if (gameState.isPaused || gameState.gameOver) return gameState;

  const { ball, aiPaddle, difficultySettings, screenHeight } = gameState;
  const paddleCenter = aiPaddle.y + GAME_CONFIG.PADDLE_HEIGHT / 2;
  const ballCenter = ball.y + GAME_CONFIG.BALL_SIZE / 2;

  // Update target position occasionally (not every frame) to reduce jitter
  // Only update when ball is moving toward AI or when far from current target
  if (ball.velocityX > 0 || Math.abs(paddleCenter - gameState.aiTargetY) > 50) {
    gameState.aiTargetY = ballCenter + (Math.random() - 0.5) * difficultySettings.AI_ERROR_MARGIN;
  }

  // Move AI paddle towards target smoothly
  const deadZone = 10; // Prevent jittering near target
  if (paddleCenter < gameState.aiTargetY - deadZone) {
    aiPaddle.y = Math.min(
      aiPaddle.y + difficultySettings.AI_SPEED,
      screenHeight - GAME_CONFIG.PADDLE_HEIGHT
    );
  } else if (paddleCenter > gameState.aiTargetY + deadZone) {
    aiPaddle.y = Math.max(aiPaddle.y - difficultySettings.AI_SPEED, 0);
  }

  return gameState;
};

// Update player paddle position (called from button input)
export const updatePlayerPaddle = (gameState, direction) => {
  const { playerPaddle, screenHeight } = gameState;
  
  const speed = 10; // Balanced paddle movement speed (between old 8 and new 12)
  
  if (direction === 'up') {
    playerPaddle.y = Math.max(0, playerPaddle.y - speed);
  } else if (direction === 'down') {
    playerPaddle.y = Math.min(
      screenHeight - GAME_CONFIG.PADDLE_HEIGHT,
      playerPaddle.y + speed
    );
  }
  
  // Serve ball when player moves
  serveBall(gameState);
  
  return gameState;
};
