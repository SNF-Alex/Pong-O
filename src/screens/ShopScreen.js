import React from 'react';
import { View, Text, TouchableOpacity, StyleSheet, StatusBar, ScrollView } from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { COLORS } from '../constants/gameConfig';
import { LOOT_BOXES } from '../config/lootBoxes';

export default function ShopScreen({ navigation }) {
  const basicBox = LOOT_BOXES.basic_box;

  const handlePurchaseBox = () => {
    // TODO: Check if user has enough coins (when price is 1000)
    // For now, since price is 0, just navigate to Plinko
    navigation.navigate('Plinko', { boxId: 'basic_box' });
  };

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

      <ScrollView style={styles.content} contentContainerStyle={styles.contentContainer}>
        
        {/* Basic Box Card */}
        <View style={styles.boxCard}>
          <View style={styles.boxIconContainer}>
            <Ionicons name={basicBox.icon} size={80} color={COLORS.primary} />
            <View style={styles.glow} />
          </View>

          <Text style={styles.boxName}>{basicBox.name}</Text>
          <Text style={styles.boxDescription}>{basicBox.description}</Text>

          {/* Rarity Indicators */}
          <View style={styles.rarityContainer}>
            <Text style={styles.rarityLabel}>Drop Rates:</Text>
            <View style={styles.rarityGrid}>
              <View style={styles.rarityItem}>
                <View style={[styles.rarityDot, { backgroundColor: '#9CA3AF' }]} />
                <Text style={styles.rarityText}>Common {basicBox.rarityWeights.common}%</Text>
              </View>
              <View style={styles.rarityItem}>
                <View style={[styles.rarityDot, { backgroundColor: '#10B981' }]} />
                <Text style={styles.rarityText}>Uncommon {basicBox.rarityWeights.uncommon}%</Text>
              </View>
              <View style={styles.rarityItem}>
                <View style={[styles.rarityDot, { backgroundColor: '#3B82F6' }]} />
                <Text style={styles.rarityText}>Rare {basicBox.rarityWeights.rare}%</Text>
              </View>
              <View style={styles.rarityItem}>
                <View style={[styles.rarityDot, { backgroundColor: '#A855F7' }]} />
                <Text style={styles.rarityText}>Epic {basicBox.rarityWeights.epic}%</Text>
              </View>
              <View style={styles.rarityItem}>
                <View style={[styles.rarityDot, { backgroundColor: '#F59E0B' }]} />
                <Text style={styles.rarityText}>Legendary {basicBox.rarityWeights.legendary}%</Text>
              </View>
            </View>
          </View>

          {/* Price and Purchase Button */}
          <View style={styles.purchaseContainer}>
            <View style={styles.priceTag}>
              <Ionicons name="disc" size={24} color="#F59E0B" />
              <Text style={styles.priceText}>
                {basicBox.price === 0 ? 'FREE' : basicBox.price}
              </Text>
              {basicBox.price === 0 && (
                <Text style={styles.testLabel}>(Testing)</Text>
              )}
            </View>

            <TouchableOpacity
              style={styles.purchaseButton}
              onPress={handlePurchaseBox}
              activeOpacity={0.8}
            >
              <Ionicons name="gift-outline" size={24} color="#000" />
              <Text style={styles.purchaseButtonText}>OPEN BOX</Text>
            </TouchableOpacity>
          </View>

          {/* Note about future price */}
          {basicBox.price === 0 && (
            <View style={styles.noteContainer}>
              <Ionicons name="information-circle-outline" size={16} color={COLORS.textSecondary} />
              <Text style={styles.noteText}>
                Final price will be 1,000 coins
              </Text>
            </View>
          )}
        </View>

        {/* Coming Soon Section */}
        <View style={styles.comingSoonContainer}>
          <Ionicons name="lock-closed-outline" size={40} color={COLORS.textSecondary} />
          <Text style={styles.comingSoonTitle}>More Boxes Coming Soon</Text>
          <Text style={styles.comingSoonText}>
            Premium boxes, special events, and exclusive skins
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
