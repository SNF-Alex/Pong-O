import React, { useState, useEffect } from 'react';
import { View, Text, TouchableOpacity, StyleSheet, StatusBar } from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { COLORS } from '../constants/gameConfig';
import { useAuth } from '../contexts/AuthContext';
import { getCoins, getUnlockedSkins, getUnlockedPaddleSkins, getUnlockedThemes } from '../utils/storage';

const HINTS = [
  "Rally bonus: +10 coins every 5 hits!",
  "You can get different skins by opening a box in the shop",
  "The harder the AI, the more Coins you receive",
  "Sign in to protect your progress across devices",
  "Legendary themes have customizable color variants"
];

export default function MenuScreen({ navigation, onNavigate }) {
  const [expandedMode, setExpandedMode] = useState(null);
  const [showSignInBanner, setShowSignInBanner] = useState(false);
  const [coins, setCoins] = useState(0);
  const [currentHintIndex, setCurrentHintIndex] = useState(0);
  const { user, isSignedIn } = useAuth();

  useEffect(() => {
    loadCoins();
    checkIfShouldShowBanner();
  }, []);

  // Reload coins when screen is focused
  useEffect(() => {
    const interval = setInterval(loadCoins, 1000); // Refresh coins every second
    return () => clearInterval(interval);
  }, []);

  // Rotate hints every 5 seconds
  useEffect(() => {
    const interval = setInterval(() => {
      setCurrentHintIndex((prev) => (prev + 1) % HINTS.length);
    }, 5000);
    return () => clearInterval(interval);
  }, []);

  const loadCoins = async () => {
    const currentCoins = await getCoins();
    setCoins(currentCoins);
  };

  const checkIfShouldShowBanner = async () => {
    if (isSignedIn) {
      setShowSignInBanner(false);
      return;
    }

    // Check if user has significant progress
    const coins = await getCoins();
    const unlockedSkins = await getUnlockedSkins();
    const unlockedPaddles = await getUnlockedPaddleSkins();
    const unlockedThemes = await getUnlockedThemes();

    const totalUnlocked = unlockedSkins.length + unlockedPaddles.length + unlockedThemes.length;

    // Show banner if user has coins > 50 or has unlocked more than 5 items
    if (coins > 50 || totalUnlocked > 5) {
      setShowSignInBanner(true);
    }
  };

  const startGame = (difficulty) => {
    onNavigate('Game', { difficulty });
  };

  const toggleMode = (mode) => {
    setExpandedMode(expandedMode === mode ? null : mode);
  };

  return (
    <View style={styles.container}>
      <StatusBar barStyle="light-content" />
      
      {/* Header */}
      <View style={styles.header}>
        <Text style={styles.title}>PONG-O</Text>
        <View style={styles.divider} />
        <Text style={styles.subtitle}>Choose Your Challenge</Text>
      </View>

      {/* Sign-in Banner */}
      {showSignInBanner && (
        <View style={styles.signInBanner}>
          <View style={styles.signInBannerContent}>
            <Ionicons name="cloud-upload-outline" size={24} color={COLORS.primary} />
            <View style={styles.signInTextContainer}>
              <Text style={styles.signInBannerTitle}>Protect Your Progress</Text>
              <Text style={styles.signInBannerSubtitle}>
                Sign in to save your data across devices
              </Text>
            </View>
          </View>
          <View style={styles.signInBannerButtons}>
            <TouchableOpacity 
              style={styles.signInButton}
              onPress={() => onNavigate('SignIn')}
            >
              <Text style={styles.signInButtonText}>Sign In</Text>
            </TouchableOpacity>
            <TouchableOpacity 
              style={styles.dismissButton}
              onPress={() => setShowSignInBanner(false)}
            >
              <Text style={styles.dismissButtonText}>Later</Text>
            </TouchableOpacity>
          </View>
        </View>
      )}

      {/* Game Modes */}
      <View style={styles.modesContainer}>
        
        {/* Pong Classic Mode */}
        <View style={styles.modeCard}>
          <TouchableOpacity
            style={styles.modeHeader}
            onPress={() => toggleMode('classic')}
            activeOpacity={0.7}
          >
            <View style={styles.modeHeaderContent}>
              <View style={styles.modeTitleRow}>
                <Ionicons name="baseball" size={28} color={COLORS.primary} />
                <Text style={styles.modeTitle}>Pong Classic</Text>
              </View>
              <Ionicons 
                name={expandedMode === 'classic' ? 'chevron-up' : 'chevron-down'} 
                size={24} 
                color={COLORS.textSecondary} 
              />
            </View>
            <Text style={styles.modeDescription}>Traditional Pong vs AI</Text>
          </TouchableOpacity>

          {/* Difficulty Options */}
          {expandedMode === 'classic' && (
            <View style={styles.difficultyContainer}>
              <TouchableOpacity
                style={[styles.difficultyButton, styles.easyButton]}
                onPress={() => startGame('EASY')}
              >
                <View style={styles.difficultyContent}>
                  <View style={styles.difficultyHeader}>
                    <Ionicons name="happy-outline" size={24} color="#10B981" />
                    <Text style={styles.difficultyText}>Easy</Text>
                  </View>
                  <View style={styles.coinReward}>
                    <Ionicons name="disc" size={14} color="#F59E0B" />
                    <Text style={styles.coinText}>10</Text>
                  </View>
                </View>
              </TouchableOpacity>

              <TouchableOpacity
                style={[styles.difficultyButton, styles.mediumButton]}
                onPress={() => startGame('MEDIUM')}
              >
                <View style={styles.difficultyContent}>
                  <View style={styles.difficultyHeader}>
                    <Ionicons name="flame-outline" size={24} color="#3B82F6" />
                    <Text style={styles.difficultyText}>Medium</Text>
                  </View>
                  <View style={styles.coinReward}>
                    <Ionicons name="disc" size={14} color="#F59E0B" />
                    <Text style={styles.coinText}>50</Text>
                  </View>
                </View>
              </TouchableOpacity>

              <TouchableOpacity
                style={[styles.difficultyButton, styles.hardButton]}
                onPress={() => startGame('HARD')}
              >
                <View style={styles.difficultyContent}>
                  <View style={styles.difficultyHeader}>
                    <Ionicons name="skull-outline" size={24} color="#EF4444" />
                    <Text style={styles.difficultyText}>Hard</Text>
                  </View>
                  <View style={styles.coinReward}>
                    <Ionicons name="disc" size={14} color="#F59E0B" />
                    <Text style={styles.coinText}>100</Text>
                  </View>
                </View>
              </TouchableOpacity>
            </View>
          )}
        </View>

        {/* Placeholder for future game modes */}
        <View style={[styles.modeCard, styles.comingSoonCard]}>
          <View style={styles.modeHeader}>
            <View style={styles.modeHeaderContent}>
              <View style={styles.modeTitleRow}>
                <Ionicons name="lock-closed" size={28} color={COLORS.textSecondary} />
                <Text style={[styles.modeTitle, styles.comingSoonText]}>More Modes</Text>
              </View>
            </View>
            <Text style={[styles.modeDescription, styles.comingSoonText]}>Coming Soon...</Text>
          </View>
        </View>

      </View>

      {/* Coins Display Above Tab Bar */}
      <View style={styles.coinsContainer}>
        <View style={styles.coinsDisplay}>
          <Ionicons name="disc" size={22} color="#F59E0B" />
          <Text style={styles.coinsAmount}>{coins}</Text>
        </View>
      </View>

      {/* Footer Tip */}
      <View style={styles.footer}>
        <View style={styles.tipContainer}>
          <Ionicons name="bulb" size={18} color={COLORS.primary} />
          <Text style={styles.tipText}>{HINTS[currentHintIndex]}</Text>
        </View>
      </View>

      {/* Bottom Navigation */}
      <View style={styles.bottomNav}>
        <TouchableOpacity
          style={styles.navButton}
          onPress={() => onNavigate('Shop')}
          activeOpacity={0.7}
        >
          <Ionicons name="storefront-outline" size={28} color={COLORS.primary} />
          <Text style={styles.navLabel}>Shop</Text>
        </TouchableOpacity>

        <TouchableOpacity
          style={styles.navButton}
          onPress={() => onNavigate('Backpack')}
          activeOpacity={0.7}
        >
          <Ionicons name="bag-outline" size={28} color={COLORS.primary} />
          <Text style={styles.navLabel}>Backpack</Text>
        </TouchableOpacity>

        <TouchableOpacity
          style={styles.navButton}
          onPress={() => onNavigate('Help')}
          activeOpacity={0.7}
        >
          <Ionicons name="help-circle-outline" size={28} color={COLORS.primary} />
          <Text style={styles.navLabel}>Help</Text>
        </TouchableOpacity>
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: COLORS.background,
    paddingTop: 60,
    paddingBottom: 30,
  },
  header: {
    alignItems: 'center',
    paddingHorizontal: 30,
    marginBottom: 40,
  },
  title: {
    fontSize: 48,
    fontWeight: '300',
    color: COLORS.text,
    letterSpacing: 12,
  },
  divider: {
    width: 60,
    height: 3,
    backgroundColor: COLORS.primary,
    marginBottom: 16,
    borderRadius: 2,
  },
  subtitle: {
    fontSize: 14,
    color: COLORS.textSecondary,
    letterSpacing: 2,
    textTransform: 'uppercase',
    fontWeight: '500',
  },
  modesContainer: {
    flex: 1,
    paddingHorizontal: 20,
  },
  modeCard: {
    backgroundColor: 'rgba(255, 255, 255, 0.05)',
    borderRadius: 16,
    marginBottom: 16,
    borderWidth: 1,
    borderColor: 'rgba(59, 130, 246, 0.2)',
    overflow: 'hidden',
  },
  comingSoonCard: {
    opacity: 0.5,
    borderColor: 'rgba(148, 163, 184, 0.2)',
  },
  modeHeader: {
    padding: 20,
  },
  modeHeaderContent: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 8,
  },
  modeTitleRow: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 12,
  },
  modeTitle: {
    fontSize: 24,
    fontWeight: '600',
    color: COLORS.text,
    letterSpacing: 1,
  },
  comingSoonText: {
    color: COLORS.textSecondary,
  },
  modeDescription: {
    fontSize: 13,
    color: COLORS.textSecondary,
    marginLeft: 40,
    fontWeight: '400',
  },
  difficultyContainer: {
    paddingHorizontal: 20,
    paddingBottom: 20,
    gap: 12,
  },
  difficultyButton: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    padding: 16,
    borderRadius: 12,
    borderWidth: 2,
    borderLeftWidth: 6,
  },
  easyButton: {
    backgroundColor: 'rgba(16, 185, 129, 0.1)',
    borderColor: '#10B981',
  },
  mediumButton: {
    backgroundColor: 'rgba(59, 130, 246, 0.1)',
    borderColor: '#3B82F6',
  },
  hardButton: {
    backgroundColor: 'rgba(239, 68, 68, 0.1)',
    borderColor: '#EF4444',
  },
  difficultyContent: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    flex: 1,
  },
  difficultyHeader: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 12,
  },
  difficultyText: {
    fontSize: 18,
    fontWeight: '600',
    color: COLORS.text,
    letterSpacing: 0.5,
  },
  coinReward: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: 'rgba(245, 158, 11, 0.15)',
    paddingHorizontal: 12,
    paddingVertical: 6,
    borderRadius: 20,
    gap: 4,
    borderWidth: 1,
    borderColor: 'rgba(245, 158, 11, 0.3)',
  },
  coinText: {
    fontSize: 16,
    fontWeight: '700',
    color: '#F59E0B',
  },
  coinsContainer: {
    alignItems: 'center',
    paddingHorizontal: 30,
    marginBottom: 16,
  },
  coinsDisplay: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: 'rgba(245, 158, 11, 0.15)',
    paddingHorizontal: 18,
    paddingVertical: 10,
    borderRadius: 24,
    gap: 8,
    borderWidth: 1.5,
    borderColor: 'rgba(245, 158, 11, 0.4)',
    shadowColor: '#F59E0B',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.3,
    shadowRadius: 4,
    elevation: 4,
  },
  coinsAmount: {
    fontSize: 20,
    fontWeight: '700',
    color: '#F59E0B',
    letterSpacing: 1,
  },
  footer: {
    paddingHorizontal: 30,
    paddingTop: 20,
    marginBottom: 16,
  },
  tipContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    backgroundColor: 'rgba(59, 130, 246, 0.08)',
    paddingVertical: 12,
    paddingHorizontal: 16,
    borderRadius: 10,
    gap: 8,
    minHeight: 44,
  },
  tipText: {
    fontSize: 13,
    color: COLORS.textSecondary,
    fontWeight: '500',
    flex: 1,
    textAlign: 'center',
  },
  signInBanner: {
    marginHorizontal: 20,
    marginTop: 10,
    marginBottom: 20,
    backgroundColor: 'rgba(59, 130, 246, 0.1)',
    borderRadius: 16,
    padding: 16,
    borderWidth: 1,
    borderColor: 'rgba(59, 130, 246, 0.3)',
  },
  signInBannerContent: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 12,
    marginBottom: 12,
  },
  signInTextContainer: {
    flex: 1,
  },
  signInBannerTitle: {
    fontSize: 16,
    fontWeight: '700',
    color: COLORS.text,
    marginBottom: 4,
  },
  signInBannerSubtitle: {
    fontSize: 13,
    color: COLORS.textSecondary,
    fontWeight: '500',
  },
  signInBannerButtons: {
    flexDirection: 'row',
    gap: 10,
  },
  signInButton: {
    flex: 1,
    backgroundColor: COLORS.primary,
    paddingVertical: 12,
    borderRadius: 10,
    alignItems: 'center',
  },
  signInButtonText: {
    fontSize: 14,
    fontWeight: '700',
    color: '#FFFFFF',
  },
  dismissButton: {
    paddingVertical: 12,
    paddingHorizontal: 20,
    borderRadius: 10,
    alignItems: 'center',
    borderWidth: 1,
    borderColor: 'rgba(255, 255, 255, 0.2)',
  },
  dismissButtonText: {
    fontSize: 14,
    fontWeight: '600',
    color: COLORS.textSecondary,
  },
  bottomNav: {
    flexDirection: 'row',
    justifyContent: 'space-around',
    paddingHorizontal: 20,
    paddingVertical: 16,
    marginHorizontal: 16,
    marginBottom: 20,
    borderRadius: 50,
    borderWidth: 1,
    borderColor: 'rgba(59, 130, 246, 0.15)',
    backgroundColor: 'rgba(0, 0, 0, 0.5)',
    shadowColor: '#3B82F6',
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.2,
    shadowRadius: 8,
    elevation: 8,
  },
  navButton: {
    alignItems: 'center',
    gap: 6,
    flex: 1,
  },
  navLabel: {
    fontSize: 12,
    color: COLORS.textSecondary,
    fontWeight: '500',
    letterSpacing: 0.5,
  },
});
