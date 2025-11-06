import React, { useState } from 'react';
import { View, Text, TouchableOpacity, StyleSheet, StatusBar, ScrollView, Alert } from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { COLORS } from '../constants/gameConfig';
import { useAuth } from '../contexts/AuthContext';

export default function HelpScreen({ navigation, onNavigate }) {
  const { user, isSignedIn, signOut, deleteAccount } = useAuth();

  const handleLogout = () => {
    Alert.alert(
      'Sign Out',
      'Are you sure you want to sign out? Your progress is saved to the cloud.',
      [
        {
          text: 'Cancel',
          style: 'cancel'
        },
        {
          text: 'Sign Out',
          style: 'destructive',
          onPress: async () => {
            const success = await signOut();
            if (success) {
              Alert.alert('Signed Out', 'You have been signed out successfully.');
              // Navigate back to menu
              if (onNavigate) {
                onNavigate('Menu');
              } else {
                navigation.goBack();
              }
            } else {
              Alert.alert('Error', 'Failed to sign out. Please try again.');
            }
          }
        }
      ]
    );
  };

  const handleDeleteAccount = () => {
    Alert.alert(
      'Delete Account',
      'Are you sure you want to delete your account? This will permanently delete all your game data, including coins, unlocked items, and progress. This action cannot be undone.',
      [
        {
          text: 'Cancel',
          style: 'cancel'
        },
        {
          text: 'Delete Account',
          style: 'destructive',
          onPress: () => {
            // Double confirmation for account deletion
            Alert.alert(
              'Final Confirmation',
              'This will permanently delete all your data. Are you absolutely sure?',
              [
                {
                  text: 'Cancel',
                  style: 'cancel'
                },
                {
                  text: 'Yes, Delete Everything',
                  style: 'destructive',
                  onPress: async () => {
                    const success = await deleteAccount();
                    if (success) {
                      Alert.alert(
                        'Account Deleted',
                        'Your account and all data have been permanently deleted.',
                        [
                          {
                            text: 'OK',
                            onPress: () => {
                              if (onNavigate) {
                                onNavigate('Menu');
                              } else {
                                navigation.goBack();
                              }
                            }
                          }
                        ]
                      );
                    } else {
                      Alert.alert('Error', 'Failed to delete account. Please try again.');
                    }
                  }
                }
              ]
            );
          }
        }
      ]
    );
  };

  return (
    <View style={styles.container}>
      <StatusBar barStyle="light-content" />
      
      {/* Header */}
      <View style={styles.header}>
        <TouchableOpacity 
          style={styles.backButton} 
          onPress={() => onNavigate ? onNavigate('Menu') : navigation.goBack()}
        >
          <Ionicons name="arrow-back" size={24} color={COLORS.text} />
        </TouchableOpacity>
        
        <View style={styles.headerContent}>
          <Text style={styles.title}>HELP & SETTINGS</Text>
          <View style={styles.divider} />
          <Text style={styles.subtitle}>Account & Support</Text>
        </View>

        <View style={styles.backButton} />
      </View>

      <ScrollView style={styles.content} showsVerticalScrollIndicator={false}>
        
        {/* Account Section */}
        <View style={styles.section}>
          <View style={styles.sectionHeader}>
            <Ionicons name="person-circle-outline" size={24} color={COLORS.primary} />
            <Text style={styles.sectionTitle}>Account</Text>
          </View>

          {isSignedIn ? (
            <View style={styles.accountInfo}>
              <View style={styles.accountRow}>
                <Text style={styles.accountLabel}>Status:</Text>
                <View style={styles.statusBadge}>
                  <View style={styles.statusDot} />
                  <Text style={styles.statusText}>Signed In</Text>
                </View>
              </View>

              {user && (
                <>
                  <View style={styles.accountRow}>
                    <Text style={styles.accountLabel}>Display Name:</Text>
                    <Text style={styles.accountValue}>{user.displayName}</Text>
                  </View>

                  <View style={styles.accountRow}>
                    <Text style={styles.accountLabel}>Account Type:</Text>
                    <View style={styles.accountTypeContainer}>
                      <Ionicons 
                        name={user.authType === 'apple' ? 'logo-apple' : 'logo-google-playstore'} 
                        size={16} 
                        color={COLORS.text} 
                      />
                      <Text style={styles.accountValue}>
                        {user.authType === 'apple' ? 'Apple' : 'Google Play Games'}
                      </Text>
                    </View>
                  </View>
                </>
              )}

              <TouchableOpacity 
                style={styles.logoutButton}
                onPress={handleLogout}
              >
                <Ionicons name="log-out-outline" size={20} color="#EF4444" />
                <Text style={styles.logoutButtonText}>Sign Out</Text>
              </TouchableOpacity>

              <TouchableOpacity 
                style={styles.deleteAccountButton}
                onPress={handleDeleteAccount}
              >
                <Ionicons name="trash-outline" size={20} color="#DC2626" />
                <Text style={styles.deleteAccountButtonText}>Delete Account</Text>
              </TouchableOpacity>
            </View>
          ) : (
            <View style={styles.accountInfo}>
              <View style={styles.accountRow}>
                <Text style={styles.accountLabel}>Status:</Text>
                <View style={[styles.statusBadge, styles.statusBadgeOffline]}>
                  <View style={[styles.statusDot, styles.statusDotOffline]} />
                  <Text style={styles.statusText}>Not Signed In</Text>
                </View>
              </View>

              <Text style={styles.warningText}>
                ⚠️ Your progress is not backed up. Sign in to save your data across devices.
              </Text>

              <TouchableOpacity 
                style={styles.signInButton}
                onPress={() => onNavigate ? onNavigate('SignIn') : navigation.navigate('SignIn')}
              >
                <Ionicons name="log-in-outline" size={20} color="#FFFFFF" />
                <Text style={styles.signInButtonText}>Sign In</Text>
              </TouchableOpacity>
            </View>
          )}
        </View>

        {/* Help Section (Placeholder) */}
        <View style={styles.section}>
          <View style={styles.sectionHeader}>
            <Ionicons name="help-circle-outline" size={24} color={COLORS.primary} />
            <Text style={styles.sectionTitle}>How to Play</Text>
          </View>

          <View style={styles.helpCard}>
            <View style={styles.helpTitleContainer}>
              <Ionicons name="game-controller-outline" size={20} color={COLORS.primary} />
              <Text style={styles.helpTitle}>Game Controls</Text>
            </View>
            <Text style={styles.helpText}>
              • Swipe left/right to move your paddle{'\n'}
              • Choose your paddle position in settings{'\n'}
              • Rally bonus: +10 coins every 5 hits!
            </Text>
          </View>

          <View style={styles.helpCard}>
            <View style={styles.helpTitleContainer}>
              <Ionicons name="gift-outline" size={20} color={COLORS.primary} />
              <Text style={styles.helpTitle}>Loot Boxes</Text>
            </View>
            <Text style={styles.helpText}>
              • Purchase boxes in the Shop{'\n'}
              • Drop the ball in Plinko to win rewards{'\n'}
              • Higher rarities = better rewards!
            </Text>
          </View>

          <View style={styles.helpCard}>
            <View style={styles.helpTitleContainer}>
              <Ionicons name="color-palette-outline" size={20} color={COLORS.primary} />
              <Text style={styles.helpTitle}>Customization</Text>
            </View>
            <Text style={styles.helpText}>
              • Unlock ball skins, paddles, and themes{'\n'}
              • Equip items in your Backpack{'\n'}
              • Legendary Neon theme has 8 color variants!
            </Text>
          </View>
        </View>

        {/* App Info Section */}
        <View style={styles.section}>
          <View style={styles.sectionHeader}>
            <Ionicons name="information-circle-outline" size={24} color={COLORS.primary} />
            <Text style={styles.sectionTitle}>App Info</Text>
          </View>

          <View style={styles.infoRow}>
            <Text style={styles.infoLabel}>Version</Text>
            <Text style={styles.infoValue}>1.0.0</Text>
          </View>

          <View style={styles.infoRow}>
            <Text style={styles.infoLabel}>Developer</Text>
            <Text style={styles.infoValue}>SNF-Alex</Text>
          </View>
        </View>

        <View style={styles.footer}>
          <Text style={styles.footerText}>
            Made with ❤️ for Pong lovers
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
    paddingHorizontal: 20,
    paddingTop: 60,
    paddingBottom: 20,
    backgroundColor: COLORS.surface,
    borderBottomWidth: 1,
    borderBottomColor: 'rgba(59, 130, 246, 0.2)',
  },
  backButton: {
    width: 40,
    height: 40,
    borderRadius: 20,
    backgroundColor: 'rgba(59, 130, 246, 0.1)',
    justifyContent: 'center',
    alignItems: 'center',
  },
  headerContent: {
    flex: 1,
    alignItems: 'center',
    paddingHorizontal: 20,
  },
  title: {
    fontSize: 24,
    fontWeight: '800',
    color: COLORS.text,
    letterSpacing: 2,
    textAlign: 'center',
  },
  divider: {
    width: 60,
    height: 3,
    backgroundColor: COLORS.primary,
    marginVertical: 8,
    borderRadius: 2,
  },
  subtitle: {
    fontSize: 14,
    color: COLORS.textSecondary,
    fontWeight: '500',
    textAlign: 'center',
  },
  content: {
    flex: 1,
    paddingHorizontal: 20,
  },
  section: {
    marginTop: 24,
    marginBottom: 8,
  },
  sectionHeader: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 10,
    marginBottom: 16,
  },
  sectionTitle: {
    fontSize: 18,
    fontWeight: '700',
    color: COLORS.text,
  },
  accountInfo: {
    backgroundColor: COLORS.surface,
    borderRadius: 16,
    padding: 20,
    borderWidth: 1,
    borderColor: 'rgba(59, 130, 246, 0.2)',
  },
  accountRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 12,
  },
  accountLabel: {
    fontSize: 14,
    color: COLORS.textSecondary,
    fontWeight: '500',
  },
  accountValue: {
    fontSize: 14,
    color: COLORS.text,
    fontWeight: '600',
  },
  accountTypeContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 6,
  },
  statusBadge: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 6,
    backgroundColor: 'rgba(16, 185, 129, 0.15)',
    paddingHorizontal: 12,
    paddingVertical: 6,
    borderRadius: 12,
    borderWidth: 1,
    borderColor: 'rgba(16, 185, 129, 0.3)',
  },
  statusBadgeOffline: {
    backgroundColor: 'rgba(239, 68, 68, 0.15)',
    borderColor: 'rgba(239, 68, 68, 0.3)',
  },
  statusDot: {
    width: 8,
    height: 8,
    borderRadius: 4,
    backgroundColor: '#10B981',
  },
  statusDotOffline: {
    backgroundColor: '#EF4444',
  },
  statusText: {
    fontSize: 13,
    color: COLORS.text,
    fontWeight: '600',
  },
  warningText: {
    fontSize: 13,
    color: '#F59E0B',
    fontWeight: '500',
    marginTop: 8,
    marginBottom: 16,
    lineHeight: 20,
  },
  logoutButton: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    gap: 8,
    backgroundColor: 'rgba(239, 68, 68, 0.1)',
    paddingVertical: 14,
    paddingHorizontal: 20,
    borderRadius: 12,
    marginTop: 16,
    borderWidth: 1,
    borderColor: 'rgba(239, 68, 68, 0.3)',
  },
  logoutButtonText: {
    fontSize: 15,
    fontWeight: '700',
    color: '#EF4444',
  },
  deleteAccountButton: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    gap: 8,
    backgroundColor: 'rgba(220, 38, 38, 0.1)',
    paddingVertical: 14,
    paddingHorizontal: 20,
    borderRadius: 12,
    marginTop: 12,
    borderWidth: 1,
    borderColor: 'rgba(220, 38, 38, 0.3)',
  },
  deleteAccountButtonText: {
    fontSize: 15,
    fontWeight: '700',
    color: '#DC2626',
  },
  signInButton: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    gap: 8,
    backgroundColor: COLORS.primary,
    paddingVertical: 14,
    paddingHorizontal: 20,
    borderRadius: 12,
  },
  signInButtonText: {
    fontSize: 15,
    fontWeight: '700',
    color: '#FFFFFF',
  },
  helpCard: {
    backgroundColor: COLORS.surface,
    borderRadius: 12,
    padding: 16,
    marginBottom: 12,
    borderWidth: 1,
    borderColor: 'rgba(59, 130, 246, 0.15)',
  },
  helpTitleContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 8,
    marginBottom: 8,
  },
  helpTitle: {
    fontSize: 15,
    fontWeight: '700',
    color: COLORS.text,
  },
  helpText: {
    fontSize: 14,
    color: COLORS.textSecondary,
    lineHeight: 22,
  },
  infoRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    backgroundColor: COLORS.surface,
    paddingVertical: 14,
    paddingHorizontal: 16,
    borderRadius: 10,
    marginBottom: 8,
    borderWidth: 1,
    borderColor: 'rgba(59, 130, 246, 0.15)',
  },
  infoLabel: {
    fontSize: 14,
    color: COLORS.textSecondary,
    fontWeight: '500',
  },
  infoValue: {
    fontSize: 14,
    color: COLORS.text,
    fontWeight: '600',
  },
  footer: {
    alignItems: 'center',
    paddingVertical: 30,
    marginTop: 20,
  },
  footerText: {
    fontSize: 13,
    color: COLORS.textSecondary,
    fontStyle: 'italic',
  },
});
