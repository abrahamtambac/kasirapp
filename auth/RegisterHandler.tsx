// auth/RegisterHandler.tsx
import AsyncStorage from '@react-native-async-storage/async-storage';
import { Alert } from 'react-native';

const USERS_KEY = '@kasirapp_users';

type RegisterData = {
  name: string;
  email: string;
  password: string;
};

type RegisterResult = {
  success: boolean;
  message?: string;
  userEmail?: string; // untuk auto-login
};

/**
 * Fungsi utama untuk memproses pendaftaran user baru
 * @param data - Data dari form register (name, email, password)
 * @param currentUsers - Data users yang sudah ada dari state App.tsx
 * @param setUsers - Fungsi setter state users dari App.tsx
 * @param setCurrentUserEmail - Fungsi setter currentUserEmail dari App.tsx
 * @param setIsLoggedIn - Fungsi setter isLoggedIn dari App.tsx
 * @returns Promise<RegisterResult>
 */
export const handleRegistration = async (
  data: RegisterData,
  currentUsers: Record<string, any>,
  setUsers: (users: Record<string, any>) => void,
  setCurrentUserEmail: (email: string | null) => void,
  setIsLoggedIn: (loggedIn: boolean) => void
): Promise<RegisterResult> => {
  const { name, email, password } = data;

  // Validasi dasar
  if (!name.trim() || !email.trim() || !password.trim()) {
    Alert.alert('Perhatian', 'Nama lengkap, email, dan password wajib diisi');
    return { success: false, message: 'Field wajib tidak lengkap' };
  }

  if (password.length < 6) {
    Alert.alert('Perhatian', 'Password minimal 6 karakter');
    return { success: false, message: 'Password terlalu pendek' };
  }

  const trimmedEmail = email.trim().toLowerCase();

  // Cek email sudah terdaftar atau belum
  if (currentUsers[trimmedEmail]) {
    Alert.alert('Gagal', 'Email sudah terdaftar. Silakan gunakan email lain atau masuk.');
    return { success: false, message: 'Email sudah terdaftar' };
  }

  // Buat data user baru
  const newUser = {
    name: name.trim(),
    email: trimmedEmail,
    password, // plain text (hanya untuk prototype, jangan gunakan di produksi)
    isProfileComplete: false,
  };

  // Update state users
  const updatedUsers = {
    ...currentUsers,
    [trimmedEmail]: newUser,
  };

  setUsers(updatedUsers);

  // Simpan ke AsyncStorage
  try {
    await AsyncStorage.setItem(USERS_KEY, JSON.stringify(updatedUsers));
    console.log('Pendaftaran berhasil disimpan ke AsyncStorage');
  } catch (error) {
    console.error('Gagal menyimpan ke AsyncStorage:', error);
    Alert.alert('Error', 'Gagal menyimpan data. Coba lagi nanti.');
    return { success: false, message: 'Gagal menyimpan data' };
  }

  // Auto login setelah daftar berhasil
  setCurrentUserEmail(trimmedEmail);
  setIsLoggedIn(true);

  Alert.alert(
    'Pendaftaran Berhasil',
    'Akun berhasil dibuat! Silakan lengkapi profil toko Anda.',
    [{ text: 'OK' }]
  );

  return {
    success: true,
    message: 'Pendaftaran berhasil',
    userEmail: trimmedEmail,
  };
};

// Fungsi tambahan: cek apakah user sudah login tapi profil belum lengkap
export const checkProfileStatus = (
  currentUserEmail: string | null,
  users: Record<string, any>
) => {
  if (!currentUserEmail) return false;
  return users[currentUserEmail]?.isProfileComplete === true;
};