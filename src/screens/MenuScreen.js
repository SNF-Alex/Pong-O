import React from 'react';
import { View, Text, TouchableOpacity, StyleSheet, StatusBar } from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { COLORS } from '../constants/gameConfig';

export default function MenuScreen({ navigation }) {
  const startGame = (difficulty) => {
    navigation.navigate('Game', { difficulty });
  };

  return (
    <View style={styles.container}>
      <StatusBar barStyle="light-content" />
      
      <View style={styles.header}>
        <View style={styles.titleContainer}>
          <Ionicons name="game-controller" size={40} color={COLORS.primary} />
          <Text style={styles.title}>PONG-O</Text>
          <Ionicons name="game-controller" size={40} color={COLORS.primary} />
        </View>
        <Text style={styles.subtitle}>Choose Your Challenge</Text>
      </View>

      <View style={styles.buttonContainer}>
        <TouchableOpacity
          style={[styles.button, styles.easyButton]}
          onPress={() => startGame('EASY')}
        >
          <View style={styles.buttonContent}>
            <Ionicons name="happy-outline" size={32} color={COLORS.text} />
            <Text style={styles.buttonText}>EASY</Text>
            <View style={styles.rewardContainer}>
              <Ionicons name="wallet" size={16} color={COLORS.text} />
              <Text style={styles.rewardText}> 10 coins</Text>
            </View>
          </View>
        </TouchableOpacity>

        <TouchableOpacity
          style={[styles.button, styles.mediumButton]}
          onPress={() => startGame('MEDIUM')}
        >
          <View style={styles.buttonContent}>
            <Ionicons name="flame-outline" size={32} color={COLORS.text} />
            <Text style={styles.buttonText}>MEDIUM</Text>
            <View style={styles.rewardContainer}>
              <Ionicons name="wallet" size={16} color={COLORS.text} />
              <Text style={styles.rewardText}> 50 coins</Text>
            </View>
          </View>
        </TouchableOpacity>

        <TouchableOpacity
          style={[styles.button, styles.hardButton]}
          onPress={() => startGame('HARD')}
        >
          <View style={styles.buttonContent}>
            <Ionicons name="skull-outline" size={32} color={COLORS.text} />
            <Text style={styles.buttonText}>HARD</Text>
            <View style={styles.rewardContainer}>
              <Ionicons name="wallet" size={16} color={COLORS.text} />
              <Text style={styles.rewardText}> 100 coins</Text>
            </View>
          </View>
        </TouchableOpacity>
      </View>

      <View style={styles.footer}>
        <View style={styles.tipContainer}>
          <Ionicons name="information-circle" size={20} color={COLORS.primary} />
          <Text style={styles.footerText}> Rally bonus: +5 coins every 5 hits!</Text>
        </View>
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: COLORS.background,
    paddingTop: 70,
    paddingBottom: 40,
    paddingHorizontal: 20,
  },
  header: {
    alignItems: 'center',
    marginBottom: 60,
    marginTop: 20,
  },
  titleContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 16,
    justifyContent: 'center',
  },
  title: {
    fontSize: 56,
    fontWeight: 'bold',
    color: COLORS.primary,
    letterSpacing: 6,
    marginHorizontal: 12,
  },
  subtitle: {
    fontSize: 18,
    color: COLORS.textSecondary,
    letterSpacing: 3,
    textTransform: 'uppercase',
  },
  buttonContainer: {
    paddingHorizontal: 20,
    flex: 1,
    justifyContent: 'center',
  },
  button: {
    padding: 24,
    borderRadius: 20,
    alignItems: 'center',
    marginBottom: 20,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 6 },
    shadowOpacity: 0.4,
    shadowRadius: 10,
    elevation: 10,
    borderWidth: 3,
    borderColor: 'rgba(255,255,255,0.1)',
  },
  buttonContent: {
    alignItems: 'center',
  },
  easyButton: {
    backgroundColor: COLORS.accent,
  },
  mediumButton: {
    backgroundColor: COLORS.primary,
  },
  hardButton: {
    backgroundColor: COLORS.aiPaddle,
  },
  buttonText: {
    fontSize: 36,
    fontWeight: 'bold',
    color: COLORS.text,
    letterSpacing: 4,
    marginTop: 8,
    marginBottom: 8,
  },
  rewardContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    marginTop: 4,
  },
  rewardText: {
    fontSize: 16,
    color: COLORS.text,
    fontWeight: '600',
  },
  footer: {
    alignItems: 'center',
    paddingHorizontal: 20,
    marginTop: 30,
  },
  tipContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: 'rgba(59, 130, 246, 0.1)',
    paddingVertical: 12,
    paddingHorizontal: 20,
    borderRadius: 12,
    borderWidth: 1,
    borderColor: COLORS.primary,
  },
  footerText: {
    fontSize: 15,
    color: COLORS.textSecondary,
    lineHeight: 22,
  },
});
