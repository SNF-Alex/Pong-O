import React, { useState, useEffect } from 'react';
import { View, Text, TouchableOpacity, StyleSheet, StatusBar, ScrollView, Alert } from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { COLORS } from '../constants/gameConfig';
import { BALL_SKINS, RARITY_INFO } from '../config/skins';
import { getUnlockedSkins, getEquippedBall, equipBall } from '../utils/storage';

export default function BackpackScreen({ navigation }) {
  const [unlockedSkinIds, setUnlockedSkinIds] = useState([]);
  const [equippedBallId, setEquippedBallId] = useState('ball_red');
  const [loading, setLoading] = useState(true);

  // Load data when component mounts
  useEffect(() => {
    loadInventory();
  }, []);

  const loadInventory = async () => {
    setLoading(true);
    try {
      const unlocked = await getUnlockedSkins();
      const equipped = await getEquippedBall();
      setUnlockedSkinIds(unlocked);
      setEquippedBallId(equipped);
    } catch (error) {
      console.error('Error loading inventory:', error);
    } finally {
      setLoading(false);
    }
  };

  const handleEquipSkin = async (skinId) => {
    const success = await equipBall(skinId);
    if (success) {
      setEquippedBallId(skinId);
      Alert.alert('Equipped!', `${BALL_SKINS[skinId].name} is now equipped.`);
    } else {
      Alert.alert('Error', 'Failed to equip skin. Make sure it is unlocked.');
    }
  };

  const renderSkinCard = (skin) => {
    const isUnlocked = unlockedSkinIds.includes(skin.id);
    const isEquipped = equippedBallId === skin.id;
    const rarityInfo = RARITY_INFO[skin.rarity];

    return (
      <TouchableOpacity
        key={skin.id}
        style={[
          styles.skinCard,
          isEquipped && styles.equippedCard,
          !isUnlocked && styles.lockedCard,
        ]}
        onPress={() => isUnlocked && handleEquipSkin(skin.id)}
        disabled={!isUnlocked}
        activeOpacity={0.7}
      >
        {/* Equipped Badge */}
        {isEquipped && (
          <View style={styles.equippedBadge}>
            <Ionicons name="checkmark-circle" size={16} color="#10B981" />
            <Text style={styles.equippedText}>EQUIPPED</Text>
          </View>
        )}

        {/* Lock Icon for locked skins */}
        {!isUnlocked && (
          <View style={styles.lockOverlay}>
            <Ionicons name="lock-closed" size={32} color={COLORS.textSecondary} />
          </View>
        )}

        {/* Ball Preview */}
        <View
          style={[
            styles.ballPreview,
            {
              backgroundColor: skin.animated ? skin.colors[0] : skin.color,
              opacity: isUnlocked ? 1 : 0.3,
            },
          ]}
        >
          {skin.animated && (
            <Ionicons name="color-palette" size={24} color="#FFF" />
          )}
        </View>

        {/* Skin Name */}
        <Text style={[styles.skinName, !isUnlocked && styles.lockedText]}>
          {skin.name}
        </Text>

        {/* Rarity Badge */}
        <View
          style={[
            styles.rarityBadge,
            { backgroundColor: rarityInfo.glowColor, borderColor: rarityInfo.color },
          ]}
        >
          <Text style={[styles.rarityText, { color: rarityInfo.color }]}>
            {rarityInfo.label}
          </Text>
        </View>
      </TouchableOpacity>
    );
  };

  const allSkins = Object.values(BALL_SKINS);
  const unlockedSkins = allSkins.filter(skin => unlockedSkinIds.includes(skin.id));
  const lockedSkins = allSkins.filter(skin => !unlockedSkinIds.includes(skin.id));

  return (
    <View style={styles.container}>
      <StatusBar barStyle="light-content" />
      
      {/* Header */}
      <View style={styles.header}>
        <TouchableOpacity
          style={styles.backButton}
          onPress={() => navigation.goBack()}
        >
          <Ionicons name="arrow-back" size={24} color={COLORS.text} />
        </TouchableOpacity>
        
        <View style={styles.headerContent}>
          <Text style={styles.title}>BACKPACK</Text>
          <View style={styles.divider} />
          <Text style={styles.subtitle}>
            {unlockedSkins.length} / {allSkins.length} Unlocked
          </Text>
        </View>

        <View style={styles.backButton} />
      </View>

      <ScrollView 
        style={styles.content}
        contentContainerStyle={styles.contentContainer}
      >
        {loading ? (
          <View style={styles.loadingContainer}>
            <Text style={styles.loadingText}>Loading inventory...</Text>
          </View>
        ) : (
          <>
            {/* Unlocked Section */}
            {unlockedSkins.length > 0 && (
              <>
                <Text style={styles.sectionTitle}>YOUR SKINS</Text>
                <View style={styles.skinsGrid}>
                  {unlockedSkins.map(renderSkinCard)}
                </View>
              </>
            )}

            {/* Locked Section */}
            {lockedSkins.length > 0 && (
              <>
                <Text style={styles.sectionTitle}>LOCKED</Text>
                <View style={styles.skinsGrid}>
                  {lockedSkins.map(renderSkinCard)}
                </View>
              </>
            )}
          </>
        )}

        {/* Tip */}
        <View style={styles.tipContainer}>
          <Ionicons name="information-circle-outline" size={18} color={COLORS.primary} />
          <Text style={styles.tipText}>
            Open loot boxes in the shop to unlock more skins!
          </Text>
        </View>
      </ScrollView>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: COLORS.background,
  },
  header: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    paddingTop: 60,
    paddingBottom: 20,
    paddingHorizontal: 20,
  },
  backButton: {
    width: 40,
    height: 40,
    alignItems: 'center',
    justifyContent: 'center',
  },
  headerContent: {
    flex: 1,
    alignItems: 'center',
  },
  title: {
    fontSize: 32,
    fontWeight: '300',
    color: COLORS.text,
    letterSpacing: 8,
    marginBottom: 6,
  },
  divider: {
    width: 40,
    height: 2,
    backgroundColor: COLORS.primary,
    marginBottom: 8,
    borderRadius: 2,
  },
  subtitle: {
    fontSize: 11,
    color: COLORS.textSecondary,
    letterSpacing: 1.5,
    textTransform: 'uppercase',
    fontWeight: '500',
  },
  content: {
    flex: 1,
  },
  contentContainer: {
    padding: 20,
  },
  loadingContainer: {
    padding: 40,
    alignItems: 'center',
  },
  loadingText: {
    fontSize: 14,
    color: COLORS.textSecondary,
    fontWeight: '500',
  },
  sectionTitle: {
    fontSize: 14,
    fontWeight: '600',
    color: COLORS.textSecondary,
    letterSpacing: 2,
    marginBottom: 16,
    marginTop: 8,
  },
  skinsGrid: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    gap: 12,
    marginBottom: 24,
  },
  skinCard: {
    width: '47%',
    backgroundColor: 'rgba(255, 255, 255, 0.05)',
    borderRadius: 16,
    padding: 16,
    alignItems: 'center',
    borderWidth: 2,
    borderColor: 'rgba(59, 130, 246, 0.2)',
    position: 'relative',
  },
  equippedCard: {
    borderColor: '#10B981',
    backgroundColor: 'rgba(16, 185, 129, 0.08)',
  },
  lockedCard: {
    opacity: 0.6,
  },
  equippedBadge: {
    position: 'absolute',
    top: 8,
    right: 8,
    left: 8,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    gap: 4,
    backgroundColor: 'rgba(16, 185, 129, 0.9)',
    paddingHorizontal: 8,
    paddingVertical: 4,
    borderRadius: 8,
    borderWidth: 1,
    borderColor: '#10B981',
    zIndex: 10,
  },
  equippedText: {
    fontSize: 9,
    fontWeight: '700',
    color: '#FFF',
    letterSpacing: 0.5,
  },
  lockOverlay: {
    position: 'absolute',
    top: '35%',
    zIndex: 10,
  },
  ballPreview: {
    width: 80,
    height: 80,
    borderRadius: 40,
    marginBottom: 12,
    alignItems: 'center',
    justifyContent: 'center',
  },
  skinName: {
    fontSize: 14,
    fontWeight: '600',
    color: COLORS.text,
    marginBottom: 8,
    textAlign: 'center',
  },
  lockedText: {
    color: COLORS.textSecondary,
  },
  rarityBadge: {
    paddingHorizontal: 10,
    paddingVertical: 4,
    borderRadius: 8,
    borderWidth: 1,
  },
  rarityText: {
    fontSize: 10,
    fontWeight: '700',
    letterSpacing: 0.5,
  },
  tipContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: 'rgba(59, 130, 246, 0.08)',
    paddingVertical: 12,
    paddingHorizontal: 16,
    borderRadius: 10,
    gap: 8,
    marginTop: 20,
  },
  tipText: {
    flex: 1,
    fontSize: 12,
    color: COLORS.textSecondary,
    fontWeight: '500',
  },
});
