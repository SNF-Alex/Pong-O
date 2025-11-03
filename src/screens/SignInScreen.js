import React, { useState } from 'react';
import { View, Text, TouchableOpacity, StyleSheet, StatusBar, Platform, Alert, Modal } from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { COLORS } from '../constants/gameConfig';
import { useAuth } from '../contexts/AuthContext';

export default function SignInScreen({ navigation, onNavigate }) {
  const { signInWithApple, signInWithGoogle, skipSignIn } = useAuth();
  const [showWarning, setShowWarning] = useState(false);

  const handleAppleSignIn = async () => {
    const success = await signInWithApple();
    // App.js will automatically navigate to Menu when isSignedIn becomes true
    if (!success) {
      Alert.alert(
        'Sign In Failed',
        'Unable to sign in with Apple. Please try again.',
        [{ text: 'OK' }]
      );
    }
  };

  const handleGoogleSignIn = async () => {
    const success = await signInWithGoogle();
    // App.js will automatically navigate to Menu when isSignedIn becomes true
    if (!success) {
      Alert.alert(
        'Sign In Failed',
        'Unable to sign in with Google Play Games. Please try again.',
        [{ text: 'OK' }]
      );
    }
  };

  const handleSkip = () => {
    setShowWarning(true);
  };

  const confirmSkip = async () => {
    await skipSignIn();
    setShowWarning(false);
    // App.js will automatically navigate to Menu when hasSeenWarning becomes true
  };

  return (
    <View style={styles.container}>
      <StatusBar barStyle="light-content" />

      {/* Logo/Title Area */}
      <View style={styles.header}>
        <Text style={styles.title}>PONG-O</Text>
        <View style={styles.divider} />
        <Text style={styles.subtitle}>CLASSIC ARCADE REIMAGINED</Text>
      </View>

      {/* Sign In Options */}
      <View style={styles.content}>
        <View style={styles.infoBox}>
          <Ionicons name="cloud-outline" size={40} color={COLORS.primary} />
          <Text style={styles.infoTitle}>Save Your Progress</Text>
          <Text style={styles.infoText}>
            Sign in to save your progress across devices and never lose your unlocked skins, themes, and coins.
          </Text>
        </View>

        <View style={styles.buttonsContainer}>
          {/* Apple Sign In (iOS only) */}
          {Platform.OS === 'ios' && (
            <TouchableOpacity
              style={[styles.signInButton, styles.appleButton]}
              onPress={handleAppleSignIn}
              activeOpacity={0.8}
            >
              <Ionicons name="logo-apple" size={24} color="#000" />
              <Text style={styles.appleButtonText}>Sign in with Apple</Text>
            </TouchableOpacity>
          )}

          {/* Google Play Games (Android only) */}
          {Platform.OS === 'android' && (
            <TouchableOpacity
              style={[styles.signInButton, styles.googleButton]}
              onPress={handleGoogleSignIn}
              activeOpacity={0.8}
            >
              <Ionicons name="logo-google" size={24} color="#FFF" />
              <Text style={styles.googleButtonText}>Sign in with Google Play</Text>
            </TouchableOpacity>
          )}

          {/* Skip Button */}
          <TouchableOpacity
            style={styles.skipButton}
            onPress={handleSkip}
            activeOpacity={0.8}
          >
            <Text style={styles.skipButtonText}>Continue Without Signing In</Text>
          </TouchableOpacity>
        </View>

        <View style={styles.footer}>
          <Ionicons name="information-circle-outline" size={16} color={COLORS.textSecondary} />
          <Text style={styles.footerText}>
            By signing in, you agree to our Terms of Service and Privacy Policy
          </Text>
        </View>
      </View>

      {/* Warning Modal */}
      <Modal
        visible={showWarning}
        transparent={true}
        animationType="fade"
        onRequestClose={() => setShowWarning(false)}
      >
        <View style={styles.modalOverlay}>
          <View style={styles.warningModal}>
            <Ionicons name="warning" size={60} color="#F59E0B" />
            
            <Text style={styles.warningTitle}>⚠️ Warning</Text>
            
            <Text style={styles.warningText}>
              Without signing in, your progress is only saved locally on this device.
            </Text>

            <View style={styles.warningList}>
              <View style={styles.warningItem}>
                <Ionicons name="close-circle" size={20} color="#EF4444" />
                <Text style={styles.warningItemText}>
                  Uninstalling the app will permanently delete all progress
                </Text>
              </View>
              <View style={styles.warningItem}>
                <Ionicons name="close-circle" size={20} color="#EF4444" />
                <Text style={styles.warningItemText}>
                  Cannot transfer progress to another device
                </Text>
              </View>
              <View style={styles.warningItem}>
                <Ionicons name="close-circle" size={20} color="#EF4444" />
                <Text style={styles.warningItemText}>
                  No cloud backup if device is lost or damaged
                </Text>
              </View>
            </View>

            <View style={styles.warningButtons}>
              <TouchableOpacity
                style={[styles.warningButton, styles.goBackButton]}
                onPress={() => setShowWarning(false)}
                activeOpacity={0.8}
              >
                <Text style={styles.goBackButtonText}>Go Back & Sign In</Text>
              </TouchableOpacity>

              <TouchableOpacity
                style={[styles.warningButton, styles.continueButton]}
                onPress={confirmSkip}
                activeOpacity={0.8}
              >
                <Text style={styles.continueButtonText}>I Understand, Continue</Text>
              </TouchableOpacity>
            </View>
          </View>
        </View>
      </Modal>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: COLORS.background,
  },
  header: {
    alignItems: 'center',
    paddingTop: 100,
    paddingBottom: 40,
  },
  title: {
    fontSize: 56,
    fontWeight: '300',
    color: COLORS.text,
    letterSpacing: 16,
    marginBottom: 16,
  },
  divider: {
    width: 80,
    height: 3,
    backgroundColor: COLORS.primary,
    marginBottom: 16,
    borderRadius: 2,
  },
  subtitle: {
    fontSize: 12,
    color: COLORS.textSecondary,
    letterSpacing: 3,
    fontWeight: '500',
  },
  content: {
    flex: 1,
    paddingHorizontal: 30,
    justifyContent: 'space-between',
    paddingBottom: 50,
  },
  infoBox: {
    backgroundColor: 'rgba(59, 130, 246, 0.1)',
    padding: 24,
    borderRadius: 16,
    borderWidth: 1,
    borderColor: 'rgba(59, 130, 246, 0.3)',
    alignItems: 'center',
    marginBottom: 30,
  },
  infoTitle: {
    fontSize: 20,
    fontWeight: '600',
    color: COLORS.text,
    marginTop: 12,
    marginBottom: 8,
  },
  infoText: {
    fontSize: 14,
    color: COLORS.textSecondary,
    textAlign: 'center',
    lineHeight: 20,
  },
  buttonsContainer: {
    gap: 16,
  },
  signInButton: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    paddingVertical: 16,
    borderRadius: 12,
    gap: 12,
  },
  appleButton: {
    backgroundColor: '#FFFFFF',
  },
  appleButtonText: {
    fontSize: 16,
    fontWeight: '600',
    color: '#000',
    letterSpacing: 0.5,
  },
  googleButton: {
    backgroundColor: '#4285F4',
  },
  googleButtonText: {
    fontSize: 16,
    fontWeight: '600',
    color: '#FFF',
    letterSpacing: 0.5,
  },
  skipButton: {
    paddingVertical: 16,
    borderRadius: 12,
    borderWidth: 1,
    borderColor: 'rgba(255, 255, 255, 0.2)',
    alignItems: 'center',
  },
  skipButtonText: {
    fontSize: 14,
    fontWeight: '600',
    color: COLORS.textSecondary,
    letterSpacing: 0.5,
  },
  footer: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    gap: 8,
    paddingHorizontal: 20,
  },
  footerText: {
    fontSize: 11,
    color: COLORS.textSecondary,
    textAlign: 'center',
    flex: 1,
    lineHeight: 16,
  },
  modalOverlay: {
    flex: 1,
    backgroundColor: 'rgba(0, 0, 0, 0.9)',
    justifyContent: 'center',
    alignItems: 'center',
    padding: 20,
  },
  warningModal: {
    backgroundColor: COLORS.surface,
    borderRadius: 20,
    padding: 30,
    width: '100%',
    maxWidth: 400,
    borderWidth: 2,
    borderColor: '#F59E0B',
    alignItems: 'center',
  },
  warningTitle: {
    fontSize: 28,
    fontWeight: '700',
    color: '#F59E0B',
    marginTop: 16,
    marginBottom: 12,
    letterSpacing: 1,
  },
  warningText: {
    fontSize: 16,
    color: COLORS.text,
    textAlign: 'center',
    marginBottom: 20,
    lineHeight: 22,
  },
  warningList: {
    width: '100%',
    marginBottom: 24,
    gap: 12,
  },
  warningItem: {
    flexDirection: 'row',
    alignItems: 'flex-start',
    gap: 10,
  },
  warningItemText: {
    flex: 1,
    fontSize: 14,
    color: COLORS.textSecondary,
    lineHeight: 20,
  },
  warningButtons: {
    width: '100%',
    gap: 12,
  },
  warningButton: {
    paddingVertical: 14,
    borderRadius: 12,
    alignItems: 'center',
  },
  goBackButton: {
    backgroundColor: COLORS.primary,
  },
  goBackButtonText: {
    fontSize: 16,
    fontWeight: '700',
    color: '#000',
    letterSpacing: 0.5,
  },
  continueButton: {
    backgroundColor: 'transparent',
    borderWidth: 1,
    borderColor: 'rgba(255, 255, 255, 0.3)',
  },
  continueButtonText: {
    fontSize: 14,
    fontWeight: '600',
    color: COLORS.textSecondary,
    letterSpacing: 0.5,
  },
});
