// App.tsx
import { StatusBar } from 'expo-status-bar';
import React, { useState, useEffect } from 'react';
import { StyleSheet, View, Platform, Alert } from 'react-native';
import AsyncStorage from '@react-native-async-storage/async-storage';

import LoginScreen from './auth/LoginScreen';
import RegisterScreen from './auth/RegisterScreen';
import ProfileSetupScreen from './auth/ProfileSetupScreen';
import HomeScreen from './auth/HomeScreen';

const USERS_KEY = '@kasirapp_users';

type UserData = {
  name: string;
  email: string;
  password: string;
  namaToko?: string;
  alamat?: string;
  telepon?: string;
  isProfileComplete?: boolean;
};

export default function App() {
  const [isLoggedIn, setIsLoggedIn] = useState(false);
  const [currentUserEmail, setCurrentUserEmail] = useState<string | null>(null);
  const [showRegister, setShowRegister] = useState(false);
  const [users, setUsers] = useState<Record<string, UserData>>({});

  useEffect(() => {
    const loadUsers = async () => {
      try {
        const jsonValue = await AsyncStorage.getItem(USERS_KEY);
        if (jsonValue) {
          const parsed = JSON.parse(jsonValue);
          console.log('Data dimuat dari AsyncStorage:', parsed);
          setUsers(parsed);
        }
      } catch (e) {
        console.error('Gagal memuat data:', e);
      }
    };
    loadUsers();
  }, []);

  const saveUsers = async (newUsers: typeof users) => {
    try {
      await AsyncStorage.setItem(USERS_KEY, JSON.stringify(newUsers));
      console.log('Data disimpan ke AsyncStorage');
    } catch (e) {
      console.error('Gagal menyimpan:', e);
    }
  };

  const handleRegister = (name: string, email: string, password: string) => {
    const trimmedEmail = email.trim().toLowerCase();
    if (users[trimmedEmail]) {
      Alert.alert('Gagal', 'Email sudah terdaftar');
      return false;
    }

    const newUser: UserData = {
      name: name.trim(),
      email: trimmedEmail,
      password,
      isProfileComplete: false,
    };

    const updatedUsers = { ...users, [trimmedEmail]: newUser };
    setUsers(updatedUsers);
    saveUsers(updatedUsers);

    setCurrentUserEmail(trimmedEmail);
    setIsLoggedIn(true);

    Alert.alert(
      'Pendaftaran Berhasil',
      'Akun berhasil dibuat! Silakan lengkapi profil toko Anda.',
      [{ text: 'OK' }]
    );

    return true;
  };

  const handleLogin = (email: string, password: string) => {
    const trimmedEmail = email.trim().toLowerCase();

    if (!users[trimmedEmail]) {
      Alert.alert('Gagal', 'Akun tidak ditemukan. Silakan daftar terlebih dahulu.');
      return false;
    }

    if (users[trimmedEmail].password !== password) {
      Alert.alert('Gagal', 'Password salah');
      return false;
    }

    setCurrentUserEmail(trimmedEmail);
    setIsLoggedIn(true);

    Alert.alert(
      'Login Berhasil',
      `Selamat datang kembali, ${users[trimmedEmail].name}!`,
      [{ text: 'OK' }]
    );

    return true;
  };

  const handleProfileComplete = (updates: Partial<UserData>) => {
    if (!currentUserEmail) return;

    const updatedUser = {
      ...users[currentUserEmail],
      ...updates,
      isProfileComplete: true,
    };

    const updatedUsers = { ...users, [currentUserEmail]: updatedUser };
    setUsers(updatedUsers);
    saveUsers(updatedUsers);

    Alert.alert('Sukses', 'Profil toko telah dilengkapi. Selamat datang di beranda!');
  };

  const currentUser = currentUserEmail ? users[currentUserEmail] : null;

  if (!isLoggedIn) {
    return (
      <View style={styles.container}>
        {showRegister ? (
          <RegisterScreen onRegister={handleRegister} onBackToLogin={() => setShowRegister(false)} />
        ) : (
          <LoginScreen onLogin={handleLogin} switchToRegister={() => setShowRegister(true)} />
        )}
        {Platform.OS !== 'web' && <StatusBar style="dark" />}
      </View>
    );
  }

  if (currentUser && !currentUser.isProfileComplete) {
    return (
      <ProfileSetupScreen
        user={currentUser}
        onComplete={handleProfileComplete}
        onLogout={() => {
          setIsLoggedIn(false);
          setCurrentUserEmail(null);
        }}
      />
    );
  }

  return currentUser ? (
    <HomeScreen
      user={currentUser}
      onLogout={() => {
        setIsLoggedIn(false);
        setCurrentUserEmail(null);
      }}
    />
  ) : null;
}

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: '#f8f9fc' },
}); 