import React, { useEffect, useRef } from 'react';
import { View, Text, TouchableOpacity, StyleSheet, Animated, StatusBar } from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { COLORS } from '../constants/gameConfig';
import { RARITY_INFO } from '../config/skins';
import { unlockSkin, unlockPaddleSkin, unlockTheme } from '../utils/storage';

export default function RewardRevealScreen({ route, navigation, onNavigate, params }) {
  const skin = params?.skin || route?.params?.skin;
  const rarity = params?.rarity || route?.params?.rarity;
  const rarityInfo = RARITY_INFO[rarity];
  
  const scaleAnim = useRef(new Animated.Value(0)).current;
  const glowAnim = useRef(new Animated.Value(0)).current;
  const fadeAnim = useRef(new Animated.Value(0)).current;

  useEffect(() => {
    // Entrance animations
    Animated.sequence([
      Animated.parallel([
        Animated.spring(scaleAnim, {
          toValue: 1,
          tension: 50,
          friction: 7,
          useNativeDriver: true,
        }),
        Animated.timing(fadeAnim, {
          toValue: 1,
          duration: 500,
          useNativeDriver: true,
        }),
      ]),
      Animated.loop(
        Animated.sequence([
          Animated.timing(glowAnim, {
            toValue: 1,
            duration: 1000,
            useNativeDriver: true,
          }),
          Animated.timing(glowAnim, {
            toValue: 0,
            duration: 1000,
            useNativeDriver: true,
          }),
        ])
      ),
    ]).start();
  }, []);

  const handleCollect = async () => {
    // Save skin to AsyncStorage based on type
    if (skin.type === 'paddle') {
      await unlockPaddleSkin(skin.id);
      if (onNavigate) {
        onNavigate('Shop', { activeSection: 'paddles' });
      } else {
        navigation.navigate('Shop', { activeSection: 'paddles' });
      }
    } else if (skin.type === 'theme') {
      await unlockTheme(skin.id);
      if (onNavigate) {
        onNavigate('Shop', { activeSection: 'themes' });
      } else {
        navigation.navigate('Shop', { activeSection: 'themes' });
      }
    } else {
      await unlockSkin(skin.id);
      if (onNavigate) {
        onNavigate('Shop', { activeSection: 'balls' });
      } else {
        navigation.navigate('Shop', { activeSection: 'balls' });
      }
    }
  };

  const handleViewBackpack = async () => {
    // Save skin to AsyncStorage first
    if (skin.type === 'paddle') {
      await unlockPaddleSkin(skin.id);
      if (onNavigate) {
        onNavigate('Backpack', { activeSection: 'paddles' });
      } else {
        navigation.navigate('Backpack', { activeSection: 'paddles' });
      }
    } else if (skin.type === 'theme') {
      await unlockTheme(skin.id);
      if (onNavigate) {
        onNavigate('Backpack', { activeSection: 'themes' });
      } else {
        navigation.navigate('Backpack', { activeSection: 'themes' });
      }
    } else {
      await unlockSkin(skin.id);
      if (onNavigate) {
        onNavigate('Backpack', { activeSection: 'balls' });
      } else {
        navigation.navigate('Backpack', { activeSection: 'balls' });
      }
    }
  };

  // Get display color for the ball or paddle preview
  const getBallColor = () => {
    if (skin.animated) {
      return skin.colors[0]; // Show first color for rainbow
    }
    return skin.color;
  };

  return (
    <View style={styles.container}>
      <StatusBar barStyle="light-content" />
      
      {/* Rarity Badge */}
      <Animated.View
        style={[
          styles.rarityBadge,
          {
            backgroundColor: rarityInfo.glowColor,
            borderColor: rarityInfo.color,
            opacity: fadeAnim,
            transform: [{ translateY: fadeAnim.interpolate({
              inputRange: [0, 1],
              outputRange: [-20, 0],
            })}],
          },
        ]}
      >
        <Text style={[styles.rarityText, { color: rarityInfo.color }]}>
          {rarityInfo.label.toUpperCase()}
        </Text>
      </Animated.View>

      {/* Skin Preview */}
      <Animated.View
        style={[
          styles.skinPreviewContainer,
          {
            transform: [{ scale: scaleAnim }],
          },
        ]}
      >
        {/* Glow effect */}
        <Animated.View
          style={[
            styles.glow,
            {
              backgroundColor: rarityInfo.color,
              opacity: glowAnim.interpolate({
                inputRange: [0, 1],
                outputRange: [0.2, 0.5],
              }),
              transform: [{
                scale: glowAnim.interpolate({
                  inputRange: [0, 1],
                  outputRange: [1, 1.2],
                }),
              }],
            },
          ]}
        />
        
        {/* Skin preview - Ball, Paddle, or Theme */}
        {skin.type === 'paddle' ? (
          <View
            style={[
              styles.paddlePreview,
              { backgroundColor: getBallColor() },
            ]}
          >
            {skin.animated && (
              <Ionicons name="color-palette" size={24} color="#FFF" />
            )}
          </View>
        ) : skin.type === 'theme' ? (
          <View style={styles.themePreview}>
            <View style={[styles.themeColorRow, { backgroundColor: skin.colors.background }]}>
              <View style={[styles.themeColorDot, { backgroundColor: skin.colors.primary }]} />
              <View style={[styles.themeColorDot, { backgroundColor: skin.colors.secondary }]} />
            </View>
            <View style={styles.themeColorRow}>
              <View style={[styles.themeColorDot, { backgroundColor: skin.colors.accent }]} />
              <View style={[styles.themeColorDot, { backgroundColor: skin.colors.surface }]} />
            </View>
            {skin.animated && (
              <View style={styles.themeAnimatedOverlay}>
                <Ionicons name="color-palette" size={32} color="#FFF" />
              </View>
            )}
          </View>
        ) : (
          <View
            style={[
              styles.ballPreview,
              { backgroundColor: getBallColor() },
            ]}
          >
            {skin.animated && (
              <Ionicons name="color-palette" size={40} color="#FFF" />
            )}
          </View>
        )}
      </Animated.View>

      {/* Skin Name */}
      <Animated.Text
        style={[
          styles.skinName,
          {
            opacity: fadeAnim,
            transform: [{ translateY: fadeAnim.interpolate({
              inputRange: [0, 1],
              outputRange: [20, 0],
            })}],
          },
        ]}
      >
        {skin.name}
      </Animated.Text>

      {/* Special indicator for animated skins */}
      {skin.animated && (
        <Animated.View
          style={[
            styles.specialBadge,
            {
              opacity: fadeAnim,
            },
          ]}
        >
          <Ionicons name="sparkles" size={16} color="#F59E0B" />
          <Text style={styles.specialText}>Animated Effect</Text>
        </Animated.View>
      )}

      {/* Buttons */}
      <Animated.View
        style={[
          styles.buttonsContainer,
          {
            opacity: fadeAnim,
          },
        ]}
      >
        <TouchableOpacity
          style={[styles.button, styles.primaryButton]}
          onPress={handleCollect}
          activeOpacity={0.8}
        >
          <Ionicons name="checkmark-circle" size={24} color="#000" />
          <Text style={styles.primaryButtonText}>COLLECT</Text>
        </TouchableOpacity>

        <TouchableOpacity
          style={[styles.button, styles.secondaryButton]}
          onPress={handleViewBackpack}
          activeOpacity={0.8}
        >
          <Ionicons name="bag-outline" size={24} color={COLORS.text} />
          <Text style={styles.secondaryButtonText}>VIEW BACKPACK</Text>
        </TouchableOpacity>
      </Animated.View>

      {/* Drop rate info */}
      <Animated.View
        style={[
          styles.infoContainer,
          {
            opacity: fadeAnim,
          },
        ]}
      >
        <Ionicons name="information-circle-outline" size={16} color={COLORS.textSecondary} />
        <Text style={styles.infoText}>
          {rarityInfo.dropRate}% drop rate
        </Text>
      </Animated.View>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: COLORS.background,
    alignItems: 'center',
    justifyContent: 'center',
    padding: 20,
  },
  rarityBadge: {
    paddingHorizontal: 24,
    paddingVertical: 8,
    borderRadius: 20,
    borderWidth: 2,
    marginBottom: 40,
  },
  rarityText: {
    fontSize: 14,
    fontWeight: '700',
    letterSpacing: 2,
  },
  skinPreviewContainer: {
    position: 'relative',
    marginBottom: 30,
  },
  glow: {
    position: 'absolute',
    width: 200,
    height: 200,
    borderRadius: 100,
    top: -25,
    left: -25,
  },
  ballPreview: {
    width: 150,
    height: 150,
    borderRadius: 75,
    alignItems: 'center',
    justifyContent: 'center',
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 10 },
    shadowOpacity: 0.5,
    shadowRadius: 20,
    elevation: 10,
  },
  paddlePreview: {
    width: 150,
    height: 40,
    borderRadius: 8,
    alignItems: 'center',
    justifyContent: 'center',
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 10 },
    shadowOpacity: 0.5,
    shadowRadius: 20,
    elevation: 10,
  },
  themePreview: {
    width: 150,
    height: 120,
    borderRadius: 12,
    overflow: 'hidden',
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 10 },
    shadowOpacity: 0.5,
    shadowRadius: 20,
    elevation: 10,
    position: 'relative',
  },
  themeColorRow: {
    flex: 1,
    flexDirection: 'row',
    gap: 3,
  },
  themeColorDot: {
    flex: 1,
    height: '100%',
  },
  themeAnimatedOverlay: {
    position: 'absolute',
    top: 0,
    left: 0,
    right: 0,
    bottom: 0,
    alignItems: 'center',
    justifyContent: 'center',
    backgroundColor: 'rgba(0, 0, 0, 0.3)',
  },
  skinName: {
    fontSize: 32,
    fontWeight: '600',
    color: COLORS.text,
    letterSpacing: 1,
    marginBottom: 12,
  },
  specialBadge: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 6,
    backgroundColor: 'rgba(245, 158, 11, 0.15)',
    paddingHorizontal: 16,
    paddingVertical: 8,
    borderRadius: 16,
    borderWidth: 1,
    borderColor: 'rgba(245, 158, 11, 0.3)',
    marginBottom: 40,
  },
  specialText: {
    fontSize: 12,
    color: '#F59E0B',
    fontWeight: '600',
    letterSpacing: 0.5,
  },
  buttonsContainer: {
    width: '100%',
    gap: 12,
    marginTop: 20,
  },
  button: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    paddingVertical: 16,
    borderRadius: 16,
    gap: 8,
  },
  primaryButton: {
    backgroundColor: COLORS.primary,
  },
  primaryButtonText: {
    fontSize: 18,
    fontWeight: '700',
    color: '#000',
    letterSpacing: 1,
  },
  secondaryButton: {
    backgroundColor: 'rgba(255, 255, 255, 0.05)',
    borderWidth: 2,
    borderColor: 'rgba(59, 130, 246, 0.3)',
  },
  secondaryButtonText: {
    fontSize: 16,
    fontWeight: '600',
    color: COLORS.text,
    letterSpacing: 0.5,
  },
  infoContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 6,
    marginTop: 30,
  },
  infoText: {
    fontSize: 12,
    color: COLORS.textSecondary,
    fontWeight: '500',
  },
});
