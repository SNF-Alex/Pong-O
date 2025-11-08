import React, { useState, useEffect } from 'react';
import { View, Text, TouchableOpacity, StyleSheet, StatusBar, ScrollView, Alert, Modal } from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { COLORS } from '../constants/gameConfig';
import { BALL_SKINS, PADDLE_SKINS, THEME_SKINS, RARITY_INFO } from '../config/skins';
import { getUnlockedSkins, getEquippedBall, equipBall, getUnlockedPaddleSkins, getEquippedPaddle, equipPaddle, getUnlockedThemes, getEquippedTheme, equipTheme, getThemeVariant, setThemeVariant, getCoins } from '../utils/storage';
import { useTheme } from '../contexts/ThemeContext';

export default function BackpackScreen({ route, navigation, onNavigate, params }) {
  const { refreshTheme } = useTheme();
  const [unlockedSkinIds, setUnlockedSkinIds] = useState([]);
  const [equippedBallId, setEquippedBallId] = useState('ball_red');
  const [unlockedPaddleIds, setUnlockedPaddleIds] = useState([]);
  const [equippedPaddleId, setEquippedPaddleId] = useState('paddle_red');
  const [unlockedThemeIds, setUnlockedThemeIds] = useState([]);
  const [equippedThemeId, setEquippedThemeId] = useState('theme_default');
  const [coins, setCoins] = useState(0);
  const [loading, setLoading] = useState(true);
  const [sortBy, setSortBy] = useState('rarity');
  const [sortDirection, setSortDirection] = useState('desc');
  const [dropdownOpen, setDropdownOpen] = useState(false);
  const [activeSection, setActiveSection] = useState(params?.activeSection || route?.params?.activeSection || 'balls');
  const [variantModalVisible, setVariantModalVisible] = useState(false);
  const [selectedThemeForVariant, setSelectedThemeForVariant] = useState(null);
  const [currentVariant, setCurrentVariant] = useState('pink');

  useEffect(() => {
    loadInventory();
  }, []);

  // Reload coins periodically
  useEffect(() => {
    const interval = setInterval(async () => {
      const currentCoins = await getCoins();
      setCoins(currentCoins);
    }, 1000);
    return () => clearInterval(interval);
  }, []);

  // Update active section when navigation params change
  useEffect(() => {
    const newSection = params?.activeSection || route?.params?.activeSection;
    if (newSection) {
      setActiveSection(newSection);
    }
  }, [params?.activeSection, route?.params?.activeSection]);

  const loadInventory = async () => {
    setLoading(true);
    try {
      const unlocked = await getUnlockedSkins();
      const equipped = await getEquippedBall();
      const unlockedPaddles = await getUnlockedPaddleSkins();
      const equippedPaddle = await getEquippedPaddle();
      const unlockedThemes = await getUnlockedThemes();
      const equippedTheme = await getEquippedTheme();
      const currentCoins = await getCoins();
      setUnlockedSkinIds(unlocked);
      setEquippedBallId(equipped);
      setUnlockedPaddleIds(unlockedPaddles);
      setEquippedPaddleId(equippedPaddle);
      setUnlockedThemeIds(unlockedThemes);
      setCoins(currentCoins);
      setEquippedThemeId(equippedTheme);
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

  const handleEquipPaddle = async (paddleId) => {
    const success = await equipPaddle(paddleId);
    if (success) {
      setEquippedPaddleId(paddleId);
      Alert.alert('Equipped!', `${PADDLE_SKINS[paddleId].name} is now equipped.`);
    } else {
      Alert.alert('Error', 'Failed to equip paddle. Make sure it is unlocked.');
    }
  };

  const handleEquipTheme = async (themeId) => {
    const success = await equipTheme(themeId);
    if (success) {
      setEquippedThemeId(themeId);
      await refreshTheme(); // Refresh the global theme
      Alert.alert('Equipped!', `${THEME_SKINS[themeId].name} theme is now active.`);
    } else {
      Alert.alert('Error', 'Failed to equip theme. Make sure it is unlocked.');
    }
  };

  const handleOpenVariantSelector = async (theme) => {
    setSelectedThemeForVariant(theme);
    const variant = await getThemeVariant(theme.id);
    setCurrentVariant(variant);
    setVariantModalVisible(true);
  };

  const handleSelectVariant = async (variant) => {
    if (selectedThemeForVariant) {
      await setThemeVariant(selectedThemeForVariant.id, variant);
      setCurrentVariant(variant);
      setVariantModalVisible(false);
      // Reload inventory to reflect changes
      await loadInventory();
      await refreshTheme(); // Refresh the global theme
      Alert.alert('Color Changed!', `${selectedThemeForVariant.name} color variant updated.`);
    }
  };

  const toggleSortDirection = () => {
    setSortDirection(prev => prev === 'asc' ? 'desc' : 'asc');
    setDropdownOpen(false);
  };

  const changeSortBy = (newSortBy) => {
    if (sortBy === newSortBy) {
      toggleSortDirection();
    } else {
      setSortBy(newSortBy);
      setSortDirection('desc');
    }
    setDropdownOpen(false);
  };

  const sortSkins = (skins) => {
    const rarityOrder = { legendary: 5, epic: 4, rare: 3, uncommon: 2, common: 1 };
    
    const sorted = [...skins].sort((a, b) => {
      if (sortBy === 'rarity') {
        const rarityDiff = rarityOrder[b.rarity] - rarityOrder[a.rarity];
        if (rarityDiff !== 0) {
          return sortDirection === 'desc' ? rarityDiff : -rarityDiff;
        }
        return a.name.localeCompare(b.name);
      } else {
        return sortDirection === 'desc' 
          ? a.name.localeCompare(b.name)
          : b.name.localeCompare(a.name);
      }
    });
    
    return sorted;
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
        {isEquipped && (
          <View style={styles.equippedBadge}>
            <Ionicons name="checkmark-circle" size={16} color="#10B981" />
            <Text style={styles.equippedText}>EQUIPPED</Text>
          </View>
        )}

        {!isUnlocked && (
          <View style={styles.lockOverlay}>
            <Ionicons name="lock-closed" size={32} color={COLORS.textSecondary} />
          </View>
        )}

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
          {skin.id === 'ball_dev_x' && (
            <View style={styles.xMarkContainer}>
              <View style={[styles.xLine, styles.xLine1, { backgroundColor: skin.accentColor }]} />
              <View style={[styles.xLine, styles.xLine2, { backgroundColor: skin.accentColor }]} />
            </View>
          )}
        </View>

        <Text style={[styles.skinName, !isUnlocked && styles.lockedText]}>
          {skin.name}
        </Text>

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

  const renderPaddleCard = (paddle) => {
    const isUnlocked = unlockedPaddleIds.includes(paddle.id);
    const isEquipped = equippedPaddleId === paddle.id;
    const rarityInfo = RARITY_INFO[paddle.rarity];

    return (
      <TouchableOpacity
        key={paddle.id}
        style={[
          styles.skinCard,
          isEquipped && styles.equippedCard,
          !isUnlocked && styles.lockedCard,
        ]}
        onPress={() => isUnlocked && handleEquipPaddle(paddle.id)}
        disabled={!isUnlocked}
        activeOpacity={0.7}
      >
        {isEquipped && (
          <View style={styles.equippedBadge}>
            <Ionicons name="checkmark-circle" size={16} color="#10B981" />
            <Text style={styles.equippedText}>EQUIPPED</Text>
          </View>
        )}

        {!isUnlocked && (
          <View style={styles.lockOverlay}>
            <Ionicons name="lock-closed" size={32} color={COLORS.textSecondary} />
          </View>
        )}

        <View
          style={[
            styles.paddlePreview,
            {
              backgroundColor: paddle.animated ? paddle.colors[0] : paddle.color,
              opacity: isUnlocked ? 1 : 0.3,
            },
          ]}
        >
          {paddle.animated && (
            <Ionicons name="color-palette" size={20} color="#FFF" />
          )}
        </View>

        <Text style={[styles.skinName, !isUnlocked && styles.lockedText]}>
          {paddle.name}
        </Text>

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

  const renderThemeCard = (theme) => {
    const isUnlocked = unlockedThemeIds.includes(theme.id);
    const isEquipped = equippedThemeId === theme.id;
    const rarityInfo = RARITY_INFO[theme.rarity];

    return (
      <View key={theme.id} style={styles.themeCardWrapper}>
        <TouchableOpacity
          style={[
            styles.themeCard,
            isEquipped && styles.equippedCard,
            !isUnlocked && styles.lockedCard,
          ]}
          onPress={() => isUnlocked && handleEquipTheme(theme.id)}
          disabled={!isUnlocked}
          activeOpacity={0.7}
        >
          {isEquipped && (
            <View style={styles.equippedBadge}>
              <Ionicons name="checkmark-circle" size={16} color="#10B981" />
              <Text style={styles.equippedText}>EQUIPPED</Text>
            </View>
          )}

          {!isUnlocked && (
            <View style={styles.lockOverlay}>
              <Ionicons name="lock-closed" size={32} color={COLORS.textSecondary} />
            </View>
          )}

          <View style={[styles.themePreview, { opacity: isUnlocked ? 1 : 0.3 }]}>
            <View style={[styles.themeColorRow, { backgroundColor: theme.colors.background }]}>
              <View style={[styles.themeColorDot, { backgroundColor: theme.colors.primary }]} />
              <View style={[styles.themeColorDot, { backgroundColor: theme.colors.secondary }]} />
            </View>
            <View style={styles.themeColorRow}>
              <View style={[styles.themeColorDot, { backgroundColor: theme.colors.accent }]} />
              <View style={[styles.themeColorDot, { backgroundColor: theme.colors.surface }]} />
            </View>
            {theme.animated && (
              <View style={styles.animatedOverlay}>
                <Ionicons name="color-palette" size={16} color="#FFF" />
              </View>
            )}
          </View>

          <Text style={[styles.skinName, !isUnlocked && styles.lockedText]}>
            {theme.name}
          </Text>

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

        {/* Edit button for themes with variants */}
        {theme.hasVariants && isUnlocked && (
          <TouchableOpacity
            style={styles.editVariantButton}
            onPress={() => handleOpenVariantSelector(theme)}
            activeOpacity={0.8}
          >
            <Ionicons name="color-palette" size={16} color={COLORS.primary} />
            <Text style={styles.editVariantText}>Edit Color</Text>
          </TouchableOpacity>
        )}
      </View>
    );
  };

  // Filter out secret skins unless they're unlocked
  const allSkins = Object.values(BALL_SKINS).filter(skin => 
    !skin.secret || unlockedSkinIds.includes(skin.id)
  );
  const unlockedSkins = sortSkins(allSkins.filter(skin => unlockedSkinIds.includes(skin.id)));
  const lockedSkins = sortSkins(allSkins.filter(skin => !unlockedSkinIds.includes(skin.id)));

  const allPaddles = Object.values(PADDLE_SKINS);
  const unlockedPaddles = sortSkins(allPaddles.filter(paddle => unlockedPaddleIds.includes(paddle.id)));
  const lockedPaddles = sortSkins(allPaddles.filter(paddle => !unlockedPaddleIds.includes(paddle.id)));

  const allThemes = Object.values(THEME_SKINS);
  const unlockedThemes = sortSkins(allThemes.filter(theme => unlockedThemeIds.includes(theme.id)));
  const lockedThemes = sortSkins(allThemes.filter(theme => !unlockedThemeIds.includes(theme.id)));

  const getSubtitle = () => {
    if (activeSection === 'balls') {
      return `${unlockedSkins.length} / ${allSkins.length} Unlocked`;
    } else if (activeSection === 'paddles') {
      return `${unlockedPaddles.length} / ${allPaddles.length} Unlocked`;
    } else if (activeSection === 'themes') {
      return `${unlockedThemes.length} / ${allThemes.length} Unlocked`;
    }
    return 'Coming Soon';
  };

  return (
    <View style={styles.container}>
      <StatusBar barStyle="light-content" />
      
      <View style={styles.header}>
        <TouchableOpacity 
          style={styles.backButton} 
          onPress={() => onNavigate ? onNavigate('Menu') : navigation.goBack()}
        >
          <Ionicons name="arrow-back" size={24} color={COLORS.text} />
        </TouchableOpacity>
        
        <View style={styles.headerContent}>
          <Text style={styles.title}>BACKPACK</Text>
          <View style={styles.divider} />
          <Text style={styles.subtitle}>{getSubtitle()}</Text>
        </View>

        <View style={styles.backButton} />
      </View>

      {/* Coins Display */}
      <View style={styles.coinsContainerMain}>
        <View style={styles.coinsDisplayMain}>
          <Ionicons name="cash-outline" size={22} color="#F59E0B" />
          <Text style={styles.coinsAmountLarge}>{coins}</Text>
        </View>
      </View>

      <View style={styles.sectionTabs}>
        <TouchableOpacity
          style={[styles.sectionTab, activeSection === 'balls' && styles.sectionTabActive]}
          onPress={() => setActiveSection('balls')}
          activeOpacity={0.7}
        >
          <Ionicons name="baseball" size={20} color={activeSection === 'balls' ? COLORS.primary : COLORS.textSecondary} />
          <Text style={[styles.sectionTabText, activeSection === 'balls' && styles.sectionTabTextActive]}>Ball Skins</Text>
        </TouchableOpacity>

        <TouchableOpacity
          style={[styles.sectionTab, activeSection === 'paddles' && styles.sectionTabActive]}
          onPress={() => setActiveSection('paddles')}
          activeOpacity={0.7}
        >
          <Ionicons name="reorder-four" size={20} color={activeSection === 'paddles' ? COLORS.primary : COLORS.textSecondary} />
          <Text style={[styles.sectionTabText, activeSection === 'paddles' && styles.sectionTabTextActive]}>Paddle Skins</Text>
        </TouchableOpacity>

        <TouchableOpacity
          style={[styles.sectionTab, activeSection === 'themes' && styles.sectionTabActive]}
          onPress={() => setActiveSection('themes')}
          activeOpacity={0.7}
        >
          <Ionicons name="image" size={20} color={activeSection === 'themes' ? COLORS.primary : COLORS.textSecondary} />
          <Text style={[styles.sectionTabText, activeSection === 'themes' && styles.sectionTabTextActive]}>Themes</Text>
        </TouchableOpacity>
      </View>

      <ScrollView style={styles.content} contentContainerStyle={styles.contentContainer}>
        {(activeSection === 'balls' || activeSection === 'paddles' || activeSection === 'themes') && (
          <View style={styles.sortContainer}>
            <TouchableOpacity style={styles.sortButton} onPress={() => setDropdownOpen(!dropdownOpen)} activeOpacity={0.7}>
              <Ionicons name="funnel" size={16} color={COLORS.primary} />
              <Text style={styles.sortButtonText}>Sort: {sortBy === 'rarity' ? 'Rarity' : 'A-Z'}</Text>
              <Ionicons name={dropdownOpen ? "chevron-up" : "chevron-down"} size={16} color={COLORS.textSecondary} />
            </TouchableOpacity>

            <TouchableOpacity style={styles.directionButton} onPress={toggleSortDirection} activeOpacity={0.7}>
              <Ionicons name={sortDirection === 'desc' ? "arrow-down" : "arrow-up"} size={20} color={COLORS.primary} />
            </TouchableOpacity>
          </View>
        )}

        {dropdownOpen && (activeSection === 'balls' || activeSection === 'paddles' || activeSection === 'themes') && (
          <View style={styles.dropdown}>
            <TouchableOpacity
              style={[styles.dropdownItem, sortBy === 'rarity' && styles.dropdownItemActive]}
              onPress={() => changeSortBy('rarity')}
              activeOpacity={0.7}
            >
              <Ionicons name="star" size={16} color={sortBy === 'rarity' ? COLORS.primary : COLORS.textSecondary} />
              <Text style={[styles.dropdownText, sortBy === 'rarity' && styles.dropdownTextActive]}>Rarity</Text>
              {sortBy === 'rarity' && <Ionicons name={sortDirection === 'desc' ? "arrow-down" : "arrow-up"} size={14} color={COLORS.primary} />}
            </TouchableOpacity>

            <View style={styles.dropdownDivider} />

            <TouchableOpacity
              style={[styles.dropdownItem, sortBy === 'alphabetical' && styles.dropdownItemActive]}
              onPress={() => changeSortBy('alphabetical')}
              activeOpacity={0.7}
            >
              <Ionicons name="text" size={16} color={sortBy === 'alphabetical' ? COLORS.primary : COLORS.textSecondary} />
              <Text style={[styles.dropdownText, sortBy === 'alphabetical' && styles.dropdownTextActive]}>Alphabetical</Text>
              {sortBy === 'alphabetical' && <Ionicons name={sortDirection === 'desc' ? "arrow-down" : "arrow-up"} size={14} color={COLORS.primary} />}
            </TouchableOpacity>
          </View>
        )}

        {loading ? (
          <View style={styles.loadingContainer}>
            <Text style={styles.loadingText}>Loading inventory...</Text>
          </View>
        ) : (
          <>
            {activeSection === 'balls' && (
              <>
                {unlockedSkins.length > 0 && (
                  <>
                    <Text style={styles.sectionTitle}>YOUR SKINS</Text>
                    <View style={styles.skinsGrid}>{unlockedSkins.map(renderSkinCard)}</View>
                  </>
                )}
                {lockedSkins.length > 0 && (
                  <>
                    <Text style={styles.sectionTitle}>LOCKED</Text>
                    <View style={styles.skinsGrid}>{lockedSkins.map(renderSkinCard)}</View>
                  </>
                )}
              </>
            )}

            {activeSection === 'paddles' && (
              <>
                {unlockedPaddles.length > 0 && (
                  <>
                    <Text style={styles.sectionTitle}>YOUR PADDLES</Text>
                    <View style={styles.skinsGrid}>{unlockedPaddles.map(renderPaddleCard)}</View>
                  </>
                )}
                {lockedPaddles.length > 0 && (
                  <>
                    <Text style={styles.sectionTitle}>LOCKED</Text>
                    <View style={styles.skinsGrid}>{lockedPaddles.map(renderPaddleCard)}</View>
                  </>
                )}
              </>
            )}

            {activeSection === 'themes' && (
              <>
                {unlockedThemes.length > 0 && (
                  <>
                    <Text style={styles.sectionTitle}>YOUR THEMES</Text>
                    <View style={styles.skinsGrid}>{unlockedThemes.map(renderThemeCard)}</View>
                  </>
                )}
                {lockedThemes.length > 0 && (
                  <>
                    <Text style={styles.sectionTitle}>LOCKED</Text>
                    <View style={styles.skinsGrid}>{lockedThemes.map(renderThemeCard)}</View>
                  </>
                )}
              </>
            )}
          </>
        )}

        {(activeSection === 'balls' || activeSection === 'paddles' || activeSection === 'themes') && (
          <View style={styles.tipContainer}>
            <Ionicons name="information-circle-outline" size={18} color={COLORS.primary} />
            <Text style={styles.tipText}>Open loot boxes in the shop to unlock more {activeSection === 'balls' ? 'skins' : activeSection === 'paddles' ? 'paddles' : 'themes'}!</Text>
          </View>
        )}
      </ScrollView>

      {/* Variant Selector Modal */}
      <Modal
        visible={variantModalVisible}
        transparent={true}
        animationType="fade"
        onRequestClose={() => setVariantModalVisible(false)}
      >
        <View style={styles.modalOverlay}>
          <View style={styles.modalContent}>
            <View style={styles.modalHeader}>
              <Text style={styles.modalTitle}>Choose Neon Color</Text>
              <TouchableOpacity onPress={() => setVariantModalVisible(false)}>
                <Ionicons name="close" size={28} color={COLORS.text} />
              </TouchableOpacity>
            </View>

            <Text style={styles.modalSubtitle}>
              Select your preferred color variant for {selectedThemeForVariant?.name}
            </Text>

            <ScrollView style={styles.variantsContainer}>
              {selectedThemeForVariant?.variants && Object.entries(selectedThemeForVariant.variants).map(([key, variant]) => (
                <TouchableOpacity
                  key={key}
                  style={[
                    styles.variantOption,
                    currentVariant === key && styles.variantOptionActive,
                  ]}
                  onPress={() => handleSelectVariant(key)}
                  activeOpacity={0.7}
                >
                  <View style={styles.variantPreview}>
                    <View style={[styles.variantColorBar, { backgroundColor: variant.primary }]} />
                    <View style={[styles.variantColorBar, { backgroundColor: variant.secondary }]} />
                    <View style={[styles.variantColorBar, { backgroundColor: variant.accent }]} />
                  </View>
                  <Text style={styles.variantName}>{variant.name}</Text>
                  {currentVariant === key && (
                    <Ionicons name="checkmark-circle" size={24} color={COLORS.primary} />
                  )}
                </TouchableOpacity>
              ))}
            </ScrollView>

            <TouchableOpacity
              style={styles.modalCloseButton}
              onPress={() => setVariantModalVisible(false)}
              activeOpacity={0.8}
            >
              <Text style={styles.modalCloseButtonText}>DONE</Text>
            </TouchableOpacity>
          </View>
        </View>
      </Modal>
    </View>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: COLORS.background, paddingTop: 60 },
  coinsContainerMain: {
    alignItems: 'center',
    paddingHorizontal: 30,
    marginTop: 8,
    marginBottom: 8,
  },
  coinsDisplayMain: {
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
  coinsAmountLarge: {
    fontSize: 20,
    fontWeight: '700',
    color: '#F59E0B',
    letterSpacing: 1,
  },
  coinsContainer: { 
    alignItems: 'center', 
    paddingHorizontal: 20, 
    paddingBottom: 12 
  },
  coinsDisplay: { 
    flexDirection: 'row', 
    alignItems: 'center', 
    backgroundColor: 'rgba(245, 158, 11, 0.15)', 
    paddingHorizontal: 16, 
    paddingVertical: 9, 
    borderRadius: 20, 
    gap: 7, 
    borderWidth: 1.5, 
    borderColor: 'rgba(245, 158, 11, 0.4)',
    shadowColor: '#F59E0B',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.3,
    shadowRadius: 4,
    elevation: 4,
  },
  coinsAmount: { 
    fontSize: 18, 
    fontWeight: '700', 
    color: '#F59E0B',
    letterSpacing: 1 
  },
  header: { flexDirection: 'row', alignItems: 'center', justifyContent: 'space-between', paddingBottom: 8, paddingHorizontal: 20, paddingTop: 10 },
  backButton: { width: 40, height: 40, alignItems: 'center', justifyContent: 'center' },
  headerContent: { flex: 1, alignItems: 'center' },
  title: { fontSize: 32, fontWeight: '300', color: COLORS.text, letterSpacing: 8, marginBottom: 6 },
  divider: { width: 40, height: 2, backgroundColor: COLORS.primary, marginBottom: 8, borderRadius: 2 },
  subtitle: { fontSize: 11, color: COLORS.textSecondary, letterSpacing: 1.5, textTransform: 'uppercase', fontWeight: '500' },
  sectionTabs: { flexDirection: 'row', paddingHorizontal: 20, paddingVertical: 12, gap: 8, backgroundColor: 'rgba(0, 0, 0, 0.3)', borderBottomWidth: 1, borderBottomColor: 'rgba(59, 130, 246, 0.15)' },
  sectionTab: { flex: 1, flexDirection: 'row', alignItems: 'center', justifyContent: 'center', gap: 6, paddingVertical: 10, paddingHorizontal: 12, borderRadius: 10, backgroundColor: 'rgba(255, 255, 255, 0.05)', borderWidth: 1, borderColor: 'rgba(59, 130, 246, 0.1)' },
  sectionTabActive: { backgroundColor: 'rgba(59, 130, 246, 0.2)', borderColor: COLORS.primary },
  sectionTabText: { fontSize: 11, color: COLORS.textSecondary, fontWeight: '600', letterSpacing: 0.5 },
  sectionTabTextActive: { color: COLORS.primary, fontWeight: '700' },
  content: { flex: 1 },
  contentContainer: { padding: 20 },
  loadingContainer: { padding: 40, alignItems: 'center' },
  loadingText: { fontSize: 14, color: COLORS.textSecondary, fontWeight: '500' },
  sectionTitle: { fontSize: 14, fontWeight: '600', color: COLORS.textSecondary, letterSpacing: 2, marginBottom: 16, marginTop: 8 },
  skinsGrid: { flexDirection: 'row', flexWrap: 'wrap', gap: 12, marginBottom: 24 },
  skinCard: { width: '47%', backgroundColor: 'rgba(255, 255, 255, 0.05)', borderRadius: 16, padding: 16, alignItems: 'center', borderWidth: 2, borderColor: 'rgba(59, 130, 246, 0.2)', position: 'relative' },
  equippedCard: { borderColor: '#10B981', backgroundColor: 'rgba(16, 185, 129, 0.08)' },
  lockedCard: { opacity: 0.6 },
  equippedBadge: { position: 'absolute', top: 8, right: 8, left: 8, flexDirection: 'row', alignItems: 'center', justifyContent: 'center', gap: 4, backgroundColor: 'rgba(16, 185, 129, 0.9)', paddingHorizontal: 8, paddingVertical: 4, borderRadius: 8, borderWidth: 1, borderColor: '#10B981', zIndex: 10 },
  equippedText: { fontSize: 9, fontWeight: '700', color: '#FFF', letterSpacing: 0.5 },
  lockOverlay: { position: 'absolute', top: '35%', zIndex: 10 },
  ballPreview: { width: 80, height: 80, borderRadius: 40, marginBottom: 12, alignItems: 'center', justifyContent: 'center', position: 'relative' },
  xMarkContainer: { position: 'absolute', width: '100%', height: '100%', alignItems: 'center', justifyContent: 'center' },
  xLine: { position: 'absolute', width: 50, height: 4, borderRadius: 2 },
  xLine1: { transform: [{ rotate: '45deg' }] },
  xLine2: { transform: [{ rotate: '-45deg' }] },
  paddlePreview: { width: 80, height: 20, borderRadius: 10, marginBottom: 12, marginTop: 20, alignItems: 'center', justifyContent: 'center' },
  themePreview: { width: 80, height: 60, borderRadius: 8, marginBottom: 12, overflow: 'hidden', position: 'relative' },
  themeColorRow: { flex: 1, flexDirection: 'row', gap: 2 },
  themeColorDot: { flex: 1, height: '100%' },
  animatedOverlay: { position: 'absolute', top: 0, left: 0, right: 0, bottom: 0, alignItems: 'center', justifyContent: 'center', backgroundColor: 'rgba(0, 0, 0, 0.3)' },
  skinName: { fontSize: 14, fontWeight: '600', color: COLORS.text, marginBottom: 8, textAlign: 'center' },
  lockedText: { color: COLORS.textSecondary },
  rarityBadge: { paddingHorizontal: 10, paddingVertical: 4, borderRadius: 8, borderWidth: 1 },
  rarityText: { fontSize: 10, fontWeight: '700', letterSpacing: 0.5 },
  tipContainer: { flexDirection: 'row', alignItems: 'center', backgroundColor: 'rgba(59, 130, 246, 0.08)', paddingVertical: 12, paddingHorizontal: 16, borderRadius: 10, gap: 8, marginTop: 20 },
  tipText: { flex: 1, fontSize: 12, color: COLORS.textSecondary, fontWeight: '500' },
  sortContainer: { flexDirection: 'row', alignItems: 'center', gap: 10, marginBottom: 16 },
  sortButton: { flex: 1, flexDirection: 'row', alignItems: 'center', gap: 8, backgroundColor: 'rgba(59, 130, 246, 0.08)', paddingVertical: 12, paddingHorizontal: 16, borderRadius: 12, borderWidth: 1, borderColor: 'rgba(59, 130, 246, 0.2)' },
  sortButtonText: { flex: 1, fontSize: 14, color: COLORS.text, fontWeight: '600' },
  directionButton: { width: 48, height: 48, alignItems: 'center', justifyContent: 'center', backgroundColor: 'rgba(59, 130, 246, 0.08)', borderRadius: 12, borderWidth: 1, borderColor: 'rgba(59, 130, 246, 0.2)' },
  dropdown: { backgroundColor: 'rgba(0, 0, 0, 0.6)', borderRadius: 12, borderWidth: 1, borderColor: 'rgba(59, 130, 246, 0.3)', marginBottom: 16, overflow: 'hidden' },
  dropdownItem: { flexDirection: 'row', alignItems: 'center', gap: 10, paddingVertical: 14, paddingHorizontal: 16 },
  dropdownItemActive: { backgroundColor: 'rgba(59, 130, 246, 0.15)' },
  dropdownText: { flex: 1, fontSize: 14, color: COLORS.textSecondary, fontWeight: '500' },
  dropdownTextActive: { color: COLORS.primary, fontWeight: '600' },
  dropdownDivider: { height: 1, backgroundColor: 'rgba(59, 130, 246, 0.15)' },
  comingSoonContainer: { alignItems: 'center', justifyContent: 'center', paddingVertical: 80, paddingHorizontal: 40 },
  comingSoonTitle: { fontSize: 20, fontWeight: '600', color: COLORS.textSecondary, marginTop: 20, marginBottom: 12, textAlign: 'center' },
  comingSoonText: { fontSize: 14, color: COLORS.textSecondary, textAlign: 'center', lineHeight: 20, opacity: 0.7 },
  themeCardWrapper: { width: '47%' },
  themeCard: { width: '100%', backgroundColor: 'rgba(255, 255, 255, 0.05)', borderRadius: 16, padding: 16, alignItems: 'center', borderWidth: 2, borderColor: 'rgba(59, 130, 246, 0.2)', position: 'relative' },
  editVariantButton: { flexDirection: 'row', alignItems: 'center', justifyContent: 'center', gap: 6, backgroundColor: 'rgba(59, 130, 246, 0.15)', paddingVertical: 8, paddingHorizontal: 12, borderRadius: 8, marginTop: 8, borderWidth: 1, borderColor: 'rgba(59, 130, 246, 0.3)' },
  editVariantText: { fontSize: 11, color: COLORS.primary, fontWeight: '600', letterSpacing: 0.5 },
  modalOverlay: { flex: 1, backgroundColor: 'rgba(0, 0, 0, 0.85)', justifyContent: 'center', alignItems: 'center', padding: 20 },
  modalContent: { backgroundColor: COLORS.surface, borderRadius: 20, padding: 24, width: '100%', maxWidth: 400, maxHeight: '80%', borderWidth: 1, borderColor: 'rgba(59, 130, 246, 0.3)' },
  modalHeader: { flexDirection: 'row', alignItems: 'center', justifyContent: 'space-between', marginBottom: 12 },
  modalTitle: { fontSize: 24, fontWeight: '600', color: COLORS.text, letterSpacing: 1 },
  modalSubtitle: { fontSize: 13, color: COLORS.textSecondary, marginBottom: 20, lineHeight: 18 },
  variantsContainer: { maxHeight: 400 },
  variantOption: { flexDirection: 'row', alignItems: 'center', backgroundColor: 'rgba(255, 255, 255, 0.05)', paddingVertical: 14, paddingHorizontal: 16, borderRadius: 12, marginBottom: 10, borderWidth: 2, borderColor: 'rgba(59, 130, 246, 0.2)' },
  variantOptionActive: { borderColor: COLORS.primary, backgroundColor: 'rgba(59, 130, 246, 0.15)' },
  variantPreview: { flexDirection: 'row', gap: 4, marginRight: 12 },
  variantColorBar: { width: 24, height: 36, borderRadius: 6 },
  variantName: { flex: 1, fontSize: 16, fontWeight: '600', color: COLORS.text },
  modalCloseButton: { backgroundColor: COLORS.primary, paddingVertical: 14, borderRadius: 12, alignItems: 'center', marginTop: 16 },
  modalCloseButtonText: { fontSize: 16, fontWeight: '700', color: '#000', letterSpacing: 1 },
});
