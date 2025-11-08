import React, { useState, useEffect, useRef } from 'react';
import {
  View,
  Text,
  StyleSheet,
  Dimensions,
  TouchableOpacity,
  StatusBar,
  PanResponder,
  Animated,
} from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { COLORS, GAME_CONFIG } from '../constants/gameConfig';
import {
  initializeGame,
  updateBall,
  updateAI,
  updatePlayerPaddle,
} from '../utils/gameEngine';
import { getEquippedBallSkin, getEquippedPaddleSkin, addCoins, getControlStyle, setControlStyle as saveControlStyle, getControlPosition, setControlPosition as saveControlPosition } from '../utils/storage';
import { useTheme } from '../contexts/ThemeContext';

const { width: SCREEN_WIDTH, height: SCREEN_HEIGHT } = Dimensions.get('window');

// Account for UI elements to get actual playable area
const SCORE_HEIGHT = 120;
const CONTROLS_HEIGHT = 140;
const PLAYABLE_HEIGHT = SCREEN_HEIGHT - SCORE_HEIGHT - CONTROLS_HEIGHT;

export default function GameScreen({ route, navigation, onNavigate, params }) {
  const difficulty = params?.difficulty || route?.params?.difficulty || 'medium';
  const { colors } = useTheme();
  
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
  
  // Ball skin state
  const [ballColor, setBallColor] = useState(COLORS.ball);
  const [ballSkin, setBallSkin] = useState(null);
  const rainbowIndexRef = useRef(0);
  const colorAnimValue = useRef(new Animated.Value(0)).current;

  // Paddle skin state
  const [paddleColor, setPaddleColor] = useState(COLORS.paddle);
  const [paddleSkin, setPaddleSkin] = useState(null);
  const paddleRainbowIndexRef = useRef(0);
  const paddleColorAnimValue = useRef(new Animated.Value(0)).current;

  // Load equipped ball skin on mount
  useEffect(() => {
    loadBallSkin();
    loadPaddleSkin();
    loadControlSettings();
  }, []);

  const loadControlSettings = async () => {
    const style = await getControlStyle();
    const position = await getControlPosition();
    setControlStyle(style);
    setControlPosition(position);
  };

  const loadBallSkin = async () => {
    const skin = await getEquippedBallSkin();
    setBallSkin(skin);
    if (!skin.animated) {
      setBallColor(skin.color);
    }
  };

  const loadPaddleSkin = async () => {
    const skin = await getEquippedPaddleSkin();
    setPaddleSkin(skin);
    if (!skin.animated) {
      setPaddleColor(skin.color);
    }
  };

  // Helper to interpolate between two hex colors
  const interpolateColor = (color1, color2, factor) => {
    const c1 = parseInt(color1.slice(1), 16);
    const c2 = parseInt(color2.slice(1), 16);
    
    const r1 = (c1 >> 16) & 255;
    const g1 = (c1 >> 8) & 255;
    const b1 = c1 & 255;
    
    const r2 = (c2 >> 16) & 255;
    const g2 = (c2 >> 8) & 255;
    const b2 = c2 & 255;
    
    const r = Math.round(r1 + (r2 - r1) * factor);
    const g = Math.round(g1 + (g2 - g1) * factor);
    const b = Math.round(b1 + (b2 - b1) * factor);
    
    return `#${((1 << 24) + (r << 16) + (g << 8) + b).toString(16).slice(1)}`;
  };

  // Rainbow animation effect with smooth transitions
  useEffect(() => {
    if (ballSkin?.animated && ballSkin?.colors) {
      const colors = ballSkin.colors;
      const animationSpeed = ballSkin.animationSpeed || 300;
      
      const animateToNextColor = () => {
        const currentIndex = rainbowIndexRef.current;
        const nextIndex = (currentIndex + 1) % colors.length;
        
        // Animate from 0 to 1
        Animated.timing(colorAnimValue, {
          toValue: 1,
          duration: animationSpeed,
          useNativeDriver: false,
        }).start(() => {
          // Update to next color and reset animation value
          rainbowIndexRef.current = nextIndex;
          colorAnimValue.setValue(0);
        });
      };
      
      // Set up listener to update color during animation
      const listenerId = colorAnimValue.addListener(({ value }) => {
        const currentIndex = rainbowIndexRef.current;
        const nextIndex = (currentIndex + 1) % colors.length;
        const interpolatedColor = interpolateColor(colors[currentIndex], colors[nextIndex], value);
        setBallColor(interpolatedColor);
      });
      
      // Start animation loop
      const interval = setInterval(animateToNextColor, animationSpeed);
      animateToNextColor(); // Start immediately
      
      return () => {
        clearInterval(interval);
        colorAnimValue.removeListener(listenerId);
      };
    }
  }, [ballSkin]);

  // Rainbow animation effect for paddle with smooth transitions
  useEffect(() => {
    if (paddleSkin?.animated && paddleSkin?.colors) {
      const colors = paddleSkin.colors;
      const animationSpeed = paddleSkin.animationSpeed || 300;
      
      const animateToNextColor = () => {
        const currentIndex = paddleRainbowIndexRef.current;
        const nextIndex = (currentIndex + 1) % colors.length;
        
        // Animate from 0 to 1
        Animated.timing(paddleColorAnimValue, {
          toValue: 1,
          duration: animationSpeed,
          useNativeDriver: false,
        }).start(() => {
          // Update to next color and reset animation value
          paddleRainbowIndexRef.current = nextIndex;
          paddleColorAnimValue.setValue(0);
        });
      };
      
      // Set up listener to update color during animation
      const listenerId = paddleColorAnimValue.addListener(({ value }) => {
        const currentIndex = paddleRainbowIndexRef.current;
        const nextIndex = (currentIndex + 1) % colors.length;
        const interpolatedColor = interpolateColor(colors[currentIndex], colors[nextIndex], value);
        setPaddleColor(interpolatedColor);
      });
      
      // Start animation loop
      const interval = setInterval(animateToNextColor, animationSpeed);
      animateToNextColor(); // Start immediately
      
      return () => {
        clearInterval(interval);
        paddleColorAnimValue.removeListener(listenerId);
      };
    }
  }, [paddleSkin]);

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

  // Save coins when game ends
  useEffect(() => {
    if (gameState.gameOver && gameState.totalCoins > 0) {
      addCoins(gameState.totalCoins);
    }
  }, [gameState.gameOver, gameState.totalCoins]);

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

  const goToMenu = async () => {
    // Save coins before leaving
    if (gameState.totalCoins > 0) {
      await addCoins(gameState.totalCoins);
    }
    
    if (onNavigate) {
      onNavigate('Menu');
    } else if (navigation) {
      navigation.goBack();
    }
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

  const selectPosition = async (position) => {
    setControlPosition(position);
    setShowPositionDropdown(false);
    await saveControlPosition(position);
  };

  const getStyleDisplayName = (style) => {
    return style === 'arrows' ? 'Arrow Buttons' : 'Drag';
  };

  const selectControlStyle = async (style) => {
    setControlStyle(style);
    setShowStyleDropdown(false);
    await saveControlStyle(style);
  };

  const styles = getStyles(colors);

  return (
    <View style={styles.container}>
      <StatusBar barStyle="light-content" />

      {/* Score Display */}
      <View style={styles.scoreContainer}>
        <View style={styles.scoreBox}>
          <Text style={styles.scoreLabel}>You</Text>
          <Text style={styles.scoreValue}>{gameState.score.player}</Text>
        </View>
        
        <View style={styles.centerInfo}>
          <Text style={styles.difficultyText}>{difficulty}</Text>
          <View style={styles.dividerSmall} />
          <View style={styles.statsRow}>
            <View style={styles.coinsRow}>
              <Ionicons name="cash-outline" size={14} color="#F59E0B" />
              <Text style={styles.coinsText}>{gameState.totalCoins}</Text>
            </View>
            {gameState.rallyCount > 0 && (
              <Text style={styles.rallyText}>x{gameState.rallyCount}</Text>
            )}
          </View>
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
              backgroundColor: paddleColor,
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
              backgroundColor: ballColor,
            },
          ]}
        >
          {ballSkin?.id === 'ball_dev_x' && (
            <>
              <View style={[styles.xLine, styles.xLine1, { backgroundColor: ballSkin.accentColor }]} />
              <View style={[styles.xLine, styles.xLine2, { backgroundColor: ballSkin.accentColor }]} />
            </>
          )}
        </View>
      </View>

      {/* Control Buttons */}
      <View style={styles.controls}>
        <TouchableOpacity style={styles.controlButton} onPress={goToMenu}>
          <Ionicons name="home" size={32} color={colors.primary} />
        </TouchableOpacity>
        <TouchableOpacity style={styles.controlButton} onPress={openSettings}>
          <Ionicons name="settings" size={32} color={colors.primary} />
        </TouchableOpacity>
      </View>

      {/* Game Over Modal */}
      {gameState.gameOver && (
        <View style={styles.gameOverContainer}>
          <View style={styles.gameOverModal}>
            <Ionicons 
              name={gameState.score.player > gameState.score.ai ? 'trophy' : 'sad'} 
              size={56} 
              color={gameState.score.player > gameState.score.ai ? '#F59E0B' : COLORS.aiPaddle} 
            />
            <Text style={styles.gameOverTitle}>
              {gameState.score.player > gameState.score.ai ? 'Victory' : 'Defeat'}
            </Text>
            <Text style={styles.gameOverScore}>
              {gameState.score.player} - {gameState.score.ai}
            </Text>
            {gameState.score.player > gameState.score.ai && (
              <View style={styles.coinsEarnedContainer}>
                <Ionicons name="cash-outline" size={18} color="#F59E0B" />
                <Text style={styles.coinsEarned}>{gameState.totalCoins}</Text>
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
          <Text style={styles.pauseText}>Paused</Text>
        </View>
      )}

      {/* Serve Indicator */}
      {!gameState.ballActive && !gameState.gameOver && (
        <View style={styles.serveIndicator}>
          <Text style={styles.serveText}>
            {gameState.serving === 'player' 
              ? (gameState.serveTimer < 60 
                  ? 'Get Ready' 
                  : 'Tap to Serve')
              : 'AI Serving'}
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

const getStyles = (colors) => StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: colors.background,
  },
  scoreContainer: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingHorizontal: 30,
    paddingTop: 60,
    paddingBottom: 20,
    backgroundColor: 'rgba(0,0,0,0.2)',
    borderBottomWidth: 1,
    borderBottomColor: 'rgba(59, 130, 246, 0.1)',
  },
  scoreBox: {
    alignItems: 'center',
    minWidth: 70,
  },
  scoreLabel: {
    fontSize: 12,
    color: colors.textSecondary,
    letterSpacing: 1,
    marginBottom: 6,
    fontWeight: '500',
    textTransform: 'capitalize',
  },
  scoreValue: {
    fontSize: 36,
    fontWeight: '300',
    color: colors.text,
    letterSpacing: 2,
  },
  centerInfo: {
    alignItems: 'center',
    gap: 8,
    minHeight: 70, // Fixed height to prevent growing
  },
  difficultyText: {
    fontSize: 11,
    color: colors.primary,
    fontWeight: '600',
    letterSpacing: 2,
    textTransform: 'uppercase',
  },
  dividerSmall: {
    width: 30,
    height: 1,
    backgroundColor: colors.primary,
    opacity: 0.3,
  },
  statsRow: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 8,
  },
  coinsRow: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: 'rgba(245, 158, 11, 0.15)',
    paddingHorizontal: 10,
    paddingVertical: 4,
    borderRadius: 12,
    gap: 4,
    borderWidth: 1,
    borderColor: 'rgba(245, 158, 11, 0.3)',
  },
  coinsText: {
    fontSize: 16,
    color: '#F59E0B',
    fontWeight: '700',
  },
  rallyText: {
    fontSize: 11,
    color: colors.primary,
    fontWeight: '600',
    letterSpacing: 1,
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
    backgroundColor: colors.primary,
    opacity: 0.1,
  },
  paddle: {
    position: 'absolute',
    width: GAME_CONFIG.PADDLE_WIDTH,
    height: GAME_CONFIG.PADDLE_HEIGHT,
    borderRadius: 8,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.5,
    shadowRadius: 4,
    elevation: 5,
  },
  ball: {
    position: 'absolute',
    width: GAME_CONFIG.BALL_SIZE,
    height: GAME_CONFIG.BALL_SIZE,
    borderRadius: GAME_CONFIG.BALL_SIZE / 2,
    alignItems: 'center',
    justifyContent: 'center',
    // backgroundColor set dynamically based on equipped skin
  },
  xLine: {
    position: 'absolute',
    width: 12,
    height: 2,
    borderRadius: 1,
  },
  xLine1: {
    transform: [{ rotate: '45deg' }],
  },
  xLine2: {
    transform: [{ rotate: '-45deg' }],
  },
  controls: {
    flexDirection: 'row',
    justifyContent: 'center',
    gap: 20,
    paddingVertical: 20,
    paddingBottom: 40,
    backgroundColor: 'rgba(0,0,0,0.2)',
    borderTopWidth: 1,
    borderTopColor: 'rgba(59, 130, 246, 0.1)',
  },
  controlButton: {
    width: 60,
    height: 60,
    borderRadius: 30,
    backgroundColor: 'rgba(59, 130, 246, 0.2)',
    justifyContent: 'center',
    alignItems: 'center',
    borderWidth: 1,
    borderColor: COLORS.primary,
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
    backgroundColor: colors.background,
    padding: 40,
    borderRadius: 20,
    alignItems: 'center',
    borderWidth: 1,
    borderColor: 'rgba(59, 130, 246, 0.3)',
    minWidth: 300,
  },
  gameOverTitle: {
    fontSize: 28,
    fontWeight: '300',
    color: colors.text,
    marginTop: 16,
    marginBottom: 12,
    textAlign: 'center',
    letterSpacing: 4,
  },
  gameOverScore: {
    fontSize: 42,
    fontWeight: '300',
    color: colors.primary,
    marginBottom: 20,
    letterSpacing: 8,
  },
  coinsEarnedContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: 'rgba(245, 158, 11, 0.15)',
    paddingHorizontal: 16,
    paddingVertical: 8,
    borderRadius: 20,
    gap: 6,
    marginBottom: 30,
    borderWidth: 1,
    borderColor: 'rgba(245, 158, 11, 0.3)',
  },
  coinsEarned: {
    fontSize: 22,
    color: '#F59E0B',
    fontWeight: '700',
  },
  gameOverButtons: {
    width: '100%',
    gap: 12,
  },
  button: {
    padding: 16,
    borderRadius: 12,
    alignItems: 'center',
    borderWidth: 1,
  },
  primaryButton: {
    backgroundColor: 'rgba(59, 130, 246, 0.2)',
    borderColor: colors.primary,
  },
  secondaryButton: {
    backgroundColor: 'transparent',
    borderColor: colors.textSecondary,
  },
  buttonText: {
    fontSize: 16,
    fontWeight: '600',
    color: colors.text,
    letterSpacing: 1,
  },
  pauseContainer: {
    position: 'absolute',
    top: 0,
    left: 0,
    right: 0,
    bottom: 0,
    backgroundColor: 'rgba(0, 0, 0, 0.8)',
    justifyContent: 'center',
    alignItems: 'center',
  },
  pauseText: {
    fontSize: 32,
    fontWeight: '300',
    color: colors.text,
    letterSpacing: 8,
  },
  serveIndicator: {
    position: 'absolute',
    top: '45%',
    left: 0,
    right: 0,
    alignItems: 'center',
    backgroundColor: 'rgba(0,0,0,0.8)',
    paddingVertical: 14,
    paddingHorizontal: 24,
    marginHorizontal: 50,
    borderRadius: 8,
    borderWidth: 1,
    borderColor: 'rgba(59, 130, 246, 0.3)',
  },
  serveText: {
    fontSize: 13,
    color: colors.textSecondary,
    fontWeight: '500',
    letterSpacing: 1,
    textTransform: 'uppercase',
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
    width: 60,
    height: 60,
    borderRadius: 30,
    backgroundColor: 'rgba(59, 130, 246, 0.2)',
    justifyContent: 'center',
    alignItems: 'center',
    borderWidth: 1,
    borderColor: colors.primary,
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
    width: 60,
    height: 60,
    borderRadius: 30,
    backgroundColor: 'rgba(59, 130, 246, 0.2)',
    justifyContent: 'center',
    alignItems: 'center',
    borderWidth: 1,
    borderColor: colors.primary,
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
    backgroundColor: colors.background,
    borderRadius: 20,
    padding: 30,
    borderWidth: 2,
    borderColor: colors.primary,
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
    color: colors.text,
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
    color: colors.text,
    marginBottom: 12,
  },
  settingsDescription: {
    fontSize: 16,
    color: colors.textSecondary,
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
    borderColor: colors.primary,
  },
  dropdownText: {
    fontSize: 16,
    color: colors.text,
    fontWeight: '600',
    flex: 1,
    marginRight: 12,
  },
  dropdownMenu: {
    marginTop: 8,
    borderRadius: 12,
    backgroundColor: 'rgba(15, 23, 42, 0.95)',
    borderWidth: 1,
    borderColor: colors.primary,
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
    color: colors.textSecondary,
    fontWeight: '600',
  },
  dropdownItemTextActive: {
    color: colors.text,
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
    color: colors.primary,
  },
});
