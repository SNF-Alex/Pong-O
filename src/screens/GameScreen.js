import React, { useState, useEffect, useRef } from 'react';
import {
  View,
  Text,
  StyleSheet,
  Dimensions,
  TouchableOpacity,
  StatusBar,
  PanResponder,
} from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { COLORS, GAME_CONFIG } from '../constants/gameConfig';
import {
  initializeGame,
  updateBall,
  updateAI,
  updatePlayerPaddle,
} from '../utils/gameEngine';

const { width: SCREEN_WIDTH, height: SCREEN_HEIGHT } = Dimensions.get('window');

// Account for UI elements to get actual playable area
const SCORE_HEIGHT = 120;
const CONTROLS_HEIGHT = 140;
const PLAYABLE_HEIGHT = SCREEN_HEIGHT - SCORE_HEIGHT - CONTROLS_HEIGHT;

export default function GameScreen({ route, navigation }) {
  const { difficulty } = route.params;
  
  const [gameState, setGameState] = useState(() =>
    initializeGame(SCREEN_WIDTH, PLAYABLE_HEIGHT, difficulty)
  );
  const gameLoopRef = useRef(null);
  const moveIntervalRef = useRef(null);
  const [showSettings, setShowSettings] = useState(false);
  const [countdown, setCountdown] = useState(0);
  const [controlStyle, setControlStyle] = useState('arrows'); // 'arrows' or 'drag'
  const [controlPosition, setControlPosition] = useState('bottom-right'); // bottom-right, bottom-left, top-right, top-left, bottom-bar
  const [showPositionDropdown, setShowPositionDropdown] = useState(false); // For dropdown menu
  const [showStyleDropdown, setShowStyleDropdown] = useState(false); // For control style dropdown

  const handlePaddleMove = (direction) => {
    setGameState((prevState) => {
      const newState = { ...prevState };
      updatePlayerPaddle(newState, direction);
      return newState;
    });
  };

  const startMoving = (direction) => {
    // Clear any existing interval
    if (moveIntervalRef.current) {
      clearInterval(moveIntervalRef.current);
    }
    
    // Start continuous movement
    moveIntervalRef.current = setInterval(() => {
      handlePaddleMove(direction);
    }, 16); // ~60fps
  };

  const stopMoving = () => {
    if (moveIntervalRef.current) {
      clearInterval(moveIntervalRef.current);
      moveIntervalRef.current = null;
    }
  };

  // Clean up on unmount
  useEffect(() => {
    return () => {
      if (moveIntervalRef.current) {
        clearInterval(moveIntervalRef.current);
      }
    };
  }, []);

  // PanResponder for drag control
  const panResponder = PanResponder.create({
    onStartShouldSetPanResponder: () => controlStyle === 'drag' && !gameState.isPaused && !gameState.gameOver,
    onMoveShouldSetPanResponder: () => controlStyle === 'drag' && !gameState.isPaused && !gameState.gameOver,
    onPanResponderGrant: (evt) => {
      // User touched the screen
      const touchY = evt.nativeEvent.pageY - SCORE_HEIGHT;
      setGameState((prevState) => {
        const newState = { ...prevState };
        // Set paddle position to touch location
        newState.playerPaddle.y = Math.max(
          0,
          Math.min(touchY - GAME_CONFIG.PADDLE_HEIGHT / 2, PLAYABLE_HEIGHT - GAME_CONFIG.PADDLE_HEIGHT)
        );
        // Trigger serve if ball is waiting
        if (!newState.ballActive && newState.serving === 'player' && newState.serveTimer >= 60) {
          const gameEngine = require('../utils/gameEngine');
          gameEngine.serveBall(newState);
        }
        return newState;
      });
    },
    onPanResponderMove: (evt, gestureState) => {
      // User is dragging
      const touchY = evt.nativeEvent.pageY - SCORE_HEIGHT;
      setGameState((prevState) => {
        const newState = { ...prevState };
        // Update paddle position to follow touch
        newState.playerPaddle.y = Math.max(
          0,
          Math.min(touchY - GAME_CONFIG.PADDLE_HEIGHT / 2, PLAYABLE_HEIGHT - GAME_CONFIG.PADDLE_HEIGHT)
        );
        return newState;
      });
    },
    onPanResponderRelease: () => {
      // User lifted finger
    },
  });

  // Game loop
  useEffect(() => {
    if (!gameState.isPaused && !gameState.gameOver) {
      gameLoopRef.current = setInterval(() => {
        setGameState((prevState) => {
          let newState = { ...prevState };
          newState = updateBall(newState);
          newState = updateAI(newState);
          return newState;
        });
      }, 1000 / 60); // 60 FPS

      return () => {
        if (gameLoopRef.current) {
          clearInterval(gameLoopRef.current);
        }
      };
    }
  }, [gameState.isPaused, gameState.gameOver]);

  const togglePause = () => {
    setGameState((prev) => ({ ...prev, isPaused: !prev.isPaused }));
  };

  const openSettings = () => {
    setShowSettings(true);
    setGameState((prev) => ({ ...prev, isPaused: true }));
  };

  const closeSettings = () => {
    setShowSettings(false);
    // Start countdown
    setCountdown(3);
  };

  // Countdown effect
  useEffect(() => {
    if (countdown > 0) {
      const timer = setTimeout(() => {
        setCountdown(countdown - 1);
      }, 1000);
      return () => clearTimeout(timer);
    } else if (countdown === 0 && !showSettings && gameState.isPaused) {
      // Countdown finished, unpause game
      setGameState((prev) => ({ ...prev, isPaused: false }));
    }
  }, [countdown, showSettings, gameState.isPaused]);

  const restartGame = () => {
    setGameState(initializeGame(SCREEN_WIDTH, PLAYABLE_HEIGHT, difficulty));
  };

  const goToMenu = () => {
    navigation.goBack();
  };

  const getPositionDisplayName = (position) => {
    const names = {
      'bottom-right': 'Bottom Right',
      'bottom-left': 'Bottom Left',
      'top-right': 'Top Right',
      'top-left': 'Top Left',
      'bottom-bar': 'Bottom Bar',
    };
    return names[position] || 'Bottom Right';
  };

  const selectPosition = (position) => {
    setControlPosition(position);
    setShowPositionDropdown(false);
  };

  const getStyleDisplayName = (style) => {
    return style === 'arrows' ? 'Arrow Buttons' : 'Drag';
  };

  const selectControlStyle = (style) => {
    setControlStyle(style);
    setShowStyleDropdown(false);
  };

  return (
    <View style={styles.container}>
      <StatusBar barStyle="light-content" />

      {/* Score Display */}
      <View style={styles.scoreContainer}>
        <View style={styles.scoreBox}>
          <Text style={styles.scoreLabel}>YOU</Text>
          <Text style={styles.scoreValue}>{gameState.score.player}</Text>
        </View>
        
        <View style={styles.centerInfo}>
          <Text style={styles.difficultyText}>{difficulty}</Text>
          <View style={styles.coinsRow}>
            <Ionicons name="wallet" size={18} color={COLORS.accent} />
            <Text style={styles.coinsText}>{gameState.totalCoins}</Text>
          </View>
          {gameState.rallyCount > 0 && (
            <Text style={styles.rallyText}>Rally: {gameState.rallyCount}</Text>
          )}
        </View>

        <View style={styles.scoreBox}>
          <Text style={styles.scoreLabel}>AI</Text>
          <Text style={styles.scoreValue}>{gameState.score.ai}</Text>
        </View>
      </View>

      {/* Game Area */}
      <View style={styles.gameArea} {...panResponder.panHandlers}>
        {/* Center Line */}
        <View style={styles.centerLine} />

        {/* Player Paddle */}
        <View
          style={[
            styles.paddle,
            {
              left: gameState.playerPaddle.x,
              top: gameState.playerPaddle.y,
              backgroundColor: COLORS.paddle,
            },
          ]}
        />

        {/* AI Paddle */}
        <View
          style={[
            styles.paddle,
            {
              left: gameState.aiPaddle.x,
              top: gameState.aiPaddle.y,
              backgroundColor: COLORS.aiPaddle,
            },
          ]}
        />

        {/* Ball */}
        <View
          style={[
            styles.ball,
            {
              left: gameState.ball.x,
              top: gameState.ball.y,
            },
          ]}
        />
      </View>

      {/* Control Buttons */}
      <View style={styles.controls}>
        <TouchableOpacity style={styles.controlButton} onPress={goToMenu}>
          <Ionicons name="home" size={32} color={COLORS.text} />
        </TouchableOpacity>
        <TouchableOpacity style={styles.controlButton} onPress={openSettings}>
          <Ionicons name="settings" size={32} color={COLORS.text} />
        </TouchableOpacity>
      </View>

      {/* Game Over Modal */}
      {gameState.gameOver && (
        <View style={styles.gameOverContainer}>
          <View style={styles.gameOverModal}>
            <Ionicons 
              name={gameState.score.player > gameState.score.ai ? 'trophy' : 'sad'} 
              size={64} 
              color={gameState.score.player > gameState.score.ai ? COLORS.accent : COLORS.aiPaddle} 
            />
            <Text style={styles.gameOverTitle}>
              {gameState.score.player > gameState.score.ai ? 'YOU WIN!' : 'YOU LOSE'}
            </Text>
            <Text style={styles.gameOverScore}>
              {gameState.score.player} - {gameState.score.ai}
            </Text>
            {gameState.score.player > gameState.score.ai && (
              <View style={styles.coinsEarnedContainer}>
                <Ionicons name="wallet" size={24} color={COLORS.accent} />
                <Text style={styles.coinsEarned}> {gameState.totalCoins} coins earned!</Text>
              </View>
            )}
            <View style={styles.gameOverButtons}>
              <TouchableOpacity
                style={[styles.button, styles.primaryButton]}
                onPress={restartGame}
              >
                <Text style={styles.buttonText}>Play Again</Text>
              </TouchableOpacity>
              <TouchableOpacity
                style={[styles.button, styles.secondaryButton]}
                onPress={goToMenu}
              >
                <Text style={styles.buttonText}>Main Menu</Text>
              </TouchableOpacity>
            </View>
          </View>
        </View>
      )}

      {/* Pause Screen - Don't show during countdown */}
      {gameState.isPaused && !gameState.gameOver && !showSettings && countdown === 0 && (
        <View style={styles.pauseContainer}>
          <Text style={styles.pauseText}>PAUSED</Text>
          <Text style={styles.pauseSubtext}>Tap play to continue</Text>
        </View>
      )}

      {/* Serve Indicator */}
      {!gameState.ballActive && !gameState.gameOver && (
        <View style={styles.serveIndicator}>
          <Ionicons name="hand-right" size={24} color={COLORS.primary} />
          <Text style={styles.serveText}>
            {gameState.serving === 'player' 
              ? (gameState.serveTimer < 60 
                  ? 'Player serving... Get ready!' 
                  : 'Your serve! Move to start')
              : 'AI serving...'}
          </Text>
        </View>
      )}

      {/* Arrow Controls - Dynamic Position */}
      {!gameState.gameOver && !gameState.isPaused && controlStyle === 'arrows' && controlPosition !== 'bottom-bar' && (
        <View style={[
          styles.arrowControls,
          controlPosition === 'bottom-left' && styles.arrowControlsBottomLeft,
          controlPosition === 'top-right' && styles.arrowControlsTopRight,
          controlPosition === 'top-left' && styles.arrowControlsTopLeft,
        ]}>
          <TouchableOpacity
            style={styles.arrowButton}
            onPressIn={() => startMoving('up')}
            onPressOut={stopMoving}
          >
            <Ionicons name="chevron-up" size={40} color={COLORS.text} />
          </TouchableOpacity>
          <TouchableOpacity
            style={styles.arrowButton}
            onPressIn={() => startMoving('down')}
            onPressOut={stopMoving}
          >
            <Ionicons name="chevron-down" size={40} color={COLORS.text} />
          </TouchableOpacity>
        </View>
      )}

      {/* Bottom Bar Controls - Side by Side */}
      {!gameState.gameOver && !gameState.isPaused && controlStyle === 'arrows' && controlPosition === 'bottom-bar' && (
        <View style={styles.bottomBarControls}>
          <TouchableOpacity
            style={styles.bottomBarButton}
            onPressIn={() => startMoving('up')}
            onPressOut={stopMoving}
          >
            <Ionicons name="chevron-up" size={40} color={COLORS.text} />
          </TouchableOpacity>
          <TouchableOpacity
            style={styles.bottomBarButton}
            onPressIn={() => startMoving('down')}
            onPressOut={stopMoving}
          >
            <Ionicons name="chevron-down" size={40} color={COLORS.text} />
          </TouchableOpacity>
        </View>
      )}

      {/* Settings Modal */}
      {showSettings && (
        <View style={styles.settingsOverlay}>
          <View style={styles.settingsModal}>
            {/* Close Button */}
            <TouchableOpacity style={styles.closeButton} onPress={closeSettings}>
              <Ionicons name="close" size={32} color={COLORS.text} />
            </TouchableOpacity>
            
            {/* Settings Title */}
            <Text style={styles.settingsTitle}>SETTINGS</Text>
            
            {/* Settings Content */}
            <View style={styles.settingsContent}>
              {/* Control Style Dropdown */}
              <Text style={styles.settingsOption}>Control Style</Text>
              
              <TouchableOpacity
                style={styles.dropdownTrigger}
                onPress={() => setShowStyleDropdown(!showStyleDropdown)}
              >
                <Text style={styles.dropdownText}>
                  {getStyleDisplayName(controlStyle)}
                </Text>
                <Ionicons 
                  name={showStyleDropdown ? 'chevron-up' : 'chevron-down'} 
                  size={20} 
                  color={COLORS.textSecondary} 
                />
              </TouchableOpacity>

              {showStyleDropdown && (
                <View style={styles.dropdownMenu}>
                  <TouchableOpacity
                    style={[
                      styles.dropdownItem,
                      controlStyle === 'arrows' && styles.dropdownItemActive
                    ]}
                    onPress={() => selectControlStyle('arrows')}
                  >
                    <Text style={[
                      styles.dropdownItemText,
                      controlStyle === 'arrows' && styles.dropdownItemTextActive
                    ]}>Arrow Buttons</Text>
                    {controlStyle === 'arrows' && (
                      <Ionicons name="checkmark" size={20} color={COLORS.primary} />
                    )}
                  </TouchableOpacity>

                  <TouchableOpacity
                    style={[
                      styles.dropdownItem,
                      controlStyle === 'drag' && styles.dropdownItemActive
                    ]}
                    onPress={() => selectControlStyle('drag')}
                  >
                    <Text style={[
                      styles.dropdownItemText,
                      controlStyle === 'drag' && styles.dropdownItemTextActive
                    ]}>Drag</Text>
                    {controlStyle === 'drag' && (
                      <Ionicons name="checkmark" size={20} color={COLORS.primary} />
                    )}
                  </TouchableOpacity>
                </View>
              )}

              {/* Control Position Dropdown - Only show for Arrow Buttons */}
              {controlStyle === 'arrows' && (
                <>
                  <Text style={[styles.settingsOption, { marginTop: 24 }]}>Button Position</Text>
                  
                  <TouchableOpacity
                    style={styles.dropdownTrigger}
                    onPress={() => setShowPositionDropdown(!showPositionDropdown)}
                  >
                    <Text style={styles.dropdownText}>
                      {getPositionDisplayName(controlPosition)}
                    </Text>
                    <Ionicons 
                      name={showPositionDropdown ? 'chevron-up' : 'chevron-down'} 
                      size={20} 
                      color={COLORS.textSecondary} 
                    />
                  </TouchableOpacity>

                  {showPositionDropdown && (
                <View style={styles.dropdownMenu}>
                  <TouchableOpacity
                    style={[
                      styles.dropdownItem,
                      controlPosition === 'bottom-right' && styles.dropdownItemActive
                    ]}
                    onPress={() => selectPosition('bottom-right')}
                  >
                    <Text style={[
                      styles.dropdownItemText,
                      controlPosition === 'bottom-right' && styles.dropdownItemTextActive
                    ]}>Bottom Right</Text>
                    {controlPosition === 'bottom-right' && (
                      <Ionicons name="checkmark" size={20} color={COLORS.primary} />
                    )}
                  </TouchableOpacity>

                  <TouchableOpacity
                    style={[
                      styles.dropdownItem,
                      controlPosition === 'bottom-left' && styles.dropdownItemActive
                    ]}
                    onPress={() => selectPosition('bottom-left')}
                  >
                    <Text style={[
                      styles.dropdownItemText,
                      controlPosition === 'bottom-left' && styles.dropdownItemTextActive
                    ]}>Bottom Left</Text>
                    {controlPosition === 'bottom-left' && (
                      <Ionicons name="checkmark" size={20} color={COLORS.primary} />
                    )}
                  </TouchableOpacity>

                  <TouchableOpacity
                    style={[
                      styles.dropdownItem,
                      controlPosition === 'top-right' && styles.dropdownItemActive
                    ]}
                    onPress={() => selectPosition('top-right')}
                  >
                    <Text style={[
                      styles.dropdownItemText,
                      controlPosition === 'top-right' && styles.dropdownItemTextActive
                    ]}>Top Right</Text>
                    {controlPosition === 'top-right' && (
                      <Ionicons name="checkmark" size={20} color={COLORS.primary} />
                    )}
                  </TouchableOpacity>

                  <TouchableOpacity
                    style={[
                      styles.dropdownItem,
                      controlPosition === 'top-left' && styles.dropdownItemActive
                    ]}
                    onPress={() => selectPosition('top-left')}
                  >
                    <Text style={[
                      styles.dropdownItemText,
                      controlPosition === 'top-left' && styles.dropdownItemTextActive
                    ]}>Top Left</Text>
                    {controlPosition === 'top-left' && (
                      <Ionicons name="checkmark" size={20} color={COLORS.primary} />
                    )}
                  </TouchableOpacity>

                  <TouchableOpacity
                    style={[
                      styles.dropdownItem,
                      controlPosition === 'bottom-bar' && styles.dropdownItemActive
                    ]}
                    onPress={() => selectPosition('bottom-bar')}
                  >
                    <Text style={[
                      styles.dropdownItemText,
                      controlPosition === 'bottom-bar' && styles.dropdownItemTextActive
                    ]}>Bottom Bar</Text>
                    {controlPosition === 'bottom-bar' && (
                      <Ionicons name="checkmark" size={20} color={COLORS.primary} />
                    )}
                  </TouchableOpacity>
                </View>
              )}
                </>
              )}
            </View>
          </View>
        </View>
      )}

      {/* Countdown Overlay */}
      {countdown > 0 && !showSettings && (
        <View style={styles.countdownOverlay}>
          <Text style={styles.countdownText}>{countdown}</Text>
        </View>
      )}
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: COLORS.background,
  },
  scoreContainer: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingHorizontal: 30,
    paddingTop: 60,
    paddingBottom: 15,
    backgroundColor: 'rgba(0,0,0,0.3)',
  },
  scoreBox: {
    alignItems: 'center',
    minWidth: 80,
  },
  scoreLabel: {
    fontSize: 11,
    color: COLORS.textSecondary,
    letterSpacing: 2,
    marginBottom: 4,
    fontWeight: '600',
  },
  scoreValue: {
    fontSize: 42,
    fontWeight: 'bold',
    color: COLORS.text,
  },
  centerInfo: {
    alignItems: 'center',
  },
  difficultyText: {
    fontSize: 14,
    color: COLORS.primary,
    fontWeight: 'bold',
    letterSpacing: 1,
  },
  coinsRow: {
    flexDirection: 'row',
    alignItems: 'center',
    marginTop: 6,
  },
  coinsText: {
    fontSize: 18,
    color: COLORS.accent,
    fontWeight: 'bold',
    marginLeft: 6,
  },
  rallyText: {
    fontSize: 12,
    color: COLORS.secondary,
    marginTop: 4,
  },
  gameArea: {
    flex: 1,
    position: 'relative',
  },
  centerLine: {
    position: 'absolute',
    left: SCREEN_WIDTH / 2 - 1,
    top: 0,
    bottom: 0,
    width: 2,
    backgroundColor: COLORS.textSecondary,
    opacity: 0.2,
  },
  paddle: {
    position: 'absolute',
    width: GAME_CONFIG.PADDLE_WIDTH,
    height: GAME_CONFIG.PADDLE_HEIGHT,
    borderRadius: 6,
  },
  ball: {
    position: 'absolute',
    width: GAME_CONFIG.BALL_SIZE,
    height: GAME_CONFIG.BALL_SIZE,
    borderRadius: GAME_CONFIG.BALL_SIZE / 2,
    backgroundColor: COLORS.ball,
  },
  controls: {
    flexDirection: 'row',
    justifyContent: 'center',
    paddingVertical: 25,
    paddingBottom: 45,
    backgroundColor: 'rgba(0,0,0,0.3)',
  },
  controlButton: {
    width: 70,
    height: 70,
    borderRadius: 35,
    backgroundColor: COLORS.primary,
    justifyContent: 'center',
    alignItems: 'center',
    marginHorizontal: 15,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.3,
    shadowRadius: 4,
    elevation: 5,
  },
  gameOverContainer: {
    position: 'absolute',
    top: 0,
    left: 0,
    right: 0,
    bottom: 0,
    backgroundColor: 'rgba(0, 0, 0, 0.9)',
    justifyContent: 'center',
    alignItems: 'center',
  },
  gameOverModal: {
    backgroundColor: COLORS.background,
    padding: 40,
    borderRadius: 20,
    alignItems: 'center',
    borderWidth: 2,
    borderColor: COLORS.primary,
    minWidth: 300,
  },
  gameOverTitle: {
    fontSize: 32,
    fontWeight: 'bold',
    color: COLORS.text,
    marginTop: 20,
    marginBottom: 20,
    textAlign: 'center',
  },
  gameOverScore: {
    fontSize: 48,
    fontWeight: 'bold',
    color: COLORS.primary,
    marginBottom: 20,
  },
  coinsEarnedContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 30,
  },
  coinsEarned: {
    fontSize: 20,
    color: COLORS.accent,
    fontWeight: 'bold',
  },
  gameOverButtons: {
    width: '100%',
  },
  button: {
    padding: 16,
    borderRadius: 12,
    alignItems: 'center',
    marginBottom: 15,
  },
  primaryButton: {
    backgroundColor: COLORS.primary,
  },
  secondaryButton: {
    backgroundColor: COLORS.textSecondary,
  },
  buttonText: {
    fontSize: 18,
    fontWeight: 'bold',
    color: COLORS.text,
  },
  pauseContainer: {
    position: 'absolute',
    top: 0,
    left: 0,
    right: 0,
    bottom: 0,
    backgroundColor: 'rgba(0, 0, 0, 0.7)',
    justifyContent: 'center',
    alignItems: 'center',
  },
  pauseText: {
    fontSize: 48,
    fontWeight: 'bold',
    color: COLORS.text,
    letterSpacing: 4,
  },
  pauseSubtext: {
    fontSize: 16,
    color: COLORS.textSecondary,
    marginTop: 10,
  },
  serveIndicator: {
    position: 'absolute',
    top: '45%',
    left: 0,
    right: 0,
    alignItems: 'center',
    backgroundColor: 'rgba(0,0,0,0.7)',
    paddingVertical: 16,
    paddingHorizontal: 24,
    marginHorizontal: 40,
    borderRadius: 12,
  },
  serveText: {
    fontSize: 16,
    color: COLORS.primary,
    marginTop: 8,
    fontWeight: 'bold',
  },
  arrowControls: {
    position: 'absolute',
    bottom: 140,
    right: 20,
  },
  arrowControlsBottomLeft: {
    right: 'auto',
    left: 20,
  },
  arrowControlsTopRight: {
    bottom: 'auto',
    top: 140,
  },
  arrowControlsTopLeft: {
    bottom: 'auto',
    top: 140,
    right: 'auto',
    left: 20,
  },
  arrowButton: {
    width: 80,
    height: 80,
    borderRadius: 40,
    backgroundColor: COLORS.primary,
    justifyContent: 'center',
    alignItems: 'center',
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 3 },
    shadowOpacity: 0.4,
    shadowRadius: 6,
    elevation: 8,
    marginBottom: 12,
  },
  bottomBarControls: {
    position: 'absolute',
    bottom: 140,
    left: 0,
    right: 0,
    flexDirection: 'row',
    justifyContent: 'center',
    gap: 40,
  },
  bottomBarButton: {
    width: 80,
    height: 80,
    borderRadius: 40,
    backgroundColor: COLORS.primary,
    justifyContent: 'center',
    alignItems: 'center',
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 3 },
    shadowOpacity: 0.4,
    shadowRadius: 6,
    elevation: 8,
  },
  settingsOverlay: {
    position: 'absolute',
    top: 0,
    left: 0,
    right: 0,
    bottom: 0,
    backgroundColor: 'rgba(0, 0, 0, 0.85)',
    justifyContent: 'center',
    alignItems: 'center',
  },
  settingsModal: {
    width: '80%',
    backgroundColor: COLORS.background,
    borderRadius: 20,
    padding: 30,
    borderWidth: 2,
    borderColor: COLORS.primary,
  },
  closeButton: {
    position: 'absolute',
    top: 15,
    right: 15,
    zIndex: 10,
  },
  settingsTitle: {
    fontSize: 32,
    fontWeight: 'bold',
    color: COLORS.text,
    textAlign: 'center',
    marginBottom: 30,
    letterSpacing: 2,
  },
  settingsContent: {
    paddingVertical: 20,
  },
  settingsOption: {
    fontSize: 20,
    fontWeight: 'bold',
    color: COLORS.text,
    marginBottom: 12,
  },
  settingsDescription: {
    fontSize: 16,
    color: COLORS.textSecondary,
  },
  dropdownTrigger: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    padding: 16,
    paddingRight: 12,
    borderRadius: 12,
    backgroundColor: 'rgba(59, 130, 246, 0.15)',
    borderWidth: 1,
    borderColor: COLORS.primary,
  },
  dropdownText: {
    fontSize: 16,
    color: COLORS.text,
    fontWeight: '600',
    flex: 1,
    marginRight: 12,
  },
  dropdownMenu: {
    marginTop: 8,
    borderRadius: 12,
    backgroundColor: 'rgba(15, 23, 42, 0.95)',
    borderWidth: 1,
    borderColor: COLORS.primary,
    overflow: 'hidden',
  },
  dropdownItem: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    padding: 16,
    borderBottomWidth: 1,
    borderBottomColor: 'rgba(59, 130, 246, 0.2)',
  },
  dropdownItemActive: {
    backgroundColor: 'rgba(59, 130, 246, 0.2)',
  },
  dropdownItemText: {
    fontSize: 16,
    color: COLORS.textSecondary,
    fontWeight: '600',
  },
  dropdownItemTextActive: {
    color: COLORS.text,
    fontWeight: 'bold',
  },
  countdownOverlay: {
    position: 'absolute',
    top: 0,
    left: 0,
    right: 0,
    bottom: 0,
    backgroundColor: 'rgba(0, 0, 0, 0.5)',
    justifyContent: 'center',
    alignItems: 'center',
  },
  countdownText: {
    fontSize: 120,
    fontWeight: 'bold',
    color: COLORS.aiPaddle, // Red color
  },
});
