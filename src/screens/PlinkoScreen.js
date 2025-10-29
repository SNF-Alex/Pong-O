import React, { useState, useEffect, useRef } from 'react';
import { View, Text, StyleSheet, Animated, Dimensions, StatusBar } from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { COLORS } from '../constants/gameConfig';
import { rollLootBox, getSlotIndexForRarity } from '../config/lootBoxes';
import { RARITY_INFO, BALL_SKINS } from '../config/skins';

const { width: SCREEN_WIDTH, height: SCREEN_HEIGHT } = Dimensions.get('window');

const BOARD_WIDTH = SCREEN_WIDTH - 40;
const BOARD_HEIGHT = SCREEN_HEIGHT * 0.65;
const BALL_SIZE = 16;
const PEG_SIZE = 8;
const PEG_ROWS = 8;
const PEGS_PER_ROW_BASE = 7;
const SLOT_COUNT = 20; // Increased from 15 for better distribution
const SLOT_WIDTH = BOARD_WIDTH / SLOT_COUNT;

// Define slot rarities at module level so it's accessible everywhere
// Distribution: Common 64% (13 slots), Uncommon 20% (4 slots), Rare 10% (2 slots), Epic 5% (1 slot), Legendary 1% (1 slot)
const SLOT_RARITIES = [
  'common', 'uncommon', 'common', 'common', 'rare', 'common', 'common', 'uncommon', 'common', 'epic',
  'legendary',
  'common', 'uncommon', 'common', 'common', 'rare', 'common', 'common', 'uncommon', 'common'
];

export default function PlinkoScreen({ route, navigation }) {
  const { boxId } = route.params;
  
  const [reward, setReward] = useState(null);
  const [targetSlot, setTargetSlot] = useState(null);
  const [isDropping, setIsDropping] = useState(false);
  
  // Use ref to store reward so it's not lost during animation
  const rewardRef = useRef(null);
  
  const ballPosition = useRef(new Animated.ValueXY({ x: BOARD_WIDTH / 2, y: 0 })).current;
  const slotGlows = useRef(
    Array(SLOT_COUNT).fill(0).map(() => new Animated.Value(0))
  ).current;

  useEffect(() => {
    // Don't determine reward yet - let physics decide where ball lands first
    // Just start the drop animation
    setTimeout(() => {
      startDrop();
    }, 500);
  }, [boxId]);

  const startDrop = () => {
    setIsDropping(true);
    
    // Physics simulation variables
    let currentX = BOARD_WIDTH / 2;
    let currentY = 20;
    let velocityX = (Math.random() - 0.5) * 0.3; // Reduced from 0.5 - slower initial horizontal
    let velocityY = 0.2; // Reduced from 0.5 - slower start
    
    const gravity = 0.15; // Reduced from 0.3 - slower fall
    const restitution = 0.5; // Reduced from 0.6 - less bouncy, loses more energy
    const friction = 0.05; // Increased from 0.02 - more air resistance
    
    // Get peg positions
    const pegPositions = generatePegs();
    
    // Animation loop
    const physicsInterval = setInterval(() => {
      // Apply gravity
      velocityY += gravity;
      
      // Apply air resistance
      velocityX *= (1 - friction);
      velocityY *= (1 - friction * 0.5); // Less air resistance on Y
      
      // Update position
      currentX += velocityX;
      currentY += velocityY;
      
      // Check collision with each peg
      pegPositions.forEach((peg) => {
        const dx = currentX - peg.x;
        const dy = currentY - peg.y;
        const distance = Math.sqrt(dx * dx + dy * dy);
        const minDistance = (BALL_SIZE / 2) + (PEG_SIZE / 2);
        
        if (distance < minDistance) {
          // Collision detected - calculate bounce
          
          // Normalize collision vector
          const nx = dx / distance;
          const ny = dy / distance;
          
          // Separate ball from peg (prevent overlap)
          const overlap = minDistance - distance;
          currentX += nx * overlap;
          currentY += ny * overlap;
          
          // Calculate relative velocity
          const relativeVelocity = velocityX * nx + velocityY * ny;
          
          // Only bounce if moving toward the peg
          if (relativeVelocity < 0) {
            // Apply impulse (bounce)
            const impulse = -(1 + restitution) * relativeVelocity;
            velocityX += impulse * nx;
            velocityY += impulse * ny;
            
            // Add slight random deflection for variety
            velocityX += (Math.random() - 0.5) * 1.0; // Reduced from 1.5 - less random force
            
            // Extra damping on collision to slow it down
            velocityX *= 0.85;
            velocityY *= 0.85;
          }
        }
      });
      
      // Wall collision (left/right bounds)
      if (currentX - BALL_SIZE / 2 < 0) {
        currentX = BALL_SIZE / 2;
        velocityX = Math.abs(velocityX) * restitution;
      }
      if (currentX + BALL_SIZE / 2 > BOARD_WIDTH) {
        currentX = BOARD_WIDTH - BALL_SIZE / 2;
        velocityX = -Math.abs(velocityX) * restitution;
      }
      
      // Update ball position (smooth animation)
      ballPosition.setValue({ x: currentX, y: currentY });
      
      // Check if ball reached bottom
      if (currentY >= BOARD_HEIGHT - 65) {
        clearInterval(physicsInterval);
        
        // Determine which slot the ball actually landed in
        const actualSlotIndex = Math.floor(currentX / SLOT_WIDTH);
        const clampedSlotIndex = Math.max(0, Math.min(SLOT_COUNT - 1, actualSlotIndex));
        const finalX = (clampedSlotIndex + 0.5) * SLOT_WIDTH;
        
        // NOW determine reward based on where ball actually landed
        const landedRarity = SLOT_RARITIES[clampedSlotIndex];
        console.log('Ball landed in slot:', clampedSlotIndex, 'Rarity:', landedRarity);
        
        // Get random skin of that rarity
        const skinsOfRarity = Object.values(BALL_SKINS).filter(skin => skin.rarity === landedRarity);
        const randomSkin = skinsOfRarity[Math.floor(Math.random() * skinsOfRarity.length)];
        
        const actualReward = {
          skin: randomSkin,
          rarity: landedRarity,
        };
        
        setReward(actualReward);
        rewardRef.current = actualReward;
        
        // Snap to final slot position
        Animated.spring(ballPosition, {
          toValue: { x: finalX, y: BOARD_HEIGHT - 60 },
          tension: 50,
          friction: 8,
          useNativeDriver: false,
        }).start(() => {
          // Animate the slot that ball actually landed in
          Animated.sequence([
            Animated.timing(slotGlows[clampedSlotIndex], {
              toValue: 1,
              duration: 300,
              useNativeDriver: false,
            }),
            Animated.delay(500),
          ]).start(() => {
            // Navigate to reward reveal
            if (actualReward && actualReward.skin) {
              navigation.replace('RewardReveal', { 
                skin: actualReward.skin,
                rarity: actualReward.rarity,
              });
            } else {
              console.error('Reward is null when trying to navigate');
              navigation.goBack();
            }
          });
        });
      }
    }, 1000 / 60); // 60 FPS
  };

  // Generate peg positions in zigzag pattern
  const generatePegs = () => {
    const pegs = [];
    const startY = 80;
    const rowHeight = (BOARD_HEIGHT - 160) / PEG_ROWS;
    
    for (let row = 0; row < PEG_ROWS; row++) {
      const pegsInRow = PEGS_PER_ROW_BASE;
      const pegSpacing = BOARD_WIDTH / (pegsInRow + 1);
      
      // Offset every other row for zigzag pattern
      const offset = row % 2 === 0 ? 0 : pegSpacing / 2;
      
      for (let col = 0; col < pegsInRow; col++) {
        pegs.push({
          x: (col + 1) * pegSpacing + offset,
          y: startY + row * rowHeight,
        });
      }
    }
    
    return pegs;
  };

  const pegs = generatePegs();

  // Slot colors based on rarity (matches SLOT_RARITIES)
  const slotColors = [
    '#9CA3AF', '#10B981', '#9CA3AF', '#9CA3AF', '#3B82F6', '#9CA3AF', '#9CA3AF', '#10B981', '#9CA3AF', '#A855F7',
    '#F59E0B',
    '#9CA3AF', '#10B981', '#9CA3AF', '#9CA3AF', '#3B82F6', '#9CA3AF', '#9CA3AF', '#10B981', '#9CA3AF'
  ];

  return (
    <View style={styles.container}>
      <StatusBar barStyle="light-content" />
      
      {/* Title */}
      <View style={styles.header}>
        <Text style={styles.title}>OPENING BOX</Text>
        <Ionicons name="cube" size={24} color={COLORS.primary} />
      </View>

      {/* Plinko Board */}
      <View style={styles.board}>
        
        {/* Pegs */}
        {pegs.map((peg, index) => (
          <View
            key={index}
            style={[
              styles.peg,
              {
                left: peg.x - PEG_SIZE / 2,
                top: peg.y - PEG_SIZE / 2,
              },
            ]}
          />
        ))}

        {/* Animated Ball */}
        <Animated.View
          style={[
            styles.ball,
            {
              transform: [
                { translateX: ballPosition.x },
                { translateY: ballPosition.y },
              ],
            },
          ]}
        />

        {/* Slots at bottom */}
        <View style={styles.slotsContainer}>
          {slotColors.map((color, index) => {
            const glowOpacity = slotGlows[index];
            const rarityInfo = RARITY_INFO[SLOT_RARITIES[index]];
            
            return (
              <View key={index} style={styles.slotWrapper}>
                <Animated.View
                  style={[
                    styles.slot,
                    {
                      borderColor: color,
                      backgroundColor: glowOpacity.interpolate({
                        inputRange: [0, 1],
                        outputRange: [`rgba(255,255,255,0.05)`, rarityInfo.glowColor],
                      }),
                    },
                  ]}
                />
              </View>
            );
          })}
        </View>
      </View>

      {/* Loading text */}
      {isDropping && (
        <View style={styles.loadingContainer}>
          <Text style={styles.loadingText}>Determining your reward...</Text>
        </View>
      )}
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: COLORS.background,
    alignItems: 'center',
    paddingTop: 60,
  },
  header: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 12,
    marginBottom: 30,
  },
  title: {
    fontSize: 24,
    fontWeight: '600',
    color: COLORS.text,
    letterSpacing: 2,
  },
  board: {
    width: BOARD_WIDTH,
    height: BOARD_HEIGHT,
    backgroundColor: 'rgba(255, 255, 255, 0.03)',
    borderRadius: 20,
    borderWidth: 2,
    borderColor: 'rgba(59, 130, 246, 0.2)',
    position: 'relative',
    overflow: 'hidden',
  },
  peg: {
    position: 'absolute',
    width: PEG_SIZE,
    height: PEG_SIZE,
    borderRadius: PEG_SIZE / 2,
    backgroundColor: COLORS.primary,
    opacity: 0.6,
  },
  ball: {
    position: 'absolute',
    width: BALL_SIZE,
    height: BALL_SIZE,
    borderRadius: BALL_SIZE / 2,
    backgroundColor: COLORS.text,
    marginLeft: -BALL_SIZE / 2,
    marginTop: -BALL_SIZE / 2,
    shadowColor: COLORS.primary,
    shadowOffset: { width: 0, height: 0 },
    shadowOpacity: 0.8,
    shadowRadius: 8,
    elevation: 5,
  },
  slotsContainer: {
    position: 'absolute',
    bottom: 0,
    left: 0,
    right: 0,
    flexDirection: 'row',
    height: 50,
  },
  slotWrapper: {
    flex: 1,
    padding: 2,
  },
  slot: {
    flex: 1,
    borderWidth: 2,
    borderRadius: 4,
  },
  loadingContainer: {
    marginTop: 30,
  },
  loadingText: {
    fontSize: 14,
    color: COLORS.textSecondary,
    fontWeight: '500',
    letterSpacing: 1,
  },
});
