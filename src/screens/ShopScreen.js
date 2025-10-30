import React, { useState, useEffect } from 'react';
import { View, Text, TouchableOpacity, StyleSheet, StatusBar, ScrollView } from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { COLORS } from '../constants/gameConfig';
import { LOOT_BOXES } from '../config/lootBoxes';

export default function ShopScreen({ route, navigation }) {
  const [activeSection, setActiveSection] = useState(route?.params?.activeSection || 'balls'); // 'balls', 'paddles', 'themes'
  
  const ballBox = LOOT_BOXES.basic_ball_box;
  const paddleBox = LOOT_BOXES.basic_paddle_box;
  const themeBox = LOOT_BOXES.basic_theme_box;

  // Update active section when navigation params change
  useEffect(() => {
    if (route?.params?.activeSection) {
      setActiveSection(route.params.activeSection);
    }
  }, [route?.params?.activeSection]);

  const handlePurchaseBox = (boxId) => {
    // TODO: Check if user has enough coins (when price is 1000)
    // For now, since price is 0, just navigate to Plinko
    navigation.navigate('Plinko', { boxId });
  };

  const renderBoxCard = (box) => (
    <View key={box.id} style={styles.boxCard}>
      <View style={styles.boxIconContainer}>
        <Ionicons name={box.icon} size={80} color={COLORS.primary} />
        <View style={styles.glow} />
      </View>

      <Text style={styles.boxName}>{box.name}</Text>
      <Text style={styles.boxDescription}>{box.description}</Text>

      {/* Rarity Indicators */}
      <View style={styles.rarityContainer}>
        <Text style={styles.rarityLabel}>Drop Rates:</Text>
        <View style={styles.rarityGrid}>
          <View style={styles.rarityItem}>
            <View style={[styles.rarityDot, { backgroundColor: '#9CA3AF' }]} />
            <Text style={styles.rarityText}>Common {box.rarityWeights.common}%</Text>
          </View>
          <View style={styles.rarityItem}>
            <View style={[styles.rarityDot, { backgroundColor: '#10B981' }]} />
            <Text style={styles.rarityText}>Uncommon {box.rarityWeights.uncommon}%</Text>
          </View>
          <View style={styles.rarityItem}>
            <View style={[styles.rarityDot, { backgroundColor: '#3B82F6' }]} />
            <Text style={styles.rarityText}>Rare {box.rarityWeights.rare}%</Text>
          </View>
          <View style={styles.rarityItem}>
            <View style={[styles.rarityDot, { backgroundColor: '#A855F7' }]} />
            <Text style={styles.rarityText}>Epic {box.rarityWeights.epic}%</Text>
          </View>
          <View style={styles.rarityItem}>
            <View style={[styles.rarityDot, { backgroundColor: '#F59E0B' }]} />
            <Text style={styles.rarityText}>Legendary {box.rarityWeights.legendary}%</Text>
          </View>
        </View>
      </View>

      {/* Price and Purchase Button */}
      <View style={styles.purchaseContainer}>
        <View style={styles.priceTag}>
          <Ionicons name="disc" size={24} color="#F59E0B" />
          <Text style={styles.priceText}>
            {box.price === 0 ? 'FREE' : box.price}
          </Text>
          {box.price === 0 && (
            <Text style={styles.testLabel}>(Testing)</Text>
          )}
        </View>

        <TouchableOpacity
          style={styles.purchaseButton}
          onPress={() => handlePurchaseBox(box.id)}
          activeOpacity={0.8}
        >
          <Ionicons name="gift-outline" size={24} color="#000" />
          <Text style={styles.purchaseButtonText}>OPEN BOX</Text>
        </TouchableOpacity>
      </View>

      {/* Note about future price */}
      {box.price === 0 && (
        <View style={styles.noteContainer}>
          <Ionicons name="information-circle-outline" size={16} color={COLORS.textSecondary} />
          <Text style={styles.noteText}>
            Final price will be 1,000 coins
          </Text>
        </View>
      )}
    </View>
  );

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
          <Text style={styles.title}>SHOP</Text>
          <View style={styles.divider} />
          <Text style={styles.subtitle}>Purchase Loot Boxes</Text>
        </View>

        <View style={styles.backButton} />
      </View>

      {/* Section Tabs */}
      <View style={styles.sectionTabs}>
        <TouchableOpacity
          style={[styles.sectionTab, activeSection === 'balls' && styles.sectionTabActive]}
          onPress={() => setActiveSection('balls')}
          activeOpacity={0.7}
        >
          <Ionicons 
            name="baseball" 
            size={20} 
            color={activeSection === 'balls' ? COLORS.primary : COLORS.textSecondary} 
          />
          <Text style={[styles.sectionTabText, activeSection === 'balls' && styles.sectionTabTextActive]}>
            Ball Boxes
          </Text>
        </TouchableOpacity>

        <TouchableOpacity
          style={[styles.sectionTab, activeSection === 'paddles' && styles.sectionTabActive]}
          onPress={() => setActiveSection('paddles')}
          activeOpacity={0.7}
        >
          <Ionicons 
            name="reorder-four" 
            size={20} 
            color={activeSection === 'paddles' ? COLORS.primary : COLORS.textSecondary} 
          />
          <Text style={[styles.sectionTabText, activeSection === 'paddles' && styles.sectionTabTextActive]}>
            Paddle Boxes
          </Text>
        </TouchableOpacity>

        <TouchableOpacity
          style={[styles.sectionTab, activeSection === 'themes' && styles.sectionTabActive]}
          onPress={() => setActiveSection('themes')}
          activeOpacity={0.7}
        >
          <Ionicons 
            name="image" 
            size={20} 
            color={activeSection === 'themes' ? COLORS.primary : COLORS.textSecondary} 
          />
          <Text style={[styles.sectionTabText, activeSection === 'themes' && styles.sectionTabTextActive]}>
            Theme Boxes
          </Text>
        </TouchableOpacity>
      </View>

      <ScrollView style={styles.content} contentContainerStyle={styles.contentContainer}>
        
        {/* Ball Boxes Section */}
        {activeSection === 'balls' && renderBoxCard(ballBox)}

        {/* Paddle Boxes Section */}
        {activeSection === 'paddles' && renderBoxCard(paddleBox)}

        {/* Theme Boxes Section */}
        {activeSection === 'themes' && renderBoxCard(themeBox)}

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
  sectionTabs: {
    flexDirection: 'row',
    paddingHorizontal: 20,
    paddingVertical: 12,
    gap: 8,
    backgroundColor: 'rgba(0, 0, 0, 0.3)',
    borderBottomWidth: 1,
    borderBottomColor: 'rgba(59, 130, 246, 0.15)',
  },
  sectionTab: {
    flex: 1,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    gap: 6,
    paddingVertical: 10,
    paddingHorizontal: 12,
    borderRadius: 10,
    backgroundColor: 'rgba(255, 255, 255, 0.05)',
    borderWidth: 1,
    borderColor: 'rgba(59, 130, 246, 0.1)',
  },
  sectionTabActive: {
    backgroundColor: 'rgba(59, 130, 246, 0.2)',
    borderColor: COLORS.primary,
  },
  sectionTabText: {
    fontSize: 11,
    color: COLORS.textSecondary,
    fontWeight: '600',
    letterSpacing: 0.5,
  },
  sectionTabTextActive: {
    color: COLORS.primary,
    fontWeight: '700',
  },
  content: {
    flex: 1,
  },
  contentContainer: {
    padding: 20,
  },
  boxCard: {
    backgroundColor: 'rgba(255, 255, 255, 0.05)',
    borderRadius: 20,
    padding: 24,
    borderWidth: 2,
    borderColor: 'rgba(59, 130, 246, 0.3)',
    alignItems: 'center',
  },
  boxIconContainer: {
    position: 'relative',
    marginBottom: 20,
  },
  glow: {
    position: 'absolute',
    width: 100,
    height: 100,
    top: -10,
    left: -10,
    backgroundColor: COLORS.primary,
    opacity: 0.15,
    borderRadius: 50,
    zIndex: -1,
  },
  boxName: {
    fontSize: 28,
    fontWeight: '600',
    color: COLORS.text,
    letterSpacing: 1,
    marginBottom: 8,
  },
  boxDescription: {
    fontSize: 14,
    color: COLORS.textSecondary,
    marginBottom: 24,
    textAlign: 'center',
  },
  rarityContainer: {
    width: '100%',
    marginBottom: 24,
  },
  rarityLabel: {
    fontSize: 12,
    color: COLORS.textSecondary,
    textTransform: 'uppercase',
    letterSpacing: 1,
    marginBottom: 12,
    fontWeight: '600',
  },
  rarityGrid: {
    gap: 8,
  },
  rarityItem: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 10,
  },
  rarityDot: {
    width: 10,
    height: 10,
    borderRadius: 5,
  },
  rarityText: {
    fontSize: 13,
    color: COLORS.text,
    fontWeight: '500',
  },
  purchaseContainer: {
    width: '100%',
    gap: 16,
    marginBottom: 16,
  },
  priceTag: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    backgroundColor: 'rgba(245, 158, 11, 0.15)',
    paddingVertical: 12,
    paddingHorizontal: 20,
    borderRadius: 16,
    gap: 8,
    borderWidth: 1,
    borderColor: 'rgba(245, 158, 11, 0.3)',
  },
  priceText: {
    fontSize: 24,
    fontWeight: '700',
    color: '#F59E0B',
  },
  testLabel: {
    fontSize: 12,
    color: COLORS.textSecondary,
    fontWeight: '500',
    marginLeft: 8,
  },
  purchaseButton: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    backgroundColor: COLORS.primary,
    paddingVertical: 16,
    borderRadius: 16,
    gap: 8,
  },
  purchaseButtonText: {
    fontSize: 18,
    fontWeight: '700',
    color: '#000',
    letterSpacing: 1,
  },
  noteContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 6,
    backgroundColor: 'rgba(59, 130, 246, 0.1)',
    paddingVertical: 8,
    paddingHorizontal: 12,
    borderRadius: 8,
  },
  noteText: {
    fontSize: 11,
    color: COLORS.textSecondary,
    fontWeight: '500',
  },
  comingSoonContainer: {
    alignItems: 'center',
    marginTop: 40,
    padding: 30,
    opacity: 0.5,
  },
  comingSoonTitle: {
    fontSize: 18,
    fontWeight: '600',
    color: COLORS.textSecondary,
    marginTop: 12,
    marginBottom: 8,
  },
  comingSoonText: {
    fontSize: 13,
    color: COLORS.textSecondary,
    textAlign: 'center',
  },
});
