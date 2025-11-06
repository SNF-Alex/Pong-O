import React, { createContext, useState, useEffect, useContext } from 'react';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { deleteAllUserData } from '../utils/storage';
import { Platform } from 'react-native';
import * as AppleAuthentication from 'expo-apple-authentication';
import * as AuthSession from 'expo-auth-session';
import * as Crypto from 'expo-crypto';
import { syncWithCloud } from '../utils/storage';

const AuthContext = createContext();

const AUTH_KEYS = {
  USER_ID: '@ponggame:user_id',
  USER_DISPLAY_NAME: '@ponggame:user_display_name',
  AUTH_TYPE: '@ponggame:auth_type', // 'apple', 'google', or null
  HAS_SEEN_WARNING: '@ponggame:has_seen_warning',
  LAST_SYNC: '@ponggame:last_sync',
};

export const AuthProvider = ({ children }) => {
  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(true);
  const [hasSeenWarning, setHasSeenWarning] = useState(false);

  useEffect(() => {
    loadAuthState();
  }, []);

  const loadAuthState = async () => {
    try {
      const userId = await AsyncStorage.getItem(AUTH_KEYS.USER_ID);
      const displayName = await AsyncStorage.getItem(AUTH_KEYS.USER_DISPLAY_NAME);
      const authType = await AsyncStorage.getItem(AUTH_KEYS.AUTH_TYPE);
      const seenWarning = await AsyncStorage.getItem(AUTH_KEYS.HAS_SEEN_WARNING);

      if (userId && authType) {
        setUser({
          id: userId,
          displayName: displayName || 'Player',
          authType: authType,
        });
      }

      setHasSeenWarning(seenWarning === 'true');
    } catch (error) {
      console.error('Error loading auth state:', error);
    } finally {
      setLoading(false);
    }
  };

    // Sign in with Apple (iOS)
  const signInWithApple = async () => {
    try {
      if (Platform.OS !== 'ios') {
        console.warn('Apple Sign In is only available on iOS');
        return false;
      }

      // Check if Apple Sign In is available
      const isAvailable = await AppleAuthentication.isAvailableAsync();
      if (!isAvailable) {
        console.warn('Apple Sign In is not available on this device');
        return false;
      }

      const credential = await AppleAuthentication.signInAsync({
        requestedScopes: [
          AppleAuthentication.AppleAuthenticationScope.FULL_NAME,
          AppleAuthentication.AppleAuthenticationScope.EMAIL,
        ],
      });

      // Extract user information
      const userId = credential.user;
      const displayName = credential.fullName?.givenName 
        ? `${credential.fullName.givenName} ${credential.fullName.familyName || ''}`.trim()
        : 'Player';

      // Save authentication state
      await saveAuthState(userId, displayName, 'apple');

      setUser({
        id: userId,
        displayName,
        authType: 'apple',
      });

      // Mark warning as seen since user signed in
      await markWarningAsSeen();

      console.log('Apple Sign In successful:', userId);
      return true;
    } catch (error) {
      if (error.code === 'ERR_CANCELED') {
        console.log('Apple Sign In was canceled');
      } else {
        console.error('Apple Sign In error:', error);
      }
      return false;
    }
  };

  const signInWithGoogle = async () => {
    try {
      if (Platform.OS !== 'android') {
        console.warn('Google Play Games is only available on Android');
        return;
      }

      // Google Play Games authentication using OAuth 2.0
      // Note: You'll need to configure this in Google Play Console with your SHA-1 fingerprint
      const redirectUri = AuthSession.makeRedirectUri({
        scheme: 'com.snfalex.pongo'
      });

      // For production, replace with your actual Google Play Games Client ID
      // Get this from Google Play Console > Game Services > Credentials
      const clientId = 'YOUR_GOOGLE_PLAY_GAMES_CLIENT_ID.apps.googleusercontent.com';
      
      const discovery = {
        authorizationEndpoint: 'https://accounts.google.com/o/oauth2/v2/auth',
        tokenEndpoint: 'https://oauth2.googleapis.com/token',
      };

      const request = new AuthSession.AuthRequest({
        clientId,
        scopes: ['https://www.googleapis.com/auth/games'],
        redirectUri,
        usePKCE: true,
      });

      const result = await request.promptAsync(discovery);

      if (result.type === 'success') {
        // In production, you would use the access token to fetch user info
        // from Google Play Games API
        const userId = 'google_' + Crypto.randomUUID();
        const displayName = 'Google Play User';
        
        await saveAuthState(userId, displayName, 'google');
        
        setUser({
          id: userId,
          displayName,
          authType: 'google',
        });

        // Mark warning as seen since user signed in
        await markWarningAsSeen();

        console.log('Google Play Games Sign In successful');
        return true;
      } else {
        console.log('Google Sign In was canceled or failed');
        return false;
      }
    } catch (error) {
      console.error('Google Sign In Error:', error);
      return false;
    }
  };

  const saveAuthState = async (userId, displayName, authType) => {
    try {
      await AsyncStorage.setItem(AUTH_KEYS.USER_ID, userId);
      await AsyncStorage.setItem(AUTH_KEYS.USER_DISPLAY_NAME, displayName);
      await AsyncStorage.setItem(AUTH_KEYS.AUTH_TYPE, authType);

      setUser({
        id: userId,
        displayName: displayName,
        authType: authType,
      });

      // Sync with cloud after successful sign in
      await syncWithCloud(userId);

      return true;
    } catch (error) {
      console.error('Error saving auth state:', error);
      return false;
    }
  };

  const signOut = async () => {
    try {
      await AsyncStorage.multiRemove([
        AUTH_KEYS.USER_ID,
        AUTH_KEYS.USER_DISPLAY_NAME,
        AUTH_KEYS.AUTH_TYPE,
        AUTH_KEYS.LAST_SYNC,
      ]);
      setUser(null);
      return true;
    } catch (error) {
      console.error('Error signing out:', error);
      return false;
    }
  };

  const markWarningAsSeen = async () => {
    try {
      await AsyncStorage.setItem(AUTH_KEYS.HAS_SEEN_WARNING, 'true');
      setHasSeenWarning(true);
    } catch (error) {
      console.error('Error marking warning as seen:', error);
    }
  };

  const skipSignIn = async () => {
    await markWarningAsSeen();
  };

  const deleteAccount = async () => {
    try {
      // Delete all game data
      await deleteAllUserData();
      
      // Delete auth data
      await AsyncStorage.multiRemove([
        AUTH_KEYS.USER_ID,
        AUTH_KEYS.USER_DISPLAY_NAME,
        AUTH_KEYS.AUTH_TYPE,
        AUTH_KEYS.LAST_SYNC,
        AUTH_KEYS.HAS_SEEN_WARNING,
      ]);
      
      // Clear user state
      setUser(null);
      setHasSeenWarning(false);
      
      console.log('Account deleted successfully');
      return true;
    } catch (error) {
      console.error('Error deleting account:', error);
      return false;
    }
  };

  return (
    <AuthContext.Provider
      value={{
        user,
        loading,
        hasSeenWarning,
        isSignedIn: !!user,
        signInWithApple,
        signInWithGoogle,
        signOut,
        skipSignIn,
        markWarningAsSeen,
        deleteAccount,
      }}
    >
      {children}
    </AuthContext.Provider>
  );
};

export const useAuth = () => {
  const context = useContext(AuthContext);
  if (!context) {
    throw new Error('useAuth must be used within an AuthProvider');
  }
  return context;
};
